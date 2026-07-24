/**
 * Audio Engine for FractionVerse 360
 * Integrates ElevenLabs TTS with Web Speech API fallback.
 * Guarantees ZERO audio overlap using activeSpeechId tokens.
 * Automatically queues and plays pending narration upon initial user interaction.
 */

const ELEVEN_LABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "Xb7hH8MSUJpSbSDYk0k2";
const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "sk_45ca46876d7388b8f9039bd913169d0a677d388ca2606ec2";

let isMuted = false;
let currentAudio = null;
let currentUtterance = null;
let activeSpeechId = 0;
let audioUnlocked = false;
let pendingSpeechText = null;
let pendingSpeechOptions = null;
const audioCache = new Map();

// Unlock browser speech audio context on first click/touch and play queued narration
function unlockAudio() {
  if (!audioUnlocked) {
    audioUnlocked = true;
    if (window.speechSynthesis) {
      try {
        const dummy = new SpeechSynthesisUtterance("");
        dummy.volume = 0;
        window.speechSynthesis.speak(dummy);
      } catch (e) {}
    }
  }

  if (pendingSpeechText && !isMuted) {
    const textToPlay = pendingSpeechText;
    const optionsToPlay = pendingSpeechOptions;
    pendingSpeechText = null;
    pendingSpeechOptions = null;
    speakText(textToPlay, optionsToPlay);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('pointerdown', unlockAudio);
}

export function toggleMute(mutedState) {
  isMuted = mutedState !== undefined ? mutedState : !isMuted;
  if (isMuted) {
    stopNarration();
  }
  return isMuted;
}

export function getMuteState() {
  return isMuted;
}

export function stopNarration() {
  activeSpeechId++; // Invalidate all pending async audio fetches!
  pendingSpeechText = null;
  pendingSpeechOptions = null;

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = "";
    } catch (e) {}
    currentAudio = null;
  }
  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  currentUtterance = null;
}

export async function speakText(text, options = {}) {
  if (isMuted || !text) return;

  stopNarration();
  const thisSpeechId = activeSpeechId;

  // Pronunciation formatting for fraction slash notation & math symbols
  const spokenText = text
    .replace(/If 3 × 8 = 24, then 24 ÷ 3 = _____/gi, "If 3 times 8 equals 24, then 24 divided by 3 equals what number?")
    .replace(/(\d+)\s*×\s*(\d+)\s*=\s*(\d+)/gi, "$1 times $2 equals $3")
    .replace(/(\d+)\s*÷\s*(\d+)\s*=\s*(\d+)/gi, "$1 divided by $2 equals $3")
    .replace(/(\d+)\s*÷\s*(\d+)/gi, "$1 divided by $2")
    .replace(/1\/2/g, "one half")
    .replace(/1\/3/g, "one third")
    .replace(/2\/3/g, "two thirds")
    .replace(/1\/4/g, "one fourth")
    .replace(/3\/4/g, "three fourths")
    .replace(/1\/5/g, "one fifth")
    .replace(/2\/5/g, "two fifths")
    .replace(/3\/5/g, "three fifths")
    .replace(/4\/5/g, "four fifths")
    .replace(/1\/6/g, "one sixth")
    .replace(/5\/6/g, "five sixths")
    .replace(/1\/8/g, "one eighth")
    .replace(/3\/8/g, "three eighths")
    .replace(/5\/8/g, "five eighths")
    .replace(/7\/8/g, "seven eighths")
    .replace(/1\/12/g, "one twelfth")
    .replace(/5\/12/g, "five twelfths")
    .replace(/7\/12/g, "seven twelfths")
    .replace(/11\/12/g, "eleven twelfths")
    .replace(/(\d+)\/(\d+)/g, "$1 over $2");

  // Try ElevenLabs API if key is present
  if (ELEVEN_LABS_API_KEY && ELEVEN_LABS_API_KEY.startsWith("sk_")) {
    try {
      if (audioCache.has(spokenText)) {
        const cachedUrl = audioCache.get(spokenText);
        if (thisSpeechId === activeSpeechId) {
          playAudioUrl(cachedUrl, thisSpeechId, spokenText, options);
        }
        return;
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: spokenText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.75,
            style: 0.45,
            use_speaker_boost: true
          }
        }),
      });

      // Abort if another narration started while fetching
      if (thisSpeechId !== activeSpeechId) return;

      if (response.ok) {
        const blob = await response.blob();
        if (thisSpeechId !== activeSpeechId) return;

        const audioUrl = URL.createObjectURL(blob);
        audioCache.set(spokenText, audioUrl);
        playAudioUrl(audioUrl, thisSpeechId, spokenText, options);
        return;
      }
    } catch (err) {
      console.warn("ElevenLabs TTS fallback to Web Speech API:", err);
    }
  }

  // Fallback to Web Speech API
  if (thisSpeechId === activeSpeechId) {
    speakWebSpeech(spokenText, thisSpeechId, options);
  }
}

function playAudioUrl(url, speechId, rawText, options = {}) {
  if (speechId !== activeSpeechId) return;

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = "";
    } catch (e) {}
    currentAudio = null;
  }

  const audio = new Audio(url);
  currentAudio = audio;

  audio.onended = () => {
    if (currentAudio === audio) currentAudio = null;
    if (options.onEnd) options.onEnd();
  };

  audio.onerror = () => {
    if (currentAudio === audio) currentAudio = null;
  };

  audio.play().catch(e => {
    console.warn("Audio play blocked by browser autoplay policy, queuing for first gesture:", e);
    pendingSpeechText = rawText;
    pendingSpeechOptions = options;
  });
}

function speakWebSpeech(text, speechId, options = {}) {
  if (!window.speechSynthesis || isMuted || speechId !== activeSpeechId) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Alice") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Zira")));
  if (femaleVoice) utterance.voice = femaleVoice;

  if (options.onStart) utterance.onstart = options.onStart;
  utterance.onend = () => {
    currentUtterance = null;
    if (options.onEnd) options.onEnd();
  };
  utterance.onerror = () => {
    currentUtterance = null;
    if (options.onEnd) options.onEnd();
  };

  currentUtterance = utterance;
  try {
    window.speechSynthesis.speak(utterance);
  } catch(e) {
    pendingSpeechText = text;
    pendingSpeechOptions = options;
  }
}
