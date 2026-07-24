import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { toggleMute, getMuteState } from '../../utils/audio';

export function AudioToggle() {
  const [muted, setMuted] = useState(getMuteState());

  const handleToggle = () => {
    const newState = toggleMute();
    setMuted(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`audio-toggle-btn ${muted ? 'muted' : 'active'}`}
      title={muted ? "Unmute Audio Narration" : "Mute Audio Narration"}
    >
      {muted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-300" />}
    </button>
  );
}
