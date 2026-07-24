import React, { useState, useEffect } from 'react';
import { worldsData } from '../../data/worlds';
import { getRoundQuestions } from '../../data/questionBank';
import { MascotBubble } from '../shell/MascotBubble';
import { speakText } from '../../utils/audio';
import { Flame, Heart, Star, Lock, ArrowLeft, Trophy, Sparkles } from 'lucide-react';

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
          // If all 10 worlds have been played or user completed a round, allow Reflect transition
          onComplete();
        }}
        onBackToWorlds={() => setInRound(false)}
      />
    );
  }

  // WORLD SELECT GRID VIEW
  return (
    <div className="play-world-grid-wrapper">
      <div className="world-grid-header flex flex-col items-center">
        <h2 className="world-grid-title">10 Fraction Game Worlds 🌟</h2>
        <p className="world-grid-subtitle">Earn at least 2 stars in each world to unlock the next challenge!</p>
      </div>

      <div className="worlds-grid-2x5">
        {worldsData.map((world, idx) => {
          const worldState = progress.worlds[world.id] || { stars: 0, unlocked: idx === 0 };
          
          // World N is unlocked if it's World 1 OR if World N-1 has >= 2 stars or is unlocked
          const prevWorldId = idx > 0 ? worldsData[idx - 1].id : null;
          const isUnlocked = idx === 0 || (prevWorldId && (progress.worlds[prevWorldId]?.stars >= 2 || progress.worlds[prevWorldId]?.unlocked));

          return (
            <div
              key={world.id}
              onClick={() => {
                if (isUnlocked) {
                  setSelectedWorldId(world.id);
                  setInRound(true);
                }
              }}
              className={`world-card-tile ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="world-tile-header">
                <span className="world-icon">{world.icon}</span>
                <span className="world-num-badge">W{world.num}</span>
              </div>

              <h3 className="world-name">{world.name}</h3>
              <p className="world-subtopic-tag">{world.subtopicTitle}</p>

              <div className="world-tile-stars-row">
                {[1, 2, 3].map(starNum => (
                  <Star
                    key={starNum}
                    className={`w-4 h-4 ${starNum <= (worldState.stars || 0) ? 'text-amber-300 fill-amber-300' : 'text-gray-500'}`}
                  />
                ))}
              </div>

              {!isUnlocked && (
                <div className="lock-overlay">
                  <Lock className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="lock-text">Earn 2★ in W{idx}</span>
                </div>
              )}

              {isUnlocked && (
                <button className="btn-play-world-pill">PLAY 🎮</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// IN-ROUND PLAY VIEW
function PlayRoundView({ worldId, onFinishRound, onBackToWorlds }) {
  const world = worldsData.find(w => w.id === worldId);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const roundQ = getRoundQuestions(worldId, 8);
    setQuestions(roundQ);
  }, [worldId]);

  const currentQ = questions[qIdx];

  useEffect(() => {
    if (currentQ) {
      speakText(currentQ.narrationText);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [qIdx, questions]);

  if (!currentQ) return <div className="p-8 text-white text-center font-bold">Loading questions...</div>;

  const handleSelectAnswer = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      const newStreak = streak + 1;
      const newScore = score + 1;
      setStreak(newStreak);
      setScore(newScore);

      speakText("Correct! Wonderful job!");

      setTimeout(() => {
        advanceNextQuestion(newScore, lives);
      }, 1400);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);

      speakText(`Not quite right! The correct answer is ${currentQ.correctAnswer}`);

      setTimeout(() => {
        if (newLives <= 0) {
          // Round finished due to 0 lives
          finishRound(score, 0);
        } else {
          advanceNextQuestion(score, newLives);
        }
      }, 2000);
    }
  };

  const advanceNextQuestion = (currentScore, currentLives) => {
    if (qIdx < questions.length - 1) {
      setQIdx(prev => prev + 1);
    } else {
      finishRound(currentScore, currentLives);
    }
  };

  const finishRound = (finalScore, finalLives) => {
    const pct = finalScore / questions.length;
    const stars = pct >= 1 ? 3 : pct >= 0.75 ? 2 : pct >= 0.5 ? 1 : 0;
    onFinishRound({
      worldId,
      score: finalScore,
      total: questions.length,
      stars
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
              <span>{score} pts</span>
            </div>

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
            {currentQ.conceptTitle || "FRACTION CHALLENGE"}
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
    </div>
  );
}
