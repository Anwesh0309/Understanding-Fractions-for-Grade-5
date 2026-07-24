/**
 * Audio Engine for FractionVerse 360
 * Integrates ElevenLabs TTS with Web Speech API fallback.
 * Guarantees ZERO audio overlap using activeSpeechId tokens.
 */

const ELEVEN_LABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "Xb7hH8MSUJpSbSDYk0k2";
const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "sk_45ca46876d7388b8f9039bd913169d0a677d388ca2606ec2";

let isMuted = false;
let currentAudio = null;
let currentUtterance = null;
let activeSpeechId = 0;
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
  activeSpeechId++; // Invalidate all pending async audio fetches!
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

  // Pronunciation formatting for fraction slash notation
  const spokenText = text
    .replace(/1\/2/g, "one half")
    .replace(/1\/3/g, "one third")
    .replace(/2\/3/g, "two thirds")
    .replace(/1\/4/g, "one quarter")
    .replace(/3\/4/g, "three quarters")
    .replace(/1\/5/g, "one fifth")
    .replace(/2\/5/g, "two fifths")
    .replace(/(\d+)\/(\d+)/g, "$1 over $2");

  // Try ElevenLabs API if key is present
  if (ELEVEN_LABS_API_KEY && ELEVEN_LABS_API_KEY.startsWith("sk_")) {
    try {
      if (audioCache.has(spokenText)) {
        const cachedUrl = audioCache.get(spokenText);
        if (thisSpeechId === activeSpeechId) {
          playAudioUrl(cachedUrl, thisSpeechId, options);
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
        playAudioUrl(audioUrl, thisSpeechId, options);
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

function playAudioUrl(url, speechId, options = {}) {
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
    console.warn("Audio play blocked or failed:", e);
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
  window.speechSynthesis.speak(utterance);
}
