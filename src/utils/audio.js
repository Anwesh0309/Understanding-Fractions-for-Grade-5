/**
 * Audio Engine for FractionVerse 360
 * Integrates ElevenLabs TTS with Web Speech API fallback.
 */

const ELEVEN_LABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "Xb7hH8MSUJpSbSDYk0k2";
const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "sk_13c95dcde53c821510f9db98accf79e28754c524ab306a3d";

let isMuted = false;
let currentAudio = null;
let currentUtterance = null;
const audioCache = new Map();

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
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export async function speakText(text, options = {}) {
  if (isMuted || !text) return;

  stopNarration();

  // Clean text for speech (convert fraction slash notation to verbal if appropriate)
  const spokenText = text.replace(/(\d+)\/(\d+)/g, "$1 over $2");

  // Try ElevenLabs API if key is present
  if (ELEVEN_LABS_API_KEY && ELEVEN_LABS_API_KEY.startsWith("sk_")) {
    try {
      if (audioCache.has(spokenText)) {
        const cachedUrl = audioCache.get(spokenText);
        playAudioUrl(cachedUrl, options);
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
            stability: 0.35,
            similarity_boost: 0.75,
            style: 0.45,
            use_speaker_boost: true
          }
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        audioCache.set(spokenText, audioUrl);
        playAudioUrl(audioUrl, options);
        return;
      }
    } catch (err) {
      console.warn("ElevenLabs TTS fallback to Web Speech API:", err);
    }
  }

  // Fallback to Web Speech API
  speakWebSpeech(spokenText, options);
}

function playAudioUrl(url, options = {}) {
  const audio = new Audio(url);
  currentAudio = audio;
  if (options.onStart) options.onStart();
  audio.onended = () => {
    currentAudio = null;
    if (options.onEnd) options.onEnd();
  };
  audio.onerror = () => {
    currentAudio = null;
    speakWebSpeech(options.rawText || "", options);
  };
  audio.play().catch(e => {
    console.warn("Audio play blocked or failed:", e);
    if (options.onEnd) options.onEnd();
  });
}

function speakWebSpeech(text, options = {}) {
  if (!window.speechSynthesis || isMuted) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  
  // Select a friendly English voice if available
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
  window.speechSynthesis.speak(utterance);
}
