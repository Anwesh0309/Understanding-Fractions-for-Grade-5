import fs from 'fs';
import path from 'path';

const cssPath = path.resolve('Understanding-Fractions-for-Grade-5-main/src/App.css');
const backupPath = path.resolve('Understanding-Fractions-for-Grade-5-main/src/App.css.bak');

let css = fs.readFileSync(cssPath, 'utf-8');
fs.writeFileSync(backupPath, css);
console.log('Backed up App.css to App.css.bak');

// 1. Update body, html, #root, and .app-shell-viewport
const oldShellRegex = /body,\s*html\s*\{[\s\S]*?\}\s*#root\s*\{[\s\S]*?\}\s*\/\* =+[\s\S]*?APP SHELL & BACKGROUND SYMBOLS[\s\S]*?\.app-shell-viewport\s*\{[\s\S]*?\}/;

const newShellBlock = `body, html {
  width: 100%;
  min-height: 100%;
  font-family: var(--font-family);
  background: radial-gradient(circle at 50% 25%, #231254 0%, #100926 70%, #0a0518 100%);
  color: var(--text-white);
  user-select: none;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Custom sleek scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(16, 9, 38, 0.6);
}
::-webkit-scrollbar-thumb {
  background: rgba(245, 166, 35, 0.45);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 166, 35, 0.75);
}

/* ==========================================================================
   APP SHELL & BACKGROUND SYMBOLS
   ========================================================================== */
.app-shell-viewport {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}`;

css = css.replace(oldShellRegex, newShellBlock);

// 2. Update .app-main-stage
const oldMainStageRegex = /\/\* MAIN STAGE \*\/\s*\.app-main-stage\s*\{[\s\S]*?\}/;
const newMainStageBlock = `/* MAIN STAGE */
.app-main-stage {
  flex: 1;
  width: 100%;
  min-height: 0;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 12px clamp(12px, 3vw, 24px) 32px;
  overflow-y: auto;
  overflow-x: hidden;
}`;

css = css.replace(oldMainStageRegex, newMainStageBlock);

// 3. Update .app-top-header and .phase-tracker-pill-bar
const oldHeaderRegex = /\/\* TOP HEADER & PHASE TRACKER \*\/\s*\.app-top-header\s*\{[\s\S]*?\}/;
const newHeaderBlock = `/* TOP HEADER & PHASE TRACKER */
.app-top-header {
  height: 64px;
  width: 100%;
  padding: 0 clamp(12px, 3vw, 24px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  backdrop-filter: none;
  border-bottom: none;
  z-index: 20;
  flex-shrink: 0;
  gap: 8px;
}

@media (max-width: 768px) {
  .app-top-header {
    height: auto;
    min-height: 56px;
    padding: 8px 12px;
    flex-wrap: wrap;
  }
}`;

css = css.replace(oldHeaderRegex, newHeaderBlock);

// Update .phase-tracker-pill-bar & items
const oldPhaseBarRegex = /\.phase-tracker-pill-bar\s*\{[\s\S]*?\}\s*\.phase-pill-item\s*\{[\s\S]*?\}/;
const newPhaseBarBlock = `.phase-tracker-pill-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  padding: 4px 8px;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.phase-tracker-pill-bar::-webkit-scrollbar {
  display: none;
}

.phase-pill-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 50px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-family: var(--font-family);
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .phase-pill-item {
    padding: 5px 8px;
    font-size: 12px;
  }
  .phase-pill-item:not(.active) .phase-pill-label {
    display: none;
  }
}`;

css = css.replace(oldPhaseBarRegex, newPhaseBarBlock);

// 4. Update Wonder Hero section (.wonder-hero-wrapper-ss)
const oldWonderHeroRegex = /\.wonder-hero-wrapper-ss\s*\{[\s\S]*?\}\s*\.hero-ss-container\s*\{[\s\S]*?\}/;
const newWonderHeroBlock = `.wonder-hero-wrapper-ss {
  width: 100%;
  max-width: 760px;
  margin: auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px 24px;
}

.hero-ss-container {
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}`;

css = css.replace(oldWonderHeroRegex, newWonderHeroBlock);

// Hero title & desc & journey & bottom tiles
const oldHeroDetailsRegex = /\.hero-ss-main-title\s*\{[\s\S]*?\}\s*\.title-part-orange[\s\S]*?\.hero-ss-desc\s*\{[\s\S]*?\}/;
const newHeroDetailsBlock = `.hero-ss-main-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(30px, 5.5vw, 48px);
  font-weight: 900;
  line-height: 1.15;
  margin-top: 2px;
  letter-spacing: -0.5px;
}

.title-part-orange {
  color: #FF5722;
  text-shadow: 0 3px 12px rgba(255, 87, 34, 0.4);
}

.title-part-white {
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.title-part-yellow {
  color: #FFC107;
  text-shadow: 0 0 20px rgba(255, 193, 7, 0.6);
}

.hero-ss-subbrand {
  font-family: 'Fredoka', sans-serif;
  font-size: 14px;
  font-weight: 900;
  color: #FFC107;
  letter-spacing: 1px;
  margin-top: -6px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.hero-ss-mascot-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  max-width: 380px;
  margin: 4px 0;
}

.fox-avatar-circle-ss {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(255, 193, 7, 0.5);
  flex-shrink: 0;
}

.fox-emoji-ss {
  font-size: 24px;
}

.speech-bubble-box-ss {
  background: #ffffff;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  padding: 10px 16px;
  text-align: left;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}

.speech-text-ss {
  font-family: 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: 13px;
  color: #120B2E;
  margin: 0;
  line-height: 1.35;
}

.hero-ss-desc {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(13px, 2vw, 15px);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  max-width: 580px;
  line-height: 1.5;
  margin-bottom: 2px;
}`;

css = css.replace(oldHeroDetailsRegex, newHeroDetailsBlock);

// Journey flow row responsive
const oldJourneyFlowRegex = /\.journey-flow-row\s*\{[\s\S]*?\}\s*\.journey-flow-row\.center-row\s*\{[\s\S]*?\}/;
const newJourneyFlowBlock = `.journey-flow-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.journey-flow-row.center-row {
  justify-content: center;
}

@media (max-width: 600px) {
  .journey-flow-row {
    flex-wrap: wrap;
    gap: 6px;
  }
  .flow-arrow {
    display: none;
  }
  .hero-ss-bottom-tiles {
    flex-direction: column;
    width: 100%;
  }
  .ss-feature-tile {
    width: 100%;
  }
}`;

css = css.replace(oldJourneyFlowRegex, newJourneyFlowBlock);

// 5. Update Wonder Puzzle view (.wonder-phase-container-ss)
const oldWonderPuzzleRegex = /\.wonder-phase-container-ss\s*\{[\s\S]*?\}\s*\.wonder-puzzle-stage-ss\s*\{[\s\S]*?\}\s*\.giant-question-circle-purple\s*\{[\s\S]*?\}\s*\.wonder-puzzle-main-card\s*\{[\s\S]*?\}\s*\.puzzle-top-icon[\s\S]*?\.wonder-puzzle-question-text\s*\{[\s\S]*?\}/;
const newWonderPuzzleBlock = `.wonder-phase-container-ss {
  width: 100%;
  max-width: 680px;
  margin: auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
}

.wonder-puzzle-stage-ss {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.giant-question-circle-purple {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C4DFF 0%, #651FFF 100%);
  border: 3px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', sans-serif;
  font-size: 50px;
  font-weight: 900;
  color: #ffffff;
  box-shadow: 0 0 32px rgba(124, 77, 255, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4);
  animation: floatGentle 3s ease-in-out infinite;
}

.wonder-puzzle-main-card {
  width: 100%;
  background: rgba(22, 14, 48, 0.85);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 28px;
  padding: clamp(20px, 4vw, 32px);
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.puzzle-top-icon {
  font-size: 38px;
  margin-bottom: 8px;
}

.wonder-puzzle-question-text {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(20px, 3.5vw, 25px);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.35;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.4);
}`;

css = css.replace(oldWonderPuzzleRegex, newWonderPuzzleBlock);

// 6. Update Story Phase (.story-phase-wrapper-ss & .story-main-glass-card)
const oldStoryRegex = /\.story-phase-wrapper-ss\s*\{[\s\S]*?\}\s*\.story-stage-container\s*\{[\s\S]*?\}\s*\.story-top-progress-row[\s\S]*?\.story-main-glass-card\s*\{[\s\S]*?\}\s*\.story-image-side-box\s*\{[\s\S]*?\}\s*\.story-hd-image-wrapper[\s\S]*?\.story-content-side-box\s*\{[\s\S]*?\}/;
const newStoryBlock = `.story-phase-wrapper-ss {
  width: 100%;
  max-width: 860px;
  margin: auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
}

.story-stage-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.story-top-progress-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.story-progress-line-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  overflow: hidden;
}

.story-progress-line-fill {
  height: 100%;
  background: linear-gradient(90deg, #A855F7 0%, #FFC107 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.6);
}

.story-slide-counter {
  font-family: 'Fredoka', sans-serif;
  font-size: 13px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.7);
}

.story-main-glass-card {
  width: 100%;
  min-height: 420px;
  max-height: calc(100vh - 160px);
  background: rgba(22, 14, 48, 0.85);
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  border-radius: 28px;
  backdrop-filter: blur(16px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  display: flex;
  overflow: hidden;
}

.story-image-side-box {
  width: 46%;
  min-width: 260px;
  height: 100%;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.story-hd-image-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.story-hd-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.story-content-side-box {
  width: 54%;
  height: 100%;
  padding: clamp(16px, 3vw, 26px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  gap: 10px;
}

@media (max-width: 768px) {
  .story-main-glass-card {
    flex-direction: column;
    max-height: none;
    height: auto;
  }
  .story-image-side-box {
    width: 100%;
    height: 220px;
  }
  .story-content-side-box {
    width: 100%;
    height: auto;
    padding: 16px;
    overflow-y: visible;
  }
}`;

css = css.replace(oldStoryRegex, newStoryBlock);

// 7. Update Simulate Phase (.simulate-phase-wrapper & .simulate-container-card)
const oldSimRegex = /\.simulate-phase-wrapper\s*\{[\s\S]*?\}\s*\.simulate-container-card\s*\{[\s\S]*?\}\s*\.simulate-tabs-bar\s*\{[\s\S]*?\}\s*\.simulate-tab-btn[\s\S]*?\.simulate-workspace-area\s*\{[\s\S]*?\}/;
const newSimBlock = `.simulate-phase-wrapper {
  width: 100%;
  max-width: 960px;
  margin: auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.simulate-container-card {
  width: 100%;
  min-height: 520px;
  max-height: calc(100vh - 84px);
  background: var(--card-bg);
  border: 1.5px solid var(--card-border);
  border-radius: 28px;
  backdrop-filter: blur(16px);
  padding: clamp(12px, 2.5vw, 18px) clamp(14px, 3vw, 24px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  overflow: hidden;
}

@media (max-height: 720px), (max-width: 768px) {
  .simulate-container-card {
    max-height: none;
    height: auto;
    overflow: visible;
  }
}

.simulate-tabs-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 6px;
}

@media (max-width: 640px) {
  .simulate-tabs-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

.simulate-tab-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-family);
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.simulate-tab-btn.active {
  background: linear-gradient(135deg, #f5a623 0%, #ff9800 100%);
  color: #100926;
  border-color: #ffffff;
  box-shadow: 0 4px 14px rgba(245, 166, 35, 0.4);
}

.simulate-header-box {
  margin-bottom: 8px;
}

.simulate-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.simulate-station-title {
  font-size: 18px;
  font-weight: 900;
}

.simulate-subtitle-pill {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
  padding: 3px 10px;
  border-radius: 50px;
}

.simulate-workspace-area {
  flex: 1;
  min-height: 280px;
  background: rgba(0, 0, 0, 0.22);
  border-radius: 20px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .station-content-layout {
    flex-direction: column;
    gap: 16px;
  }
  .station-controls-side, .station-display-side {
    width: 100%;
  }
}`;

css = css.replace(oldSimRegex, newSimBlock);

// 8. Update Practice World Grid (.play-world-grid-wrapper-ss)
const oldWorldGridRegex = /\.play-world-grid-wrapper-ss\s*\{[\s\S]*?\}\s*\.world-grid-title-ss\s*\{[\s\S]*?\}\s*\.world-grid-subtitle-ss[\s\S]*?\.worlds-grid-2x5-ss\s*\{[\s\S]*?\}\s*\.world-card-tile-ss\s*\{[\s\S]*?\}/;
const newWorldGridBlock = `.play-world-grid-wrapper-ss {
  width: 100%;
  max-width: 960px;
  margin: auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 14px 24px;
}

.world-grid-title-ss {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 4px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.4);
  text-align: center;
}

.world-grid-subtitle-ss {
  font-family: 'Fredoka', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 14px;
  text-align: center;
}

.worlds-grid-2x5-ss {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  width: 100%;
  max-width: 880px;
}

@media (max-width: 920px) {
  .worlds-grid-2x5-ss {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

@media (max-width: 580px) {
  .worlds-grid-2x5-ss {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

.world-card-tile-ss {
  background: rgba(22, 14, 48, 0.75);
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  min-height: 160px;
  height: auto;
  position: relative;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  transition: all 0.2s ease;
}`;

css = css.replace(oldWorldGridRegex, newWorldGridBlock);

// 9. Update Practice Question Stage (.play-phase-wrapper-ss & .play-main-card-ss)
const oldPlayStageRegex = /\.play-phase-wrapper-ss\s*\{[\s\S]*?\}\s*\.play-world-stage-ss\s*\{[\s\S]*?\}\s*\.top-world-pink-pill-ss[\s\S]*?\.play-main-card-ss\s*\{[\s\S]*?\}\s*\.top-orange-badge-ss[\s\S]*?\.play-stem-title-ss\s*\{[\s\S]*?\}\s*\.play-tiles-2x2-ss\s*\{[\s\S]*?\}\s*\.play-tile-btn-ss\s*\{[\s\S]*?\}/;
const newPlayStageBlock = `.play-phase-wrapper-ss {
  width: 100%;
  max-width: 680px;
  margin: auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
}

.play-world-stage-ss {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-world-pink-pill-ss {
  background: linear-gradient(135deg, #E91E63 0%, #D81B60 100%);
  border: 1.5px solid #ffffff;
  border-radius: 50px;
  padding: 5px 22px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: 13px;
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(233, 30, 99, 0.5);
  margin-bottom: 12px;
}

.play-stats-bar-ss {
  width: 100%;
  margin-bottom: 12px;
}

.stats-pill-row-ss {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-pill-ss {
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  border-radius: 50px;
  padding: 4px 16px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: 13px;
  color: #ffffff;
  display: flex;
  align-items: center;
}

.progress-info-row-ss {
  display: flex;
  justify-content: space-between;
  font-family: 'Fredoka', sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.progress-track-bg-ss {
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  overflow: hidden;
}

.progress-track-fill-ss {
  height: 100%;
  background: linear-gradient(90deg, #FFC107 0%, #FF9800 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.play-main-card-ss {
  width: 100%;
  max-width: 660px;
  background: rgba(22, 14, 48, 0.88);
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  border-radius: 26px;
  padding: clamp(16px, 3.5vw, 24px);
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.top-orange-badge-ss {
  background: linear-gradient(135deg, #FF5722 0%, #FF9800 100%);
  border: 1.5px solid #ffffff;
  border-radius: 50px;
  padding: 4px 16px;
  font-family: 'Fredoka', sans-serif;
  font-size: 11px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 1px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
}

.play-stem-title-ss {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(16px, 3vw, 20px);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.35;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.play-tiles-2x2-ss {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  margin-bottom: 8px;
}

@media (max-width: 480px) {
  .play-tiles-2x2-ss {
    grid-template-columns: 1fr;
  }
}

.play-tile-btn-ss {
  min-height: 52px;
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 10px 14px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: clamp(15px, 2.5vw, 18px);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-word;
}`;

css = css.replace(oldPlayStageRegex, newPlayStageBlock);

// 10. Update Reflect Phase (.reflect-phase-wrapper & .reflect-scoreboard-card)
const oldReflectRegex = /\.reflect-phase-wrapper\s*\{[\s\S]*?\}\s*\.reflect-scoreboard-card\s*\{[\s\S]*?\}\s*\.reflect-header-node[\s\S]*?\.reflect-stats-grid\s*\{[\s\S]*?\}/;
const newReflectBlock = `.reflect-phase-wrapper {
  width: 100%;
  max-width: 680px;
  margin: auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.reflect-scoreboard-card {
  width: 100%;
  max-width: 660px;
  background: var(--card-bg);
  border: 1.5px solid var(--card-border);
  border-radius: 28px;
  padding: clamp(18px, 4vw, 28px);
  backdrop-filter: blur(16px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.reflect-header-node { margin-bottom: 8px; }
.reflect-title { font-size: 26px; font-weight: 900; }
.reflect-subline { font-size: 13px; color: rgba(255, 255, 255, 0.7); }

.mastery-ring-stage {
  position: relative;
  width: 110px;
  height: 110px;
  margin: 8px 0;
}

.mastery-ring-svg { width: 100%; height: 100%; }

.mastery-ring-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mastery-pct-val { font-size: 22px; font-weight: 900; color: var(--accent-gold); }
.mastery-pct-label { font-size: 10px; color: rgba(255, 255, 255, 0.6); }

.reflect-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  margin-bottom: 8px;
}

@media (max-width: 520px) {
  .reflect-stats-grid {
    grid-template-columns: 1fr;
  }
}`;

css = css.replace(oldReflectRegex, newReflectBlock);

// 11. Append Keyframe Animations if missing
if (!css.includes('@keyframes floatGentle')) {
  css += `
/* Global Animations */
@keyframes floatGentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.88); }
  60% { opacity: 1; transform: scale(1.03); }
  100% { transform: scale(1); }
}

@keyframes pulseGlow {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(245, 166, 35, 0.4)); }
  50% { filter: drop-shadow(0 0 16px rgba(245, 166, 35, 0.85)); }
}
`;
}

fs.writeFileSync(cssPath, css);
console.log('App.css successfully updated and polished!');

