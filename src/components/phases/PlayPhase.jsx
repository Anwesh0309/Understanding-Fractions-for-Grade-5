import React, { useState, useEffect } from 'react';
import { worldsData } from '../../data/worlds';
import { getRoundQuestions } from '../../data/questionBank';
import { speakText } from '../../utils/audio';
import { Flame, Star, Lock, ArrowLeft, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

export function PlayPhase({ progress, onUpdateProgress, onComplete }) {
  const [selectedWorldId, setSelectedWorldId] = useState("pizza-piazza");
  const [inRound, setInRound] = useState(false);

  const handleLaunchWorld = (e, worldId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedWorldId(worldId);
    setInRound(true);
  };

  // If world selected and round launched:
  if (inRound && selectedWorldId) {
    return (
      <PlayRoundView
        worldId={selectedWorldId}
        progress={progress}
        onUpdateProgress={onUpdateProgress}
        onLaunchNextWorld={(nextId) => {
          setSelectedWorldId(nextId);
          setInRound(true);
        }}
        onFinishRound={(results) => {
          onUpdateProgress(results);
          setInRound(false);
          // Only trigger onComplete when final World 10 is finished
          if (results.passed && results.worldId === "puzzle-peak") {
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
          const isUnlocked = idx === 0 || (prevWorldState && prevWorldState.completed === true) || worldState.unlocked === true;

          const questionRangeStart = idx * 10 + 1;
          const questionRangeEnd = (idx + 1) * 10;

          return (
            <div
              key={world.id}
              onClick={(e) => isUnlocked && handleLaunchWorld(e, world.id)}
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
                <button
                  onClick={(e) => handleLaunchWorld(e, world.id)}
                  className="btn-practice-pink-pill"
                >
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

// IN-ROUND PRACTICE QUIZ VIEW (EXACT MATCH TO QUESTION SCREENSHOT)
function PlayRoundView({ worldId, progress, onUpdateProgress, onLaunchNextWorld, onFinishRound, onBackToWorlds }) {
  const world = worldsData.find(w => w.id === worldId) || worldsData[0];
  const [questions, setQuestions] = useState(() => getRoundQuestions(world.id, 10));
  const [qIdx, setQIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackPopup, setFeedbackPopup] = useState(null);
  const [summaryModal, setSummaryModal] = useState(null); // { passed: boolean, score: number, total: number }

  useEffect(() => {
    const qList = getRoundQuestions(world.id, 10);
    setQuestions(qList);
    setQIdx(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setSummaryModal(null);
  }, [worldId]);

  const currentQ = questions[qIdx] || questions[0] || {
    id: 'fallback-0',
    conceptTitle: 'DIVISION GROUPING',
    stemText: 'If 3 × 8 = 24, then 24 ÷ 3 = _____',
    correctAnswer: '8',
    options: ['8', '7', '6', '10'],
    narrationText: 'If 3 × 8 = 24, then 24 ÷ 3 = _____'
  };

  useEffect(() => {
    if (currentQ && !summaryModal) {
      speakText(currentQ.narrationText || currentQ.stemText);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [qIdx, questions, summaryModal]);

  // REQUIREMENT: Auto-close feedback popup after 1 second (1000ms) and advance to next question
  useEffect(() => {
    if (feedbackPopup) {
      const timer = setTimeout(() => {
        setFeedbackPopup(null);
        handleAdvanceAfterPopup();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [feedbackPopup]);

  const handleSelectAnswer = (option) => {
    if (isAnswered || summaryModal) return;
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
    if (lives <= 0 || qIdx >= questions.length - 1) {
      triggerSummary(score);
    } else {
      setQIdx(prev => prev + 1);
    }
  };

  const triggerSummary = (finalScore) => {
    const passed = finalScore >= 4; // Passing rule: at least 4 correct answers out of 10!
    onUpdateProgress({
      worldId: world.id,
      score: finalScore,
      total: questions.length,
      passed,
      unlockedNext: passed
    });
    setSummaryModal({
      passed,
      score: finalScore,
      total: questions.length
    });
  };

  const handleRetryCurrentWorld = () => {
    const qList = getRoundQuestions(world.id, 10);
    setQuestions(qList);
    setQIdx(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setSummaryModal(null);
  };

  const handleGoToNextWorld = () => {
    const currentIdx = worldsData.findIndex(w => w.id === world.id);
    const nextWorld = worldsData[currentIdx + 1];
    if (nextWorld) {
      onLaunchNextWorld(nextWorld.id);
    } else {
      onFinishRound({
        worldId: world.id,
        score,
        total: questions.length,
        passed: true
      });
    }
  };

  const progressPct = Math.round(((qIdx + 1) / questions.length) * 100);

  return (
    <div className="play-phase-wrapper-ss">
      <div className="play-world-stage-ss">
        {/* Top Pink World Badge matching SS */}
        <div className="top-world-pink-pill-ss">
          <span className="world-emoji">{world.icon}</span>
          <span>{world.name}</span>
        </div>

        {/* Stats Pill Row matching SS (⭐ Score & 🔥 Streak) */}
        <div className="play-stats-bar-ss">
          <div className="stats-pill-row-ss">
            <div className="stat-pill-ss star-pill">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300 inline mr-1" />
              <span>{score}</span>
            </div>

            <div className="stat-pill-ss streak-pill">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 inline mr-1" />
              <span>{streak}x</span>
            </div>
          </div>

          {/* Progress Row (Question 1/10 & 0%) */}
          <div className="progress-info-row-ss">
            <span>Question {qIdx + 1}/{questions.length}</span>
            <span>{progressPct}%</span>
          </div>

          <div className="progress-track-bg-ss">
            <div
              className="progress-track-fill-ss"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Main Glassmorphism Question Card matching SS */}
        <div className="play-main-card-ss">
          {/* Orange Concept Badge */}
          <div className="top-orange-badge-ss">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            {currentQ.conceptTitle || "DIVISION GROUPING"}
          </div>

          {/* Stem Text */}
          <h2 className="play-stem-title-ss">{currentQ.stemText}</h2>

          {/* 2x2 Answer Grid */}
          <div className="play-tiles-2x2-ss">
            {currentQ.options.map((opt, i) => {
              let tileClass = "play-tile-btn-ss";
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

          <div className="mt-3">
            <button onClick={onBackToWorlds} className="play-exit-btn-ss">
              <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Exit World
            </button>
          </div>
        </div>
      </div>

      {/* 1-SECOND FEEDBACK POPUP */}
      {feedbackPopup && !summaryModal && (
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

      {/* ROUND END SUMMARY / RETRY MODAL (NO BLANK SCREEN EVER!) */}
      {summaryModal && (
        <div className="feedback-modal-backdrop-ss">
          <div className={`feedback-modal-card-ss ${summaryModal.passed ? 'card-success-green' : 'card-error-red'}`}>
            <div className="modal-emoji-top">
              {summaryModal.passed ? '🏆' : '💔'}
            </div>

            <h3 className="modal-title-ss">
              {summaryModal.passed ? 'World Completed! 🎉' : 'Keep Trying!'}
            </h3>

            <p className="modal-message-ss">
              {summaryModal.passed
                ? `Awesome! You scored ${summaryModal.score} out of 10 and unlocked the next world!`
                : `You scored ${summaryModal.score} out of 10. You need at least 4 correct answers to unlock the next world.`}
            </p>

            <div className="flex gap-3 mt-4 w-full justify-center">
              {summaryModal.passed ? (
                <>
                  <button onClick={onBackToWorlds} className="btn-sim-prev">
                    <ArrowLeft className="w-4 h-4 mr-1" /> World Grid
                  </button>
                  <button onClick={handleGoToNextWorld} className="btn-sim-complete-gold">
                    Next World <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onBackToWorlds} className="btn-sim-prev">
                    <ArrowLeft className="w-4 h-4 mr-1" /> World Grid
                  </button>
                  <button onClick={handleRetryCurrentWorld} className="btn-sim-complete-gold">
                    Retry World <RefreshCw className="w-4 h-4 ml-1" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
