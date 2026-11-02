import fs from 'fs';
import path from 'path';
import https from 'https';
import { processedQuestions, simulationGuidance } from './build_question_data.mjs';

// Read API key and Voice ID from environment or local .env
function getEnvVar(key, fallback = "") {
  if (process.env[key]) return process.env[key];
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
    if (match) return match[1].trim();
  }
  return fallback;
}

const API_KEY = getEnvVar("VITE_ELEVENLABS_API_KEY");
const VOICE_ID = getEnvVar("VITE_ELEVENLABS_VOICE_ID", "Xb7hH8MSUJpSbSDYk0k2");

// Ensure output directories exist
const dirs = [
  'public/audio/simulation',
  'public/audio/questions',
  'public/audio/hints'
];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Compile all generation tasks
const tasks = [];

// 1. Simulation Guidance (5 items)
for (const sim of simulationGuidance) {
  tasks.push({
    id: sim.id,
    type: 'simulation',
    text: sim.spokenText,
    file: sim.file
  });
}

// 2. Questions (100 items)
for (const q of processedQuestions) {
  tasks.push({
    id: q.id,
    type: 'question',
    text: q.spokenQuestion,
    file: q.audioFile
  });
}

// 3. Hints (100 items)
for (const q of processedQuestions) {
  tasks.push({
    id: `${q.id}-hint`,
    type: 'hint',
    text: q.spokenHint,
    file: q.hintAudioFile
  });
}

console.log(`Total audio files to check/generate: ${tasks.length}`);

// TTS API caller with retry
async function generateAudio(text, outputPath, retries = 3) {
  // Check if file already exists with good size
  if (fs.existsSync(outputPath)) {
    const stat = fs.statSync(outputPath);
    if (stat.size > 1000) {
      return { skipped: true, size: stat.size };
    }
  }

  const body = JSON.stringify({
    text,
    model_id: "eleven_turbo_v2_5",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75
    }
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: 'api.elevenlabs.io',
          path: `/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
          method: 'POST',
          headers: {
            'xi-api-key': API_KEY,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
          }
        }, res => {
          if (res.statusCode !== 200) {
            let errData = '';
            res.on('data', d => errData += d);
            res.on('end', () => reject(new Error(`ElevenLabs status ${res.statusCode}: ${errData}`)));
            return;
          }

          const fileStream = fs.createWriteStream(outputPath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(true);
          });
          fileStream.on('error', err => reject(err));
        });

        req.on('error', err => reject(err));
        req.write(body);
        req.end();
      });

      const stat = fs.statSync(outputPath);
      return { skipped: false, size: stat.size };
    } catch (err) {
      if (attempt < retries) {
        console.warn(`[Retry ${attempt}/${retries}] for ${outputPath}: ${err.message}`);
        await new Promise(r => setTimeout(r, attempt * 1500));
      } else {
        throw err;
      }
    }
  }
}

// Process tasks with concurrency pool of 3
const CONCURRENCY = 3;
let completed = 0;
let errors = 0;

async function worker(taskQueue) {
  while (taskQueue.length > 0) {
    const task = taskQueue.shift();
    if (!task) break;

    try {
      const res = await generateAudio(task.text, task.file);
      completed++;
      if (completed % 15 === 0 || completed === tasks.length) {
        console.log(`[${completed}/${tasks.length}] Progress: ${Math.round((completed / tasks.length) * 100)}% (${task.id} ${res.skipped ? 'cached' : 'generated'})`);
      }
    } catch (e) {
      errors++;
      console.error(`Error on task ${task.id} (${task.file}):`, e.message);
    }

    // Small delay between requests to be gentle on rate limits
    await new Promise(r => setTimeout(r, 150));
  }
}

async function run() {
  const startTime = Date.now();
  console.log(`Starting audio generation with concurrency ${CONCURRENCY}...`);

  const queue = [...tasks];
  const workers = Array.from({ length: CONCURRENCY }).map(() => worker(queue));
  await Promise.all(workers);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n========================================`);
  console.log(`Generation completed in ${duration}s!`);
  console.log(`Successfully completed: ${completed}/${tasks.length}`);
  console.log(`Errors encountered: ${errors}`);
  console.log(`========================================\n`);
}

run();

