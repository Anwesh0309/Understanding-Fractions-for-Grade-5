import React from 'react';

export function MascotBubble({ text, icon = "🦊" }) {
  return (
    <div className="mascot-speech-row">
      <div className="fox-avatar-circle">
        <span className="fox-emoji">{icon}</span>
      </div>
      <div className="speech-bubble-box">
        <p className="speech-text">{text}</p>
      </div>
    </div>
  );
}
