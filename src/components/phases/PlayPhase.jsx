import React, { useState, useEffect } from 'react';
import { worldsData } from '../../data/worlds';
import { getRoundQuestions } from '../../data/questionBank';
import { speakText } from '../../utils/audio';
import { Flame, Star, Lock, Sparkles, RefreshCw, ArrowRight, Heart, Lightbulb, ArrowLeft } from 'lucide-react';

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

// VISUAL DIAGRAM / CHART COMPONENT FOR QUESTIONS
function QuestionVisualDiagram({ question }) {
  const text = question?.stemText || "";
  
  // Check for fraction pattern like "2/5" or "8/12"
  const fracMatch = text.match(/(\d+)\/(\d+)/);
  if (fracMatch) {
    const num = Math.min(parseInt(fracMatch[1], 10) || 1, 20);
    const den = Math.min(parseInt(fracMatch[2], 10) || 2, 20);
    if (den > 0) {
      return (
        <div className="q-visual-chart-container">
          <div className="chart-title-tag">Visual Fraction Bar ({num}/{den})</div>
          <div className="fraction-bar-visual-flex">
            {Array.from({ length: den }).map((_, i) => (
              <div
                key={i}
                className={`fraction-bar-slice ${
                  i < num ? 'slice-shaded-gold' : 'slice-empty'
                }`}
              >
                1/{den}
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  // Check for multiplication / division pattern like "3 x 8 = 24" or "24 / 3"
  const divMatch = text.match(/(\d+)\s*[×x*÷]\s*(\d+)/);
  if (divMatch) {
    const groupCount = Math.min(parseInt(divMatch[1], 10) || 3, 6);
    const itemsPerGroup = Math.min(parseInt(divMatch[2], 10) || 8, 8);
    return (
      <div className="q-visual-chart-container">
        <div className="chart-title-tag">Visual Grouping Diagram</div>
        <div className="grouping-visual-grid">
          {Array.from({ length: groupCount }).map((_, g) => (
            <div key={g} className="group-box-visual">
              <div className="group-label">Group {g + 1}</div>
              <div className="group-items-row">
                {Array.from({ length: itemsPerGroup }).map((_, item) => (
                  <span key={item} className="item-icon">⭐</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default fallback fraction visual bar
  return (
    <div className="q-visual-chart-container">
      <div className="chart-title-tag">Visual Model</div>
      <div className="fraction-bar-visual-flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`fraction-bar-slice ${i < 3 ? 'slice-shaded-pink' : 'slice-empty'}`}
          >
            1/4
          </div>
        ))}
      </div>
    </div>
  );
}

// IN-ROUND PRACTICE QUIZ VIEW
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
  const [showHint, setShowHint] = useState(false);
  const [outOfHeartsModal, setOutOfHeartsModal] = useState(false);

  useEffect(() => {
    const qList = getRoundQuestions(world.id, 10);
    setQuestions(qList);
    setQIdx(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setShowHint(false);
    setOutOfHeartsModal(false);
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
    if (currentQ && !outOfHeartsModal) {
      speakText(currentQ.narrationText || currentQ.stemText);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    }
  }, [qIdx, questions, outOfHeartsModal]);

  // REQUIREMENT: Auto-close 1-second feedback popup
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
    if (isAnswered || outOfHeartsModal) return;
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

      if (newLives <= 0) {
        // Out of hearts! Trigger attractive popup
        setFeedbackPopup({
          type: 'wrong',
          message: `The correct answer is ${currentQ.correctAnswer}`
        });
        speakText("Out of hearts! Don't worry, practice makes perfect!");
      } else {
        setFeedbackPopup({
          type: 'wrong',
          message: `The correct answer is ${currentQ.correctAnswer}`
        });
        speakText(`Not quite! The correct answer is ${currentQ.correctAnswer}`);
      }
    }
  };

  const handleAdvanceAfterPopup = () => {
    if (lives <= 0) {
      // Out of hearts popup
      onUpdateProgress({
        worldId: world.id,
        score,
        total: questions.length,
        passed: score >= 4,
        unlockedNext: score >= 4
      });
      setOutOfHeartsModal(true);
    } else if (qIdx >= questions.length - 1) {
      // Completed all 10 questions! Automatically update progress and switch to world list!
      const passed = score >= 4;
      onUpdateProgress({
        worldId: world.id,
        score,
        total: questions.length,
        passed,
        unlockedNext: passed
      });
      speakText("World Complete! Switching to World List...");
      setTimeout(() => {
        onBackToWorlds();
      }, 1200);
    } else {
      setQIdx(prev => prev + 1);
    }
  };

  const handleRetryWorld = () => {
    const qList = getRoundQuestions(world.id, 10);
    setQuestions(qList);
    setQIdx(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setShowHint(false);
    setOutOfHeartsModal(false);
  };

  const getHintText = () => {
    if (currentQ.explanation) return currentQ.explanation;
    const text = currentQ.stemText || "";
    if (text.includes("simplest form")) return "💡 Hint: Divide both top and bottom numbers by their largest common divisor!";
    if (text.includes("equivalent")) return "💡 Hint: Multiply or divide both numerator and denominator by the same factor!";
    if (text.includes("24 ÷ 3") || text.includes("3 × 8")) return "💡 Hint: Division is splitting into equal groups! 24 ÷ 3 gives 8.";
    return "💡 Hint: Look at the visual fraction diagram above to count the shaded slices!";
  };

  const progressPct = Math.round(((qIdx + 1) / questions.length) * 100);

  return (
    <div className="play-phase-wrapper-ss">
      <div className="play-world-stage-ss">
        {/* Top Pink World Badge */}
        <div className="top-world-pink-pill-ss">
          <span className="world-emoji">{world.icon}</span>
          <span>{world.name}</span>
        </div>

        {/* REQUIREMENT 1: Stats Pill Row showing 3 Hearts, ⭐ Score & 🔥 Streak */}
        <div className="play-stats-bar-ss">
          <div className="stats-pill-row-ss">
            {/* 3 Hearts Indicator */}
            <div className="stat-pill-ss hearts-pill flex gap-1 items-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${
                    i < lives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="stat-pill-ss star-pill">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300 inline mr-1" />
              <span>{score}</span>
            </div>

            <div className="stat-pill-ss streak-pill">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 inline mr-1" />
              <span>{streak}x</span>
            </div>
          </div>

          {/* Progress Row (Question 1/10 & Progress %) */}
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

        {/* Main Glassmorphism Question Card */}
        <div className="play-main-card-ss">
          {/* Orange Concept Badge */}
          <div className="top-orange-badge-ss">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            {currentQ.conceptTitle || "DIVISION GROUPING"}
          </div>

          {/* Stem Text */}
          <h2 className="play-stem-title-ss">{currentQ.stemText}</h2>

          {/* REQUIREMENT 4: Visual Diagram / Chart for Question */}
          <QuestionVisualDiagram question={currentQ} />

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

          {/* REQUIREMENT 5: Hint Button instead of Exit World Button */}
          <div className="mt-3 flex flex-col items-center gap-2">
            <button
              onClick={() => {
                const nextState = !showHint;
                setShowHint(nextState);
                if (nextState) speakText(getHintText());
              }}
              className="btn-hint-gold-pill"
            >
              <Lightbulb className="w-4 h-4 inline mr-1.5 text-amber-300 fill-amber-300" />
              {showHint ? "Hide Hint 💡" : "Need a Hint? 💡"}
            </button>

            {showHint && (
              <div className="hint-display-box animate-fadeIn">
                {getHintText()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1-SECOND FEEDBACK POPUP */}
      {feedbackPopup && !outOfHeartsModal && (
        <div className="feedback-modal-backdrop-ss" onClick={() => setFeedbackPopup(null)}>
          <div
            className={`feedback-modal-card-ss ${
              feedbackPopup.type === 'correct' ? 'card-success-green' : 'card-error-red'
            }`}
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

      {/* REQUIREMENT 3: ATTRACTIVE OUT OF HEARTS POPUP FOR GRADE 5 STUDENTS */}
      {outOfHeartsModal && (
        <div className="feedback-modal-backdrop-ss">
          <div className="feedback-modal-card-ss card-error-red animate-bounceIn">
            <div className="modal-emoji-top animate-pulse">
              💔
            </div>

            <h3 className="modal-title-ss text-2xl font-black text-white">
              Out of Hearts! 🥺
            </h3>

            <p className="modal-message-ss text-amber-200 font-bold">
              Don't worry, Super Math Explorer! Practice makes perfect! You earned {score} points. Let's try again! 🚀
            </p>

            <div className="flex gap-3 mt-4 w-full justify-center">
              <button onClick={onBackToWorlds} className="btn-sim-prev">
                <ArrowLeft className="w-4 h-4 mr-1" /> World Grid
              </button>
              <button onClick={handleRetryWorld} className="btn-sim-complete-gold">
                Try Again 🔄
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
