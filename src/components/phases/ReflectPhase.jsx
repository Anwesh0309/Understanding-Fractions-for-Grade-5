import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MascotBubble } from '../shell/MascotBubble';
import { speakText } from '../../utils/audio';
import { Trophy, Star, Award, RotateCcw, Home, Printer, Sparkles, Download } from 'lucide-react';

export function ReflectPhase({ progress, onRestart, onGoHome }) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [studentName, setStudentName] = useState("Oliver");

  useEffect(() => {
    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn("Confetti error:", e);
    }
    speakText("Journey Complete! You have mastered Grade 5 Fractions! View your overall scoreboard and certificate!");
  }, []);

  // Calculate aggregate stats
  const totalWorlds = 10;
  const worldsMastered = Object.values(progress.worlds).filter(w => w.stars >= 2).length;
  const totalStars = Object.values(progress.worlds).reduce((acc, w) => acc + (w.stars || 0), 0);
  const maxPossibleStars = 30;
  const masteryPct = Math.round((totalStars / maxPossibleStars) * 100) || 75;

  if (showCertificate) {
    return (
      <div className="certificate-modal-wrapper">
        <div className="certificate-paper-card">
          <div className="certificate-border-glow">
            <div className="certificate-header">
              <div className="cert-badge-gold">
                <Award className="w-8 h-8 text-amber-400" />
              </div>
              <h1 className="cert-main-title">Certificate of Excellence</h1>
              <p className="cert-subtitle">Singapore MOE Curriculum · Primary 5 Mathematics</p>
            </div>

            <div className="cert-body-content">
              <p className="cert-presented-text">This certificate is proudly awarded to:</p>

              <div className="cert-name-input-box">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter Student Name"
                  className="cert-name-input"
                />
              </div>

              <p className="cert-achievement-text">
                For successfully completing the 5-Phase Learning Journey in <strong className="text-amber-300">Understanding Fractions</strong>, demonstrating high conceptual mastery in equivalent fractions, comparison, addition, subtraction, division, and multi-step word problems.
              </p>

              <div className="cert-details-grid">
                <div className="cert-detail-item">
                  <span className="detail-label">Mastery Score</span>
                  <span className="detail-val">{masteryPct}%</span>
                </div>
                <div className="cert-detail-item">
                  <span className="detail-label">Worlds Mastered</span>
                  <span className="detail-val">{worldsMastered} / 10</span>
                </div>
                <div className="cert-detail-item">
                  <span className="detail-label">Total Stars</span>
                  <span className="detail-val">⭐ {totalStars} / 30</span>
                </div>
              </div>

              <div className="cert-signature-row">
                <div className="sign-box">
                  <span className="sign-line">Figgy Fox 🦊</span>
                  <span className="sign-title">Master Guide · FractionVerse</span>
                </div>
                <div className="sign-box">
                  <span className="sign-line">{new Date().toLocaleDateString()}</span>
                  <span className="sign-title">Completion Date</span>
                </div>
              </div>
            </div>

            <div className="cert-actions-row no-print">
              <button onClick={() => window.print()} className="btn-cert-print">
                <Printer className="w-4 h-4 mr-1 inline" /> Print Certificate
              </button>

              <button onClick={() => setShowCertificate(false)} className="btn-cert-close">
                Back to Scoreboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-phase-wrapper">
      <div className="reflect-scoreboard-card">
        <div className="reflect-header-node">
          <div className="trophy-bounce-box">
            <Trophy className="w-12 h-12 text-amber-300" />
          </div>
          <h2 className="reflect-title">Journey Complete! 🎉</h2>
          <p className="reflect-subline">You finished all 5 phases of Grade 5 Fractions!</p>
        </div>

        {/* Circular Mastery Ring */}
        <div className="mastery-ring-stage">
          <svg viewBox="0 0 120 120" className="mastery-ring-svg">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#f5a623"
              strokeWidth="10"
              strokeDasharray="314"
              strokeDashoffset={314 - (314 * masteryPct) / 100}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="mastery-ring-text">
            <span className="mastery-pct-val">{masteryPct}%</span>
            <span className="mastery-pct-label">Mastery</span>
          </div>
        </div>

        {/* 3 Stats Tiles */}
        <div className="reflect-stats-grid">
          <div className="reflect-stat-tile">
            <span className="stat-tile-label">XP Earned</span>
            <span className="stat-tile-val text-amber-300">⚡ {progress.xp}</span>
          </div>

          <div className="reflect-stat-tile">
            <span className="stat-tile-label">Max Streak</span>
            <span className="stat-tile-val text-orange-400">🔥 {progress.maxStreak}x</span>
          </div>

          <div className="reflect-stat-tile">
            <span className="stat-tile-label">Worlds Mastered</span>
            <span className="stat-tile-val text-emerald-400">🏆 {worldsMastered}/{totalWorlds}</span>
          </div>
        </div>

        <div className="my-2 w-full">
          <MascotBubble text={`Awesome slicing! You earned ${totalStars} stars across 10 worlds! Tap Certificate to claim your award!`} />
        </div>

        {/* Actions Row */}
        <div className="scoreboard-actions-row">
          <button onClick={() => setShowCertificate(true)} className="btn-certificate-gold">
            <Award className="w-4 h-4 mr-1 inline" /> View Certificate
          </button>

          <button onClick={onRestart} className="btn-play-again-yellow">
            <RotateCcw className="w-4 h-4 mr-1 inline" /> Play Again
          </button>

          <button onClick={onGoHome} className="btn-home-white">
            <Home className="w-4 h-4 mr-1 inline" /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
