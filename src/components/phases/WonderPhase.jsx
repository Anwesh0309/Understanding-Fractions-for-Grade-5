import React, { useState, useEffect } from 'react';
import { wonderData } from '../../data/wonderContent';
import { MascotBubble } from '../shell/MascotBubble';
import { speakText } from '../../utils/audio';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

export function WonderPhase({ onComplete }) {
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  useEffect(() => {
    if (showPuzzle) {
      speakText(wonderData.puzzleCard.narration);
    }
  }, [showPuzzle]);

  if (!showPuzzle) {
    // HERO INTRO PAGE (Requirement 9)
    return (
      <div className="wonder-hero-wrapper">
        <div className="wonder-hero-card">
          <div className="hero-badge">
            <Sparkles className="w-4 h-4 text-amber-300 inline mr-1" />
            {wonderData.hero.badge}
          </div>

          <h1 className="hero-main-title">
            {wonderData.hero.title} <span className="title-highlight">{wonderData.hero.titleHighlight}</span>
          </h1>

          <div className="my-2">
            <MascotBubble text={wonderData.hero.mascotGreeting} />
          </div>

          <p className="hero-subtitle">{wonderData.hero.subtitle}</p>

          <div className="journey-panel">
            <h3 className="journey-panel-heading">YOUR LEARNING JOURNEY</h3>
            <div className="journey-grid">
              {wonderData.hero.journeySteps.map((step) => (
                <div key={step.id} className="journey-step-card">
                  <div className="journey-num-badge">{step.num}</div>
                  <div className="journey-step-icon">{step.icon}</div>
                  <div className="journey-step-info">
                    <span className="journey-step-name">{step.name}</span>
                    <span className="journey-step-desc">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowPuzzle(true)}
            className="btn-begin-journey"
          >
            🚀 Begin Your Journey!
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // WONDER PUZZLE CARD VIEW
  return (
    <div className="wonder-phase-container">
      <div className="wonder-card-box">
        <MascotBubble text={wonderData.puzzleCard.mascotComment} />

        <div className="wonder-puzzle-content">
          <div className="wonder-icon-badge">🔍</div>
          <h2 className="wonder-puzzle-question">
            {wonderData.puzzleCard.questionText}
          </h2>
          <p className="wonder-hint-italic">
            {wonderData.puzzleCard.hintItalic}
          </p>

          {showTeaser ? (
            <div className="wonder-teaser-revelation animate-fade-in">
              <Lightbulb className="w-5 h-5 text-amber-300 inline mr-2" />
              {wonderData.puzzleCard.teaserPill}
            </div>
          ) : (
            <button
              onClick={() => setShowTeaser(true)}
              className="wonder-hint-pill-btn"
            >
              💡 Tap for a Hint!
            </button>
          )}
        </div>

        <button
          onClick={onComplete}
          className="btn-investigate-gold"
        >
          {wonderData.puzzleCard.investigateBtnText}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
