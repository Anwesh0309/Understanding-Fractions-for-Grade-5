import React, { useState, useEffect } from 'react';
import { storyCards } from '../../data/storyContent';
import { MascotBubble } from '../shell/MascotBubble';
import { speakText } from '../../utils/audio';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

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
      setCurrentIdx(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  return (
    <div className="story-phase-wrapper">
      <div className="story-main-card">
        {/* Left Side: Visual Illustration */}
        <div className="story-illustration-side">
          <RenderStoryIllustration type={card.imageType} cardIdx={currentIdx} />
        </div>

        {/* Right Side: Text & Narrator */}
        <div className="story-content-side">
          <div className="story-header-row">
            <div className="story-badge-pink">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Oliver's Bakery Story
            </div>
            <div className="story-counter-pill">
              Card {currentIdx + 1} of {storyCards.length}
            </div>
          </div>

          <h2 className="story-card-title">{card.title}</h2>

          <p className="story-narrative-text">{card.text}</p>

          <div className="story-question-pill">
            <span className="sparkle-icon">✨</span>
            <span className="question-pill-text">{card.questionPill}</span>
          </div>

          <div className="my-2">
            <MascotBubble text={card.mascotComment} />
          </div>

          {/* Navigation Controls */}
          <div className="story-nav-footer">
            <button
              onClick={handleBack}
              disabled={currentIdx === 0}
              className={`btn-story-back ${currentIdx === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>

            {/* Dot indicators */}
            <div className="story-dots-row">
              {storyCards.map((_, i) => (
                <span
                  key={i}
                  className={`story-dot ${i === currentIdx ? 'active' : ''}`}
                  onClick={() => setCurrentIdx(i)}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="btn-story-next"
            >
              {currentIdx === storyCards.length - 1 ? 'Continue to Simulate 🧪' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Visual Story Graphic Renderer
function RenderStoryIllustration({ type, cardIdx }) {
  if (type === 'bakery-sharing') {
    return (
      <div className="visual-graphic-box">
        <h4 className="graphic-label">3 Whole Pies for 4 Friends</h4>
        <div className="graphic-pies-row">
          <div className="pie-item">
            <svg viewBox="0 0 100 100" className="pie-svg">
              <circle cx="50" cy="50" r="45" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
              <circle cx="50" cy="50" r="38" fill="#d97706" />
              <text x="50" y="55" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="16">Pie 1</text>
            </svg>
          </div>
          <div className="pie-item">
            <svg viewBox="0 0 100 100" className="pie-svg">
              <circle cx="50" cy="50" r="45" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
              <circle cx="50" cy="50" r="38" fill="#d97706" />
              <text x="50" y="55" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="16">Pie 2</text>
            </svg>
          </div>
          <div className="pie-item">
            <svg viewBox="0 0 100 100" className="pie-svg">
              <circle cx="50" cy="50" r="45" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
              <circle cx="50" cy="50" r="38" fill="#d97706" />
              <text x="50" y="55" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="16">Pie 3</text>
            </svg>
          </div>
        </div>
        <div className="graphic-friends-row">
          <span className="friend-avatar">🧑 Oliver</span>
          <span className="friend-avatar">👧 Emma</span>
          <span className="friend-avatar">👦 Lucas</span>
          <span className="friend-avatar">👩 Charlotte</span>
        </div>
      </div>
    );
  }

  if (type === 'pie-fourths') {
    return (
      <div className="visual-graphic-box">
        <h4 className="graphic-label">Slicing 3 Pies into 4 Equal Slices Each</h4>
        <div className="graphic-pies-row">
          {[1, 2, 3].map(pieNum => (
            <div key={pieNum} className="pie-item">
              <svg viewBox="0 0 100 100" className="pie-svg">
                <circle cx="50" cy="50" r="45" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="#ffffff" strokeWidth="3" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="#ffffff" strokeWidth="3" />
                <text x="30" y="35" fill="#ffffff" fontWeight="bold" fontSize="12">1/4</text>
                <text x="70" y="35" fill="#ffffff" fontWeight="bold" fontSize="12">1/4</text>
                <text x="30" y="75" fill="#ffffff" fontWeight="bold" fontSize="12">1/4</text>
                <text x="70" y="75" fill="#ffffff" fontWeight="bold" fontSize="12">1/4</text>
              </svg>
            </div>
          ))}
        </div>
        <div className="graphic-summary-pill">
          Total Slices = 12 slices. Each friend gets 3 slices = 3/4 pie!
        </div>
      </div>
    );
  }

  if (type === 'equivalent-bars') {
    return (
      <div className="visual-graphic-box">
        <h4 className="graphic-label">Visualizing Equivalent Fractions</h4>
        <div className="ribbon-compare-stage">
          <div className="ribbon-row-item">
            <span className="ribbon-name">Emma's Ribbon (2/4):</span>
            <div className="bar-container-4">
              <div className="bar-cell shaded">1/4</div>
              <div className="bar-cell shaded">1/4</div>
              <div className="bar-cell">1/4</div>
              <div className="bar-cell">1/4</div>
            </div>
          </div>
          <div className="ribbon-row-item">
            <span className="ribbon-name">Lucas's Ribbon (4/8):</span>
            <div className="bar-container-8">
              <div className="bar-cell shaded">1/8</div>
              <div className="bar-cell shaded">1/8</div>
              <div className="bar-cell shaded">1/8</div>
              <div className="bar-cell shaded">1/8</div>
              <div className="bar-cell">1/8</div>
              <div className="bar-cell">1/8</div>
              <div className="bar-cell">1/8</div>
              <div className="bar-cell">1/8</div>
            </div>
          </div>
        </div>
        <div className="graphic-match-badge">
          ✅ 2/4 = 4/8 = 1/2 (Same shaded length!)
        </div>
      </div>
    );
  }

  return (
    <div className="visual-graphic-box">
      <h4 className="graphic-label">Renaming to Common Denominator (LCD = 12)</h4>
      <div className="lcd-math-display">
        <div className="lcd-item">
          <span className="fraction-large">1/3</span>
          <span className="arrow-convert">×4 ➔</span>
          <span className="fraction-large highlight">4/12</span>
        </div>
        <div className="plus-sign">+</div>
        <div className="lcd-item">
          <span className="fraction-large">1/4</span>
          <span className="arrow-convert">×3 ➔</span>
          <span className="fraction-large highlight">3/12</span>
        </div>
      </div>
      <div className="lcd-result-box">
        4/12 + 3/12 = <span className="text-amber-300 font-extrabold text-2xl ml-2">7/12</span>
      </div>
    </div>
  );
}
