import React from 'react';
import { Check, Lock } from 'lucide-react';

const PHASES = [
  { id: 'wonder', num: '01', icon: '🔍', label: 'Wonder' },
  { id: 'story', num: '02', icon: '📖', label: 'Story' },
  { id: 'simulate', num: '03', icon: '🧪', label: 'Simulate' },
  { id: 'play', num: '04', icon: '🎮', label: 'Play' },
  { id: 'reflect', num: '05', icon: '📋', label: 'Reflect' },
];

export function PhaseTracker({ currentPhase, completedPhases, onPhaseSelect }) {
  return (
    <div className="phase-tracker-pill-bar">
      {PHASES.map((phase, idx) => {
        const isCompleted = completedPhases[phase.id];
        const isActive = currentPhase === phase.id;
        
        // Strict Sequential Gating (Requirement 7):
        // Phase 01 (wonder) is always unlocked.
        // Phase N is unlocked if Phase N-1 is completed OR if it's the active phase.
        const prevPhaseId = idx > 0 ? PHASES[idx - 1].id : null;
        const isUnlocked = idx === 0 || completedPhases[prevPhaseId] || isActive;

        return (
          <button
            key={phase.id}
            onClick={() => {
              if (isUnlocked && onPhaseSelect) {
                onPhaseSelect(phase.id);
              }
            }}
            disabled={!isUnlocked}
            className={`phase-pill-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
            title={!isUnlocked ? `Complete Phase ${PHASES[idx-1].num} (${PHASES[idx-1].label}) first!` : phase.label}
          >
            <span className="phase-pill-status-icon">
              {isCompleted ? (
                <Check className="w-4 h-4 text-emerald-400 font-bold" />
              ) : !isUnlocked ? (
                <Lock className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <span className="phase-num-badge">{phase.num}</span>
              )}
            </span>

            <span className="phase-pill-emoji">{phase.icon}</span>
            <span className="phase-pill-label">{phase.label}</span>
          </button>
        );
      })}
    </div>
  );
}
