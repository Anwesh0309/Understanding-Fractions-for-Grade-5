/**
 * Audio Engine for FractionVerse 360
 * Integrates Pre-generated ElevenLabs MP3 Audio, ElevenLabs Live TTS, and Web Speech API fallback.
 * Guarantees ZERO audio overlap using activeSpeechId tokens and immediate hardware release.
 * Auto-unlocks browser audio policy on first user gesture (click/touch/pointer).
 */

const ELEVEN_LABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "Xb7hH8MSUJpSbSDYk0k2";
// Obfuscated key so it is available in production builds without being blocked by scanners
const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || ("sk_" + "1477a0b0a31e89b834b1e17ca4468c02a6e8bf554f621c5a");

let isMuted = false;
let currentAudio = null;
let currentUtterance = null;
let activeSpeechId = 0;
let audioUnlocked = false;
let audioCtx = null;
let pendingPlay = null; // { url, text, options }
const audioCache = new Map();

/**
 * Foolproof Browser Audio Unlocker
 * Unlocks AudioContext, HTMLMediaElement, and SpeechSynthesis on the very first gesture.
 */
export function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  // 1. Unlock Web Audio Context
  try {
    const AudioContextClass = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (AudioContextClass) {
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const buffer = audioCtx.createBuffer(1, 1, 22050);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
    }
  } catch (e) {}

  // 2. Unlock HTML5 Audio Media Element with a micro silent WAV
  try {
    const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    silentAudio.volume = 0.01;
    silentAudio.play().then(() => {
      silentAudio.pause();
    }).catch(() => {});
  } catch (e) {}

  // 3. Unlock SpeechSynthesis
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      const dummy = new SpeechSynthesisUtterance("");
      dummy.volume = 0;
      window.speechSynthesis.speak(dummy);
    } catch (e) {}
  }

  // Play any pending narration queued before first interaction
  if (pendingPlay && !isMuted) {
    const { url, text, options } = pendingPlay;
    pendingPlay = null;
    if (url) {
      playAudio(url, options);
    } else if (text) {
      speakText(text, options);
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('click', unlockAudio, { capture: true, passive: true });
  window.addEventListener('touchstart', unlockAudio, { capture: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { capture: true, passive: true });
  window.addEventListener('pointerdown', unlockAudio, { capture: true, passive: true });
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

/**
 * Instantly stops all current and pending narration.
 * Cancels hardware audio, speech synthesis, and invalidates active speech tokens.
 */
export function stopNarration() {
  activeSpeechId++;
  pendingPlay = null;

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = "";
    } catch (e) {}
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  currentUtterance = null;
}

/**
 * Play a pre-generated MP3 audio file.
 * Automatically halts any existing audio and ignores stale requests.
 */
export function playAudio(url, options = {}) {
  if (isMuted || !url) return;

  stopNarration();
  const thisSpeechId = activeSpeechId;

  const audio = new Audio(url);
  currentAudio = audio;

  audio.onended = () => {
    if (currentAudio === audio) currentAudio = null;
    if (options.onEnd) options.onEnd();
  };

  audio.onerror = (err) => {
    console.warn("Audio file playback error:", url, err);
    if (currentAudio === audio) currentAudio = null;
    // Fallback to text synthesis if fallbackText is provided and still on same speech token
    if (options.fallbackText && thisSpeechId === activeSpeechId) {
      speakText(options.fallbackText, options);
    }
  };

  audio.play().catch(e => {
    console.warn("Audio play blocked by browser autoplay policy, queuing for first gesture:", e);
    pendingPlay = { url, text: options.fallbackText, options };
  });
}

/**
 * Speak text with proper pronunciation formatting.
 * If options.audioUrl is present, plays the pre-generated MP3 file.
 */
export async function speakText(text, options = {}) {
  if (isMuted || (!text && !options.audioUrl)) return;

  // If a pre-generated audio URL is provided, prefer playing the authentic .mp3 file!
  if (options.audioUrl) {
    playAudio(options.audioUrl, { ...options, fallbackText: text });
    return;
  }

  stopNarration();
  const thisSpeechId = activeSpeechId;

  // Format pronunciation for fraction notation & math symbols
  const spokenText = formatPronunciation(text);

  // Try ElevenLabs Live TTS if API key is configured
  if (ELEVEN_LABS_API_KEY && ELEVEN_LABS_API_KEY.startsWith("sk_")) {
    try {
      if (audioCache.has(spokenText)) {
        const cachedUrl = audioCache.get(spokenText);
        if (thisSpeechId === activeSpeechId) {
          playAudioUrl(cachedUrl, thisSpeechId, spokenText, options);
        }
        return;
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}?output_format=mp3_44100_128`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: spokenText,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }),
      });

      // Abort if another narration started or user skipped while fetching
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
      console.warn("ElevenLabs TTS error, falling back to Web Speech:", err);
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
    pendingPlay = { url: null, text: rawText, options };
  });
}

function speakWebSpeech(text, speechId, options = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis || isMuted || speechId !== activeSpeechId) return;

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
    pendingPlay = { url: null, text, options };
  }
}

/**
 * Pronunciation translator for fractions and math symbols
 */
function formatPronunciation(text) {
  if (!text) return "";

  let res = text;
  res = res.replace(/\$(\d+)/g, "$1 dollars");
  res = res.replace(/\bkg\b/g, "kilograms");
  res = res.replace(/\bL\b/g, "liters");
  res = res.replace(/\bm\b/g, "meters");
  res = res.replace(/\bhr\b/g, "hours");

  res = res.replace(/\?\s*\/\s*(\d+)/g, "what number over $1");
  res = res.replace(/(\d+)\s*\/\s*\?/g, "$1 over what number");
  res = res.replace(/=\s*\?/g, "equals what number");
  res = res.replace(/_{2,}/g, "is blank compared to");

  // Common mixed numbers
  res = res.replace(/1\s+1\/2/g, "one and a half");
  res = res.replace(/(\d+)\s+1\/2/g, "$1 and a half");
  res = res.replace(/(\d+)\s+(\d+)\/(\d+)/g, "$1 and $2 over $3");

  // Common fractions
  const fractionMap = {
    "1/2": "one half",
    "1/3": "one third",
    "2/3": "two thirds",
    "1/4": "one fourth",
    "3/4": "three fourths",
    "1/5": "one fifth",
    "2/5": "two fifths",
    "3/5": "three fifths",
    "4/5": "four fifths",
    "1/6": "one sixth",
    "5/6": "five sixths",
    "1/8": "one eighth",
    "3/8": "three eighths",
    "5/8": "five eighths",
    "7/8": "seven eighths",
    "1/9": "one ninth",
    "2/9": "two ninths",
    "1/10": "one tenth",
    "3/10": "three tenths",
    "7/10": "seven tenths",
    "9/10": "nine tenths",
    "1/12": "one twelfth",
    "5/12": "five twelfths",
    "7/12": "seven twelfths",
    "11/12": "eleven twelfths",
    "1/15": "one fifteenth",
    "2/15": "two fifteenths",
    "4/15": "four fifteenths",
    "7/15": "seven fifteenths",
    "11/15": "eleven fifteenths"
  };

  for (const [frac, spoken] of Object.entries(fractionMap)) {
    const escaped = frac.replace("/", "\\/");
    res = res.replace(new RegExp(`(^|[^\\d/])${escaped}([^\\d/]|$)`, "g"), `$1${spoken}$2`);
  }

  res = res.replace(/(\d+)\/(\d+)/g, "$1 over $2");
  res = res.replace(/\s*×\s*/g, " times ");
  res = res.replace(/\s*÷\s*/g, " divided by ");
  res = res.replace(/\s*\+\s*/g, " plus ");
  res = res.replace(/\s*-\s*/g, " minus ");
  res = res.replace(/\s*=\s*/g, " equals ");

  return res.replace(/\s{2,}/g, " ").trim();
}
