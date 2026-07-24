import React, { useState, useEffect } from 'react';
import { simulateStations, spotTheSlipProblems } from '../../data/simulateContent';
import { MascotBubble } from '../shell/MascotBubble';
import { speakText } from '../../utils/audio';
import { addFractions } from '../../utils/fractionMath';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export function SimulatePhase({ onComplete }) {
  const [activeTab, setActiveTab] = useState("slice-it");
  const [feedbackPopup, setFeedbackPopup] = useState(null); // { type: 'correct'|'wrong', title: string, message: string }

  const currentStation = simulateStations.find(s => s.id === activeTab) || simulateStations[0];

  useEffect(() => {
    if (currentStation) {
      speakText(`${currentStation.title}. ${currentStation.subtitle}`);
    }
  }, [activeTab]);

  const closeFeedback = () => {
    setFeedbackPopup(null);
  };

  return (
    <div className="simulate-phase-wrapper">
      <div className="simulate-container-card">
        {/* Top Horizontal Station Tabs A / B / C / D */}
        <div className="simulate-tabs-bar">
          {simulateStations.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveTab(st.id)}
              className={`simulate-tab-btn ${activeTab === st.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{st.icon}</span>
              <span className="tab-name">{st.tabName}</span>
            </button>
          ))}
        </div>

        {/* Station Subtitle & Mascot */}
        <div className="simulate-header-box">
          <div className="simulate-title-row">
            <h2 className="simulate-station-title">{currentStation.title}</h2>
            <span className="simulate-subtitle-pill">{currentStation.subtitle}</span>
          </div>
          <MascotBubble text={currentStation.mascotText} />
        </div>

        {/* Active Station Workspace */}
        <div className="simulate-workspace-area">
          {activeTab === "slice-it" && <StationSliceIt setFeedbackPopup={setFeedbackPopup} />}
          {activeTab === "match-it" && <StationMatchIt setFeedbackPopup={setFeedbackPopup} />}
          {activeTab === "fraction-slider" && <StationFractionSlider setFeedbackPopup={setFeedbackPopup} />}
          {activeTab === "spot-the-slip" && <StationSpotTheSlip setFeedbackPopup={setFeedbackPopup} />}
        </div>

        {/* Footer Navigation */}
        <div className="simulate-footer-nav">
          <div className="simulate-nav-left">
            <button
              onClick={() => {
                const idx = simulateStations.findIndex(s => s.id === activeTab);
                if (idx > 0) setActiveTab(simulateStations[idx - 1].id);
              }}
              disabled={activeTab === simulateStations[0].id}
              className="btn-sim-prev"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Previous Station
            </button>
          </div>

          <div className="simulate-nav-right">
            {activeTab !== simulateStations[simulateStations.length - 1].id ? (
              <button
                onClick={() => {
                  const idx = simulateStations.findIndex(s => s.id === activeTab);
                  if (idx < simulateStations.length - 1) setActiveTab(simulateStations[idx + 1].id);
                }}
                className="btn-sim-next"
              >
                Next Station <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="btn-sim-complete-gold"
              >
                Continue to Play Phase 🎮 <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EXACT MATCH SCREENSHOT FEEDBACK POPUP MODAL */}
      {feedbackPopup && (
        <div className="feedback-modal-backdrop-ss" onClick={closeFeedback}>
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

/* ==========================================
   STATION A: SLICE IT
   ========================================== */
function StationSliceIt({ setFeedbackPopup }) {
  const [parts, setParts] = useState(4);
  const [shadedParts, setShadedParts] = useState(1);

  const toggleSector = (idx) => {
    if (shadedParts === idx + 1) {
      setShadedParts(idx);
    } else {
      setShadedParts(idx + 1);
    }
  };

  const handleTestAnswer = () => {
    if (shadedParts > 0) {
      setFeedbackPopup({
        type: 'correct',
        message: `You sliced the pie into ${parts} equal parts and shaded ${shadedParts}. Fraction: ${shadedParts}/${parts}!`
      });
      speakText(`Great slicing! Fraction is ${shadedParts} over ${parts}.`);
    } else {
      setFeedbackPopup({
        type: 'wrong',
        message: `Tap on the pie sectors to shade at least 1 part!`
      });
    }
  };

  return (
    <div className="station-content-layout">
      <div className="station-controls-side">
        <label className="control-label">
          Slices in Whole (Denominator): <span className="text-amber-300 font-extrabold">{parts}</span>
        </label>
        <input
          type="range"
          min="2"
          max="12"
          value={parts}
          onChange={(e) => {
            const p = parseInt(e.target.value);
            setParts(p);
            if (shadedParts > p) setShadedParts(p);
          }}
          className="slider-input-gold"
        />

        <div className="fraction-display-badge">
          <span className="badge-title">Fraction Shaded:</span>
          <span className="badge-value">{shadedParts} / {parts}</span>
        </div>

        <button onClick={handleTestAnswer} className="btn-action-test">
          ✨ Verify Slice Model
        </button>
      </div>

      <div className="station-display-side">
        <div className="pie-interactive-stage">
          <svg viewBox="0 0 200 200" className="pie-large-svg">
            <circle cx="100" cy="100" r="90" fill="#1e1338" stroke="#ffffff" strokeWidth="4" />
            {Array.from({ length: parts }).map((_, i) => {
              const startAngle = (i * 360) / parts;
              const endAngle = ((i + 1) * 360) / parts;
              const isShaded = i < shadedParts;

              const x1 = 100 + 88 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 100 + 88 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 100 + 88 * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 100 + 88 * Math.sin((Math.PI * endAngle) / 180);

              const largeArc = endAngle - startAngle > 180 ? 1 : 0;
              const pathData = `M 100 100 L ${x1} ${y1} A 88 88 0 ${largeArc} 1 ${x2} ${y2} Z`;

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={isShaded ? '#f5a623' : 'rgba(255,255,255,0.08)'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => toggleSector(i)}
                  className="pie-sector-interactive"
                />
              );
            })}
          </svg>
        </div>
        <p className="hint-subtext">Click on any slice to shade or unshade it!</p>
      </div>
    </div>
  );
}

/* ==========================================
   STATION B: MATCH IT
   ========================================== */
function StationMatchIt({ setFeedbackPopup }) {
  const [shadedA, setShadedA] = useState(2);
  const [shadedB, setShadedB] = useState(3);

  const isEquivalent = (shadedA / 4) === (shadedB / 8);

  const handleCheckEquivalence = () => {
    if (isEquivalent) {
      setFeedbackPopup({
        type: 'correct',
        message: `Spot on! ${shadedA}/4 is EQUIVALENT to ${shadedB}/8 because both represent the exact same amount!`
      });
      speakText(`Spot on! ${shadedA}/4 is equivalent to ${shadedB}/8.`);
    } else {
      setFeedbackPopup({
        type: 'wrong',
        message: `${shadedA}/4 is NOT equal to ${shadedB}/8. Adjust Bar B so it shades the same total length as Bar A!`
      });
      speakText(`${shadedA}/4 is not equal to ${shadedB}/8.`);
    }
  };

  return (
    <div className="station-content-layout flex-col">
      <div className="match-bars-container">
        {/* BAR A */}
        <div className="match-bar-card">
          <div className="bar-card-header">
            <span>Bar A (4 equal parts)</span>
            <span className="fraction-tag">{shadedA} / 4</span>
          </div>
          <div className="interactive-grid-bar bar-4">
            {[0, 1, 2, 3].map(idx => (
              <div
                key={idx}
                onClick={() => setShadedA(idx + 1)}
                className={`grid-cell ${idx < shadedA ? 'shaded-gold' : ''}`}
              >
                1/4
              </div>
            ))}
          </div>
        </div>

        {/* BAR B */}
        <div className="match-bar-card">
          <div className="bar-card-header">
            <span>Bar B (8 equal parts)</span>
            <span className="fraction-tag">{shadedB} / 8</span>
          </div>
          <div className="interactive-grid-bar bar-8">
            {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => (
              <div
                key={idx}
                onClick={() => setShadedB(idx + 1)}
                className={`grid-cell ${idx < shadedB ? 'shaded-pink' : ''}`}
              >
                1/8
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="match-status-banner">
        {isEquivalent ? (
          <span className="status-text text-emerald-400">✅ Fractions Match! {shadedA}/4 = {shadedB}/8</span>
        ) : (
          <span className="status-text text-amber-300">⚠️ Shaded lengths differ — adjust to match!</span>
        )}

        <button onClick={handleCheckEquivalence} className="btn-verify-match">
          Check Equivalence
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   STATION C: FRACTION SLIDER (SUPER ATTRACTIVE FOR GRADE 5)
   ========================================== */
function StationFractionSlider({ setFeedbackPopup }) {
  const [numA, setNumA] = useState(1);
  const [denA, setDenA] = useState(3);
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(4);

  const result = addFractions({ num: numA, den: denA }, { num: numB, den: denB });

  const handleVerifyAddition = () => {
    setFeedbackPopup({
      type: 'correct',
      message: `${numA}/${denA} + ${numB}/${denB} = ${result.num1}/${result.commonDen} + ${result.num2}/${result.commonDen} = ${result.simplifiedNum}/${result.simplifiedDen}!`
    });
    speakText(`Calculated sum is ${result.simplifiedNum} over ${result.simplifiedDen}`);
  };

  return (
    <div className="station-content-layout">
      {/* Controls & Interactive Fraction Bars Side */}
      <div className="station-controls-side space-y-4">
        {/* Fraction A Interactive Slider Card */}
        <div className="fraction-slider-card blue-theme">
          <div className="slider-card-header">
            <span className="label-badge-blue">Fraction A 🔷</span>
            <span className="fraction-value-tag">{numA} / {denA}</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max={denA - 1}
              value={numA}
              onChange={e => setNumA(parseInt(e.target.value))}
              className="slider-input-blue"
            />
            <select
              value={denA}
              onChange={e => { setDenA(parseInt(e.target.value)); setNumA(1); }}
              className="select-den-custom"
            >
              <option value="2">/2</option>
              <option value="3">/3</option>
              <option value="4">/4</option>
              <option value="6">/6</option>
              <option value="8">/8</option>
              <option value="12">/12</option>
            </select>
          </div>

          {/* Visual Fraction Bar A */}
          <div className="visual-fraction-bar-row">
            {Array.from({ length: denA }).map((_, i) => (
              <div
                key={i}
                className={`fraction-bar-cell ${i < numA ? 'cell-shaded-blue' : ''}`}
              >
                1/{denA}
              </div>
            ))}
          </div>
        </div>

        {/* Fraction B Interactive Slider Card */}
        <div className="fraction-slider-card pink-theme">
          <div className="slider-card-header">
            <span className="label-badge-pink">Fraction B 🌸</span>
            <span className="fraction-value-tag">{numB} / {denB}</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max={denB - 1}
              value={numB}
              onChange={e => setNumB(parseInt(e.target.value))}
              className="slider-input-pink"
            />
            <select
              value={denB}
              onChange={e => { setDenB(parseInt(e.target.value)); setNumB(1); }}
              className="select-den-custom"
            >
              <option value="2">/2</option>
              <option value="3">/3</option>
              <option value="4">/4</option>
              <option value="6">/6</option>
              <option value="8">/8</option>
              <option value="12">/12</option>
            </select>
          </div>

          {/* Visual Fraction Bar B */}
          <div className="visual-fraction-bar-row">
            {Array.from({ length: denB }).map((_, i) => (
              <div
                key={i}
                className={`fraction-bar-cell ${i < numB ? 'cell-shaded-pink' : ''}`}
              >
                1/{denB}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleVerifyAddition} className="btn-action-test mt-2">
          ✨ Calculate & Verify Addition
        </button>
      </div>

      {/* Live Math Worked Solution Box */}
      <div className="station-display-side">
        <div className="worked-solution-card-attractive">
          <div className="worked-header-pill">
            <Sparkles className="w-4 h-4 text-amber-300 inline mr-1.5" />
            Live Fractional Addition Visualizer
          </div>

          <div className="math-equation-display-hero">
            <span className="eq-part text-cyan-300">{numA}/{denA}</span>
            <span className="eq-op">+</span>
            <span className="eq-part text-pink-300">{numB}/{denB}</span>
            <span className="eq-op">=</span>
            <span className="eq-result text-amber-300">{result.simplifiedNum}/{result.simplifiedDen}</span>
          </div>

          <div className="worked-steps-list space-y-2 text-left w-full mt-3">
            <div className="step-badge-row">
              <span className="step-num">Step 1:</span> Find Common Denominator (LCD) = <strong>{result.commonDen}</strong>
            </div>

            <div className="step-badge-row">
              <span className="step-num">Step 2:</span> Convert Fractions ➔
              <span className="text-cyan-300 font-bold ml-1">{result.num1}/{result.commonDen}</span> +
              <span className="text-pink-300 font-bold ml-1">{result.num2}/{result.commonDen}</span>
            </div>

            {/* Combined Common Parts Visual Bar */}
            <div className="combined-lcd-visual-box mt-3">
              <div className="text-xs font-bold text-gray-300 mb-1 text-center">
                Combined Grid ({result.commonDen} equal parts):
              </div>
              <div className="combined-grid-bar">
                {Array.from({ length: result.commonDen }).map((_, i) => {
                  const isA = i < result.num1;
                  const isB = i >= result.num1 && i < result.num1 + result.num2;
                  return (
                    <div
                      key={i}
                      className={`grid-cell-mini ${isA ? 'fill-blue' : isB ? 'fill-pink' : ''}`}
                    >
                      1/{result.commonDen}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="step-badge-row final-result-highlight">
              <span className="step-num">Result:</span> Total = <strong>{result.rawNum}/{result.commonDen}</strong> = <span className="text-amber-300 font-extrabold text-lg">{result.simplifiedNum}/{result.simplifiedDen}</span>
              {result.mixed.whole > 0 && <span className="ml-2 text-emerald-300">({result.mixed.whole} {result.mixed.num}/{result.mixed.den})</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   STATION D: SPOT THE SLIP
   ========================================== */
function StationSpotTheSlip({ setFeedbackPopup }) {
  const [probIdx, setProbIdx] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);

  const problem = spotTheSlipProblems[probIdx];

  const handleSelectLine = (step) => {
    setSelectedLine(step.line);
    if (step.isError) {
      setFeedbackPopup({
        type: 'correct',
        message: `Spot on! You found the slip-up in Step ${step.line}! ${step.correction}`
      });
      speakText(`Spot on! You found the slip in Step ${step.line}.`);
    } else {
      setFeedbackPopup({
        type: 'wrong',
        message: `Step ${step.line} is mathematically correct. Look closely at the other steps for the mistake!`
      });
      speakText(`Step ${step.line} is correct. Look closely at the other steps.`);
    }
  };

  return (
    <div className="station-content-layout flex-col">
      <div className="spot-problem-card">
        <div className="spot-header-row">
          <h3 className="spot-problem-title">{problem.title}</h3>
          <button
            onClick={() => {
              setProbIdx((prev) => (prev + 1) % spotTheSlipProblems.length);
              setSelectedLine(null);
            }}
            className="btn-new-problem"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 inline" /> New Problem
          </button>
        </div>

        <div className="spot-steps-list">
          {problem.steps.map((step) => (
            <div
              key={step.line}
              onClick={() => handleSelectLine(step)}
              className={`spot-step-item ${selectedLine === step.line ? (step.isError ? 'correct-slip' : 'wrong-pick') : ''}`}
            >
              <span className="step-text">{step.text}</span>
              {selectedLine === step.line && (
                <span className="step-tag">
                  {step.isError ? '🎯 Mistake Found!' : '✅ Correct Step'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
