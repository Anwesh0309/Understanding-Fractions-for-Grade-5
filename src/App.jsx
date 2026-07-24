import React, { useState, useEffect } from 'react';
import { PhaseTracker } from './components/shell/PhaseTracker';
import { AudioToggle } from './components/shell/AudioToggle';
import { WonderPhase } from './components/phases/WonderPhase';
import { StoryPhase } from './components/phases/StoryPhase';
import { SimulatePhase } from './components/phases/SimulatePhase';
import { PlayPhase } from './components/phases/PlayPhase';
import { ReflectPhase } from './components/phases/ReflectPhase';
import './App.css';

const LOCAL_STORAGE_KEY = "fractionverse_360_progress";

const defaultProgress = {
  xp: 0,
  maxStreak: 0,
  worlds: {
    "pizza-piazza": { attempts: 0, bestScore: 0, completed: false, unlocked: true }
  },
  completedPhases: {
    wonder: false,
    story: false,
    simulate: false,
    play: false,
    reflect: false
  }
};

export default function App() {
  const [currentPhase, setCurrentPhase] = useState("wonder");
  const [isIntroScreen, setIsIntroScreen] = useState(true);
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProgress;
    } catch (e) {
      return defaultProgress;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  }, [progress]);

  const markPhaseComplete = (phaseId) => {
    setProgress(prev => ({
      ...prev,
      completedPhases: {
        ...prev.completedPhases,
        [phaseId]: true
      }
    }));
  };

  const handlePhaseAdvance = (fromPhaseId, toPhaseId) => {
    markPhaseComplete(fromPhaseId);
    setCurrentPhase(toPhaseId);
    setIsIntroScreen(false);
  };

  const handleUpdateWorldProgress = ({ worldId, score, total, passed }) => {
    setProgress(prev => {
      const worldState = prev.worlds[worldId] || {};
      const newXP = prev.xp + score * 10;

      const nextWorldIdx = worldsData.findIndex(w => w.id === worldId) + 1;
      const nextWorldId = nextWorldIdx < worldsData.length ? worldsData[nextWorldIdx].id : null;

      const newWorlds = {
        ...prev.worlds,
        [worldId]: {
          attempts: (worldState.attempts || 0) + 1,
          bestScore: Math.max(worldState.bestScore || 0, score),
          completed: worldState.completed || passed,
          unlocked: true
        }
      };

      if (passed && nextWorldId) {
        newWorlds[nextWorldId] = {
          ...(newWorlds[nextWorldId] || {}),
          unlocked: true
        };
      }

      return {
        ...prev,
        xp: newXP,
        worlds: newWorlds
      };
    });
  };

  const showTopHeader = !(currentPhase === "wonder" && isIntroScreen);

  return (
    <div className="app-shell-viewport">
      {/* Background Floating Fraction Symbols */}
      <div className="bg-floating-symbols">
        <span className="symbol sym-1">½</span>
        <span className="symbol sym-2">¾</span>
        <span className="symbol sym-3">5/6</span>
        <span className="symbol sym-4">2/3</span>
        <span className="symbol sym-5">7/12</span>
        <span className="symbol sym-6">3/8</span>
      </div>

      {/* Top Header — Hidden during Intro Screen as requested */}
      {showTopHeader && (
        <header className="app-top-header">
          <div className="header-left-slot">
            <button
              onClick={() => {
                setCurrentPhase("wonder");
                setIsIntroScreen(true);
              }}
              className="header-home-btn"
            >
              🏠 Home
            </button>
          </div>

          <PhaseTracker
            currentPhase={currentPhase}
            completedPhases={progress.completedPhases}
            onPhaseSelect={(phaseId) => {
              setCurrentPhase(phaseId);
              setIsIntroScreen(false);
            }}
          />

          <div className="header-actions">
            <AudioToggle />
          </div>
        </header>
      )}

      {/* Floating Audio Button top-right during Intro screen */}
      {!showTopHeader && (
        <div className="floating-intro-audio-btn">
          <AudioToggle />
        </div>
      )}

      {/* Main Single-Frame Viewport Stage */}
      <main className="app-main-stage">
        {currentPhase === "wonder" && (
          <WonderPhase
            isIntroScreen={isIntroScreen}
            setIsIntroScreen={setIsIntroScreen}
            onComplete={() => handlePhaseAdvance("wonder", "story")}
          />
        )}

        {currentPhase === "story" && (
          <StoryPhase
            onComplete={() => handlePhaseAdvance("story", "simulate")}
          />
        )}

        {currentPhase === "simulate" && (
          <SimulatePhase
            onComplete={() => handlePhaseAdvance("simulate", "play")}
          />
        )}

        {currentPhase === "play" && (
          <PlayPhase
            progress={progress}
            onUpdateProgress={handleUpdateWorldProgress}
            onComplete={() => handlePhaseAdvance("play", "reflect")}
          />
        )}

        {currentPhase === "reflect" && (
          <ReflectPhase
            progress={progress}
            onRestart={() => setCurrentPhase("wonder")}
            onGoHome={() => setCurrentPhase("wonder")}
          />
        )}
      </main>
    </div>
  );
}
