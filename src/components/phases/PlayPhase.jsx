import React, { useState, useEffect } from 'react';
import { worldsData } from '../../data/worlds';
import { getRoundQuestions } from '../../data/questionBank';
import { speakText } from '../../utils/audio';
import { Flame, Heart, Star, Lock, ArrowLeft, Sparkles } from 'lucide-react';

export function PlayPhase({ progress, onUpdateProgress, onComplete }) {
  const [selectedWorldId, setSelectedWorldId] = useState(null);
  const [inRound, setInRound] = useState(false);

  // If world selected and round launched:
  if (inRound && selectedWorldId) {
    return (
      <PlayRoundView
        worldId={selectedWorldId}
        onFinishRound={(results) => {
          onUpdateProgress(results);
          setInRound(false);
          if (results.passed) {
            // Check if all worlds are complete
            onComplete();
          }
        }}
        onBackToWorlds={() => setInRound(false)}
      />
    );
  }

  // WORLD SELECT GRID VIEW (EXACT MATCH TO SCREENSHOT)
  return (
    <div className="play-world-grid-wrapper-ss">
      <div className="world-grid-header flex flex-col items-center">
        <h2 className="world-grid-title-ss">
          🎮 Practice — Choose Your World!
        </h2>
        <p className="world-grid-subtitle-ss">
          Answer questions in each world. Earn stars and XP!
        </p>
      </div>

      <div className="worlds-grid-2x5-ss">
        {worldsData.map((world, idx) => {
          const worldState = progress?.worlds?.[world.id] || {};

          // World 1 (idx 0) is unlocked. World N is unlocked ONLY if World N-1 has completed === true!
          const prevWorldId = idx > 0 ? worldsData[idx - 1].id : null;
          const prevWorldState = prevWorldId ? progress?.worlds?.[prevWorldId] : null;
          const isUnlocked = idx === 0 || (prevWorldState && prevWorldState.completed === true);

          const questionRangeStart = idx * 10 + 1;
          const questionRangeEnd = (idx + 1) * 10;

          return (
            <div
              key={world.id}
              onClick={() => {
                if (isUnlocked) {
                  setSelectedWorldId(world.id);
                  setInRound(true);
                }
              }}
              className={`world-card-tile-ss ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              {/* Lock icon top-right if locked */}
              {!isUnlocked && (
                <div className="card-top-lock-icon">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                </div>
              )}

              {/* Emoji Icon */}
              <div className="world-tile-emoji">{world.icon}</div>

              {/* World Name */}
              <h3 className="world-tile-name">{world.name}</h3>

              {/* Question Range */}
              <p className="world-tile-qrange">
                Questions {questionRangeStart}–{questionRangeEnd}
              </p>

              {/* Unlocked Pink Button */}
              {isUnlocked && (
                <button className="btn-practice-pink-pill">
                  ▶ PRACTICE
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// IN-ROUND PRACTICE QUIZ VIEW (10 Qs, 3 Hearts, 4+ Passing rule, 1-sec simulation popups)
function PlayRoundView({ worldId, onFinishRound, onBackToWorlds }) {
  const world = worldsData.find(w => w.id === worldId);
  const [questions, setQuestions] = useState(() => getRoundQuestions(worldId, 10));
  const [qIdx, setQIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackPopup, setFeedbackPopup] = useState(null); // simulation popup format

  useEffect(() => {
    // Refresh questions when worldId changes
    setQuestions(getRoundQuestions(worldId, 10));
  }, [worldId]);

  const currentQ = questions[qIdx];

  useEffect(() => {
    if (currentQ) {
      speakText(currentQ.narrationText || currentQ.stemText);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [qIdx, questions]);

  // REQUIREMENT: Auto-close popup after 1 second (1000ms) and advance to next question
  useEffect(() => {
    if (feedbackPopup) {
      const timer = setTimeout(() => {
        setFeedbackPopup(null);
        handleAdvanceAfterPopup();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [feedbackPopup]);

  if (!currentQ) {
    return (
      <div className="p-8 text-white text-center font-bold">
        Loading 10 Questions for {world?.name || 'World'}...
      </div>
    );
  }

  const handleSelectAnswer = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      setFeedbackPopup({
        type: 'correct',
        message: `Correct! ${currentQ.explanation || 'Great job!'}`
      });
      speakText("Correct!");
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);

      setFeedbackPopup({
        type: 'wrong',
        message: `The correct answer is ${currentQ.correctAnswer}`
      });
      speakText(`Not quite! The correct answer is ${currentQ.correctAnswer}`);
    }
  };

  const handleAdvanceAfterPopup = () => {
    // Check if round finishes due to 0 lives or last question
    if (lives <= 0 || qIdx >= questions.length - 1) {
      finishRound(score, lives);
    } else {
      setQIdx(prev => prev + 1);
    }
  };

  const finishRound = (finalScore) => {
    // PASSING RULE: At least 4 correct answers out of 10 to pass & unlock next world!
    const passed = finalScore >= 4;
    onFinishRound({
      worldId,
      score: finalScore,
      total: questions.length,
      passed,
      unlockedNext: passed
    });
  };

  const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;

  return (
    <div className="play-phase-wrapper">
      <div className="play-world-stage">
        {/* Top Center Pink World Badge */}
        <div className="top-world-pink-badge">
          <span className="world-badge-icon">{world.icon}</span>
          <span>{world.name}</span>
        </div>

        {/* Top Stats Pill Row & Progress Bar */}
        <div className="play-stats-progress-node">
          <div className="stats-pills-row">
            <div className="stat-pill-item text-amber-300">
              <Star className="w-4 h-4 fill-amber-300 inline mr-1" />
              <span>{score} / 10</span>
            </div>

            {/* 3 Hearts Indicator */}
            <div className="stat-pill-item text-rose-400">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 inline mr-0.5 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`}
                />
              ))}
            </div>

            <div className="stat-pill-item text-orange-400">
              <Flame className="w-4 h-4 fill-orange-400 inline mr-1" />
              <span>{multiplier}x Streak ({streak})</span>
            </div>
          </div>

          <div className="progress-info-row">
            <span>Question {qIdx + 1} of {questions.length}</span>
            <span>{Math.round(((qIdx + 1) / questions.length) * 100)}%</span>
          </div>

          <div className="progress-track-bg">
            <div
              className="progress-track-fill"
              style={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Glassmorphism Question Card */}
        <div className="play-main-glass-card">
          <div className="top-orange-concept-badge">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            {currentQ.conceptTitle || "FRACTION PRACTICE"}
          </div>

          <h2 className="play-q-stem-title">{currentQ.stemText}</h2>

          {/* 2x2 Answer Grid */}
          <div className="play-tiles-grid-2x2">
            {currentQ.options.map((opt, i) => {
              let tileClass = "play-answer-tile";
              if (isAnswered) {
                if (opt === currentQ.correctAnswer) tileClass += " correct";
                else if (opt === selectedOption) tileClass += " wrong";
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelectAnswer(opt)}
                  className={tileClass}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-2">
            <button onClick={onBackToWorlds} className="play-hint-trigger-btn">
              <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Exit World
            </button>
          </div>
        </div>
      </div>

      {/* REQUIREMENT: SIMULATION PHASE POPUPS FOR PRACTICE PHASE (1-SEC DURATION) */}
      {feedbackPopup && (
        <div className="feedback-modal-backdrop-ss" onClick={() => setFeedbackPopup(null)}>
          <div
            className={`feedback-modal-card-ss ${feedbackPopup.type === 'correct' ? 'card-success-green' : 'card-error-red'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-emoji-top">
              {feedbackPopup.type === 'correct' ? '🎉' : '🥺'}
            </div>

            <h3 className="modal-title-ss">
              {feedbackPopup.type === 'correct' ? 'Correct! 🎉' : 'Not quite!'}
            </h3>

            <p className="modal-message-ss">{feedbackPopup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
