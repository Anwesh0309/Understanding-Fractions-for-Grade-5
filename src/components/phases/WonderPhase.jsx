import React, { useState, useEffect } from 'react';
import { wonderData } from '../../data/wonderContent';
import { speakText } from '../../utils/audio';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

export function WonderPhase({ isIntroScreen, setIsIntroScreen, onComplete }) {
  const [showPuzzle, setShowPuzzle] = useState(!isIntroScreen);
  const [showTeaser, setShowTeaser] = useState(false);

  useEffect(() => {
    if (showPuzzle) {
      speakText(wonderData.puzzleCard.narration);
    }
  }, [showPuzzle]);

  const handleBeginJourney = () => {
    setShowPuzzle(true);
    if (setIsIntroScreen) {
      setIsIntroScreen(false);
    }
  };

  if (!showPuzzle) {
    // EXACT MATCH TO INTRO SCREEN SCREENSHOT
    return (
      <div className="wonder-hero-wrapper-ss">
        <div className="hero-ss-container">
          {/* Top Pill Badge */}
          <div className="hero-top-badge-pill">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 inline mr-1.5" />
            Grade 5 · Fractions Adventure
          </div>

          {/* Main Title: Division as Grouping -> Understanding as Fractions */}
          <h1 className="hero-ss-main-title">
            <span className="title-part-orange">Understanding</span>{' '}
            <span className="title-part-white">as</span>{' '}
            <span className="title-part-yellow">Fractions</span>
          </h1>

          <div className="hero-ss-subbrand">
            FractionVerse · Equal Parts Adventure
          </div>

          {/* Mascot Speech Bubble Row */}
          <div className="hero-ss-mascot-row">
            <div className="fox-avatar-circle-ss">
              <span className="fox-emoji-ss">🦊</span>
            </div>
            <div className="speech-bubble-box-ss">
              <p className="speech-text-ss">
                Hi! I'm Figgy. Ready to slice into fractions? 🍕
              </p>
            </div>
          </div>

          {/* Description Paragraph */}
          <p className="hero-ss-desc">
            Learn to split numbers into <strong className="highlight-yellow">equal parts</strong>, connect fractions to
            division, and master facts for equivalent fractions, addition, subtraction, and word problems!
          </p>

          {/* YOUR LEARNING JOURNEY Card Container matching SS */}
          <div className="hero-ss-journey-card">
            <h3 className="journey-card-heading">YOUR LEARNING JOURNEY</h3>

            <div className="journey-flow-layout">
              {/* Row 1: Wonder -> Story -> Simulate */}
              <div className="journey-flow-row">
                <div className="journey-flow-item">
                  <div className="item-icon-bg">🔍</div>
                  <div className="item-labels">
                    <span className="item-title">Wonder</span>
                    <span className="item-desc">A fraction mystery!</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>

                <div className="journey-flow-item">
                  <div className="item-icon-bg">📖</div>
                  <div className="item-labels">
                    <span className="item-title">Story</span>
                    <span className="item-desc">See fractions in action</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>

                <div className="journey-flow-item">
                  <div className="item-icon-bg">🧪</div>
                  <div className="item-labels">
                    <span className="item-title">Simulate</span>
                    <span className="item-desc">4 Interactive labs</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>
              </div>

              {/* Row 2: Play -> Reflect */}
              <div className="journey-flow-row center-row">
                <div className="journey-flow-item">
                  <div className="item-icon-bg">🎮</div>
                  <div className="item-labels">
                    <span className="item-title">Play</span>
                    <span className="item-desc">100 challenges</span>
                  </div>
                </div>

                <span className="flow-arrow">→</span>

                <div className="journey-flow-item">
                  <div className="item-icon-bg">📋</div>
                  <div className="item-labels">
                    <span className="item-title">Reflect</span>
                    <span className="item-desc">What did you learn?</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={handleBeginJourney}
            className="btn-ss-begin-journey"
          >
            🚀 Begin Your Journey!
          </button>

          {/* 3 Bottom Feature Tiles matching SS */}
          <div className="hero-ss-bottom-tiles">
            <div className="ss-feature-tile">
              <span className="tile-icon">🎯</span>
              <span className="tile-title">100 Questions</span>
            </div>

            <div className="ss-feature-tile">
              <span className="tile-icon">🍕</span>
              <span className="tile-title">Equal Parts</span>
            </div>

            <div className="ss-feature-tile">
              <span className="tile-icon">✨</span>
              <span className="tile-title">Badges & XP</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // WONDER PUZZLE CARD VIEW
  return (
    <div className="wonder-phase-container">
      <div className="wonder-card-box">
        <div className="mascot-speech-row">
          <div className="fox-avatar-circle">🦊</div>
          <div className="speech-bubble-box">
            <p className="speech-text">{wonderData.puzzleCard.mascotComment}</p>
          </div>
        </div>

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
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}
