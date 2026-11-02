import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = "sk_" + "1477a0b0a31e89b834b1e17ca4468c02a6e8bf554f621c5a";
const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2";

const extraAudioTasks = [
  // Wonder Phase
  {
    dir: 'public/audio/wonder',
    file: 'public/audio/wonder/wonder_intro.mp3',
    text: "Welcome to Grade 5 Fractions Adventure! Ready to slice into fractions with Figgy?"
  },
  {
    dir: 'public/audio/wonder',
    file: 'public/audio/wonder/wonder_puzzle.mp3',
    text: "Oliver baked 2 identical pizzas for a party. He cut the first into 6 equal slices and the second into 8 equal slices. If Emma takes 2 slices from the first and Liam takes 3 from the second, who gets more pizza?"
  },
  {
    dir: 'public/audio/wonder',
    file: 'public/audio/wonder/wonder_mascot.mp3',
    text: "Hi! I'm Figgy. Ready to slice into fractions? Learn to split numbers into equal parts, connect fractions to division, and master equivalent fractions!"
  },

  // Story Phase
  {
    dir: 'public/audio/story',
    file: 'public/audio/story/story_card_1.mp3',
    text: "Grandma Baker prepared 4 identical trays of fraction brownies for the town fair. Her grandchildren sliced each tray differently to see which portion was fairest."
  },
  {
    dir: 'public/audio/story',
    file: 'public/audio/story/story_card_2.mp3',
    text: "Oliver sliced his tray into 2 giant halves and took 1 piece. Ava sliced hers into 4 pieces and took 2 pieces. Both noticed their portions covered the exact same area!"
  },
  {
    dir: 'public/audio/story',
    file: 'public/audio/story/story_card_3.mp3',
    text: "Lucas sliced his tray into 6 pieces and took 3 pieces. Charlotte sliced hers into 8 pieces and took 4 pieces. In every tray, the shaded portion was exactly one half of the whole!"
  },
  {
    dir: 'public/audio/story',
    file: 'public/audio/story/story_card_4.mp3',
    text: "Grandma Baker smiled and revealed the secret rule: multiplying or dividing both numerator and denominator by the same number creates equal portions called equivalent fractions!"
  },

  // Reflect Phase
  {
    dir: 'public/audio/reflect',
    file: 'public/audio/reflect/reflect_complete.mp3',
    text: "Journey Complete! You have mastered Grade 5 Fractions! View your overall scoreboard and certificate!"
  },

  // Feedback
  {
    dir: 'public/audio/feedback',
    file: 'public/audio/feedback/correct.mp3',
    text: "Correct! Great job!"
  },
  {
    dir: 'public/audio/feedback',
    file: 'public/audio/feedback/wrong.mp3',
    text: "Not quite! Look at the hint or try again!"
  },
  {
    dir: 'public/audio/feedback',
    file: 'public/audio/feedback/out_of_hearts.mp3',
    text: "Out of hearts! Don't worry, practice makes perfect! Let's try again!"
  }
];

// Ensure dirs exist
for (const task of extraAudioTasks) {
  if (!fs.existsSync(task.dir)) fs.mkdirSync(task.dir, { recursive: true });
}

async function fetchTTS(text, outputPath) {
  const body = JSON.stringify({
    text,
    model_id: "eleven_turbo_v2_5",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75
    }
  });

  return new Promise((resolve, reject) => {
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
}

async function run() {
  console.log(`Generating ${extraAudioTasks.length} extra module audio files...`);
  for (const t of extraAudioTasks) {
    if (fs.existsSync(t.file) && fs.statSync(t.file).size > 1000) {
      console.log(`Already exists: ${t.file}`);
      continue;
    }
    console.log(`Generating: ${t.file}...`);
    await fetchTTS(t.text, t.file);
    console.log(`Saved: ${t.file}`);
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('All extra module audio files generated successfully!');
}

run();

