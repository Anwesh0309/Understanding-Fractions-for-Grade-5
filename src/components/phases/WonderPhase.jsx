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
            <span className="badge-sparkle-yellow">✨ </span>{' '}
            <span className="badge-grade-light-yellow">Grade 5</span>{' '}
            <span className="badge-dot-white">·</span>{' '}
            <span className="badge-adventure-white">Fractions Adventure</span>
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

  // WONDER PUZZLE CARD VIEW (EXACT MATCH TO MODULE SCREENSHOT)
  return (
    <div className="wonder-phase-container-ss">
      <div className="wonder-puzzle-stage-ss">
        {/* Giant Question Mark Circle Badge */}
        <div className="giant-question-circle-purple">
          ?
        </div>

        {/* Mascot Speech Bubble Row */}
        <div className="hero-ss-mascot-row mt-3 mb-4">
          <div className="fox-avatar-circle-ss">
            <span className="fox-emoji-ss">🦊</span>
          </div>
          <div className="speech-bubble-box-ss">
            <p className="speech-text-ss">{wonderData.puzzleCard.mascotComment || "Hmm... I wonder... 🤔"}</p>
          </div>
        </div>

        {/* Central Glassmorphism Card */}
        <div className="wonder-puzzle-main-card">
          <div className="puzzle-top-icon font-bold">🍕</div>
          
          <h2 className="wonder-puzzle-question-text">
            {wonderData.puzzleCard.questionText}
          </h2>

          <p className="wonder-puzzle-subtext-italic">
            {wonderData.puzzleCard.hintItalic}
          </p>

          {showTeaser ? (
            <div className="wonder-teaser-revelation-ss animate-fade-in mt-3">
              <Lightbulb className="w-4 h-4 text-amber-300 inline mr-1.5" />
              {wonderData.puzzleCard.teaserPill}
            </div>
          ) : (
            <button
              onClick={() => setShowTeaser(true)}
              className="wonder-hint-trigger-pill mt-3"
            >
              💡 Tap for a Hint!
            </button>
          )}
        </div>

        {/* Primary Discover Button below card */}
        <button
          onClick={onComplete}
          className="btn-discover-purple-ss"
        >
          ✨ Let's Investigate! ✨
        </button>
      </div>
    </div>
  );
}
