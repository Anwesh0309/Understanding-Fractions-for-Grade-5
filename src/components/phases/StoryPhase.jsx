import React, { useState, useEffect } from 'react';
import { storyCards } from '../../data/storyContent';
import { MascotBubble } from '../shell/MascotBubble';
import { speakText } from '../../utils/audio';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export function StoryPhase({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const card = storyCards[currentIdx];

  useEffect(() => {
    if (card && card.narration) {
      speakText(card.narration);
    }
  }, [currentIdx]);

  const handleNext = () => {
    if (currentIdx < storyCards.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      speakText(storyCards[nextIdx].narration);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      const nextIdx = currentIdx - 1;
      setCurrentIdx(nextIdx);
      speakText(storyCards[nextIdx].narration);
    }
  };

  const progressPct = ((currentIdx + 1) / storyCards.length) * 100;

  return (
    <div className="story-phase-wrapper-ss">
      <div className="story-stage-container">
        {/* Top Progress Track & Slide Counter matching SS */}
        <div className="story-top-progress-row">
          <div className="story-progress-line-track">
            <div
              className="story-progress-line-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="story-slide-counter">
            {currentIdx + 1} / {storyCards.length}
          </span>
        </div>

        {/* Main Split Glassmorphism Story Card matching SS */}
        <div className="story-main-glass-card">
          {/* Left Side: HD Illustration Image */}
          <div className="story-image-side-box">
            <RenderStoryIllustration cardIdx={currentIdx} />
          </div>

          {/* Right Side: Narrative Content */}
          <div className="story-content-side-box">
            <h2 className="story-card-title-gold">{card.title}</h2>

            <p className="story-narrative-paragraph">{card.text}</p>

            {/* Question Pill */}
            <div className="story-question-pill-box">
              <Sparkles className="w-4 h-4 text-amber-300 inline mr-2 flex-shrink-0" />
              <span className="question-text-gold">{card.questionPill}</span>
            </div>

            {/* Mascot commentary */}
            <div className="my-1">
              <MascotBubble text={card.mascotComment} />
            </div>
          </div>
        </div>

        {/* Navigation Footer matching SS */}
        <div className="story-footer-nav-row">
          <button
            onClick={handleBack}
            disabled={currentIdx === 0}
            className={`btn-story-back-ss ${currentIdx === 0 ? 'disabled' : ''}`}
          >
            ‹ Back
          </button>

          {/* Pagination Dots */}
          <div className="story-dots-group">
            {storyCards.map((_, i) => (
              <span
                key={i}
                className={`story-dot-item ${i === currentIdx ? 'active' : ''}`}
                onClick={() => setCurrentIdx(i)}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="btn-story-next-yellow"
          >
            {currentIdx === storyCards.length - 1 ? 'Continue to Simulate 🧪' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Render HD Image for each story card
function RenderStoryIllustration({ cardIdx }) {
  const images = [
    '/assets/images/story_1.png',
    '/assets/images/story_2.png',
    '/assets/images/story_3.png',
    '/assets/images/story_4.png'
  ];

  return (
    <div className="story-hd-image-wrapper">
      <img
        src={images[cardIdx]}
        alt={`Story Illustration ${cardIdx + 1}`}
        className="story-hd-img"
      />
    </div>
  );
}
