/**
 * Wafy Campus Fest Quiz 2026-27 - Main Application Logic
 * Modern, Offline-First, Presentation-Grade Quiz Experience
 */

class QuizApp {
  constructor() {
    this.data = QUIZ_DATA;
    this.currentView = 'landing'; // landing, gap, general-q, r2-boxes, r2-choice, r4-boxes, r4-clue, finish
    this.currentRoundIdx = 0; // 0 to 4 (Rounds 1 to 5)
    this.currentQuestionIdx = 0; // Question index inside general round
    this.currentBoxNum = null; // Currently selected box in R2 or R4 (1 to 6)
    this.currentR2Question = null; // Specific question object in R2 (Option H or A)
    this.currentR4ClueStep = 1; // 1, 2, or 3 for R4
    
    // Timer state
    this.currentDuration = 60; // 30s, 40s, or 60s
    this.timerSeconds = 60;
    this.timerRunning = false;
    this.timerInterval = null;
    this.questionStarted = false;

    // Track used boxes (hide once completed)
    this.r2UsedBoxes = new Set();
    this.r4UsedBoxes = new Set();

    // R2 / R4 Spin state
    this.isSpinning = false;

    // Countdown timers
    this.answerCountdownTimer = null;
    this.r2EvalTimer = null;
    this.resultsCountdownTimer = null;

    // Teams & Scoreboard
    this.teams = [
      { name: "Team A", score: 0 },
      { name: "Team B", score: 0 },
      { name: "Team C", score: 0 },
      { name: "Team D", score: 0 },
      { name: "Team E", score: 0 },
      { name: "Team F", score: 0 }
    ];
    this.activeTeamIdx = 0;

    // Preloader state
    this.loadedAssetsCount = 0;
    this.totalAssetsCount = 37;

    // DOM Cache
    this.dom = {};
  }

  init() {
    this.cacheDom();
    this.bindEvents();
    this.renderScoreboard();
    this.preloadAllAssets();
    this.showLanding();
    console.log("Quiz App Initialized");
  }

  cacheDom() {
    this.dom.stage = document.getElementById('quiz-stage');
    this.dom.header = document.getElementById('stage-header');
    this.dom.roundBadge = document.getElementById('header-round-badge');
    this.dom.qBadge = document.getElementById('header-q-badge');
    this.dom.viewContainer = document.getElementById('stage-content');
    this.dom.timerContainer = document.getElementById('stage-timer-widget');
    this.dom.timerSeconds = document.getElementById('timer-seconds-display');
    this.dom.timerSvgCircle = document.getElementById('timer-progress-circle');

    // Modals & Drawers
    this.dom.timeOverModal = document.getElementById('time-over-modal');
    this.dom.judgeDrawer = document.getElementById('judge-drawer');
    this.dom.scoresModal = document.getElementById('scores-modal');

    // Answer Reveal Modal (General Rounds)
    this.dom.answerModal = document.getElementById('answer-modal');
    this.dom.answerRevealCard = document.getElementById('answer-reveal-card');
    this.dom.answerModalBadge = document.getElementById('answer-modal-badge');
    this.dom.answerModalQText = document.getElementById('answer-modal-qtext');
    this.dom.answerModalValue = document.getElementById('answer-modal-value');
    this.dom.answerModalHint = document.getElementById('answer-modal-hint');

    // Confirmation & Results Countdown Modals
    this.dom.confirmResultsModal = document.getElementById('confirm-results-modal');
    this.dom.resultsCountdownOverlay = document.getElementById('results-countdown-overlay');
    this.dom.r2EvalModal = document.getElementById('r2-eval-modal');
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => this.handleKeypress(e));

    // Fullscreen toggle
    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // Audio Mute toggle
    const audioBtn = document.getElementById('btn-toggle-sound');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.audioMgr.toggleMute();
        audioBtn.innerHTML = isMuted ? '🔇' : '🔊';
        audioBtn.title = isMuted ? 'Unmute Sound' : 'Mute Sound';
      });
    }

    // Judge drawer toggle
    const judgeBtn = document.getElementById('btn-judge-menu');
    if (judgeBtn) {
      judgeBtn.addEventListener('click', () => this.toggleJudgeDrawer());
    }

    document.getElementById('judge-drawer-close')?.addEventListener('click', () => this.closeJudgeDrawer());
    document.getElementById('scoreboard-btn')?.addEventListener('click', () => this.toggleScoreboard());
    document.getElementById('scores-modal-close')?.addEventListener('click', () => this.closeScoreboard());

    document.getElementById('btn-dismiss-timeover')?.addEventListener('click', () => {
      this.dom.timeOverModal.classList.add('hidden');
    });
  }

  handleKeypress(e) {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    const key = e.key.toLowerCase();

    // Round 2 Evaluation active modal checks
    const r2Modal = document.getElementById('r2-eval-modal');
    const isR2ModalOpen = r2Modal && !r2Modal.classList.contains('hidden');
    const wrongCard = document.getElementById('r2-wrong-card');
    const isWrongCardVisible = isR2ModalOpen && wrongCard && !wrongCard.classList.contains('hidden');
    const correctCard = document.getElementById('r2-correct-card');
    const isCorrectCardVisible = isR2ModalOpen && correctCard && !correctCard.classList.contains('hidden');
    const isCountdownRunning = Boolean(this.r2EvalTimer);

    // If 5s countdown is actively running in Round 2, ignore evaluation triggers to prevent interruption
    if (isCountdownRunning) {
      if (key === 'escape') {
        this.closeR2WrongModal();
      }
      return;
    }

    // If Wrong Card is visible in Round 2:
    if (isWrongCardVisible) {
      if (['enter', 'escape', ' ', 'w'].includes(key)) {
        e.preventDefault();
        this.closeR2WrongModal();
        return;
      }
    }

    // If Correct Card is visible in Round 2:
    if (isCorrectCardVisible) {
      if (['enter', ' ', 'c', 'a'].includes(key)) {
        e.preventDefault();
        this.completeR2FromModal();
        return;
      }
    }

    // If Results Confirmation modal is open in Round 5:
    const confirmResultsModal = document.getElementById('confirm-results-modal');
    if (confirmResultsModal && !confirmResultsModal.classList.contains('hidden')) {
      if (key === 'enter') {
        e.preventDefault();
        this.startResultsCountdown();
        return;
      }
      if (key === 'escape') {
        this.closeConfirmResultsModal();
        return;
      }
    }

    switch (key) {
      case ' ': // Space bar
        e.preventDefault();
        if (this.currentView === 'general-q' || this.currentView === 'r4-clue') {
          if (!this.questionStarted) {
            this.startQuestionTimer();
          } else if (this.currentView === 'r4-clue' && this.currentR4ClueStep < 3) {
            this.revealNextClue();
          }
        }
        break;

      case 'w': // WRONG Answer in Round 2 (5s countdown -> "Sorry, Wrong Answer")
        if (this.currentRoundIdx === 1 && this.currentView === 'general-q') {
          e.preventDefault();
          this.handleR2Evaluation(false);
        }
        break;

      case 'c': // CORRECT Answer in Round 2 (5s countdown -> Answer Reveal)
        if (this.currentRoundIdx === 1 && this.currentView === 'general-q') {
          e.preventDefault();
          this.handleR2Evaluation(true);
        }
        break;

      case 'a': // SHOW ANSWER / CORRECT: In R2 triggers 5s countdown + answer reveal; in other rounds toggles Answer Modal!
        e.preventDefault();
        if (this.currentRoundIdx === 1 && this.currentView === 'general-q') {
          this.handleR2Evaluation(true);
        } else {
          const ansModal = document.getElementById('answer-modal');
          if (ansModal && !ansModal.classList.contains('hidden')) {
            this.closeAnswerModal();
          } else {
            this.revealAnswerModal();
          }
        }
        break;

      case 'k': // Toggle Discreet Official Answer Key in Round 2
        if (this.currentRoundIdx === 1) {
          this.toggleJudgeAnswerKey();
        }
        break;

      case 's': // Toggle Live Scoreboard
        this.toggleScoreboard();
        break;

      case 'p': // Pause/Resume Timer
        this.toggleTimerPause();
        break;

      case 'f': // Fullscreen
        this.toggleFullscreen();
        break;

      case 'j': // Judge drawer
        this.toggleJudgeDrawer();
        break;

      case 'arrowright': // Next
        this.navigateNext();
        break;

      case 'arrowleft': // Back
        this.navigateBack();
        break;

      case 'escape': // Close active modals
        this.closeAnswerModal();
        this.closeConfirmResultsModal();
        this.closeR2WrongModal();
        this.closeScoreboard();
        this.closeJudgeDrawer();
        break;
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  preloadAllAssets() {
    const assetUrls = [
      'quizlanding.png',
      'quizcover.png'
    ];

    this.data.rounds.forEach(r => {
      if (r.questions) {
        r.questions.forEach(q => {
          if (q.image) assetUrls.push(q.image);
          if (q.video) assetUrls.push(q.video);
          if (q.audio) assetUrls.push(q.audio);
        });
      }
      if (r.boxes) {
        r.boxes.forEach(b => {
          if (b.questions) {
            b.questions.forEach(q => {
              if (q.image) assetUrls.push(q.image);
            });
          }
          if (b.clues) {
            b.clues.forEach(cl => {
              if (cl.image) assetUrls.push(cl.image);
            });
          }
        });
      }
    });

    const uniqueUrls = [...new Set(assetUrls)];
    this.totalAssetsCount = uniqueUrls.length;

    const progressEl = document.getElementById('preload-progress-bar');
    const statusEl = document.getElementById('preload-status-text');

    const updateStatus = () => {
      this.loadedAssetsCount++;
      const pct = Math.min(100, Math.round((this.loadedAssetsCount / this.totalAssetsCount) * 100));
      if (progressEl) progressEl.style.width = `${pct}%`;
      if (statusEl) statusEl.innerText = `${this.loadedAssetsCount} / ${this.totalAssetsCount} Assets Cached (${pct}%)`;
    };

    uniqueUrls.forEach(url => {
      if (url.endsWith('.mp4')) {
        const v = document.createElement('video');
        v.preload = 'auto';
        v.src = url;
        v.onloadeddata = updateStatus;
        v.onerror = updateStatus;
      } else if (url.endsWith('.mp3')) {
        const a = new Audio();
        a.src = url;
        a.oncanplaythrough = updateStatus;
        a.onerror = updateStatus;
      } else {
        const img = new Image();
        img.src = url;
        img.onload = updateStatus;
        img.onerror = updateStatus;
      }
    });
  }

  // ==========================================
  // VIEW ROUTER & NAVIGATION
  // ==========================================

  showLanding() {
    this.currentView = 'landing';
    this.stopTimer();
    this.dom.stage.className = 'stage-landing';
    this.dom.header.classList.add('hidden');
    this.dom.timerContainer.classList.add('hidden');

    this.dom.viewContainer.innerHTML = `
      <div class="landing-view-content fade-in">
        <div class="landing-hero-backdrop"></div>
        <div class="landing-content-card">
          <div class="landing-fest-pill">CAMPUS ARTS FEST 2026 • NOVEMBER 21-22</div>
          <div class="landing-sub-pill">Wafy Campus Students' Union • Wafy Campus Kalikavu</div>
          <h1 class="landing-main-title">QUIZ COMPETITION</h1>
          <div class="landing-lead-tag">Led by : <span>Hafsal Faizy Anjilangadi</span></div>

          <div class="landing-actions">
            <button id="btn-start-quiz" class="btn-primary-glow btn-large">
              <span>🚀 START QUIZ COMPETITION</span>
            </button>
          </div>

          <div class="landing-rounds-quickbar">
            <span class="quickbar-label">QUICK JUMP TO ROUND:</span>
            <div class="quickbar-buttons">
              <button class="btn-quick-round" onclick="quizApp.goToRoundGap(0)">ROUND 1 (30s)</button>
              <button class="btn-quick-round" onclick="quizApp.goToRoundGap(1)">ROUND 2 (1m Spin)</button>
              <button class="btn-quick-round" onclick="quizApp.goToRoundGap(2)">ROUND 3 (40s)</button>
              <button class="btn-quick-round" onclick="quizApp.goToRoundGap(3)">ROUND 4 (1m Clue)</button>
              <button class="btn-quick-round" onclick="quizApp.goToRoundGap(4)">ROUND 5 (40s Finale)</button>
            </div>
          </div>

          <div class="preload-dock">
            <div class="preload-meta">
              <span id="preload-status-text">Preloading Local Presentation Assets...</span>
              <span class="preload-offline-badge">⚡ 100% Offline Ready</span>
            </div>
            <div class="preload-bar-track">
              <div id="preload-progress-bar" class="preload-bar-fill" style="width: 100%;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-start-quiz').addEventListener('click', () => {
      window.audioMgr.playClick();
      this.goToRoundGap(0);
    });
  }

  goToRoundGap(roundIdx) {
    this.currentRoundIdx = roundIdx;
    this.currentQuestionIdx = 0;
    this.currentR2Question = null;
    this.currentView = 'gap';
    this.stopTimer();

    this.dom.stage.className = 'stage-cover';
    this.dom.header.classList.remove('hidden');
    this.dom.timerContainer.classList.add('hidden');

    const round = this.data.rounds[this.currentRoundIdx];
    this.dom.roundBadge.innerText = round.title.toUpperCase();
    this.dom.qBadge.innerText = 'ROUND OVERVIEW';

    this.dom.viewContainer.innerHTML = `
      <div class="gap-page-container fade-in">
        <div class="gap-card">
          <div class="gap-round-number">${round.title.toUpperCase()}</div>
          <h2 class="gap-round-title">${round.subtitle}</h2>
          <p class="gap-round-desc">${round.description}</p>

          <div class="gap-rules-box">
            <div class="rules-header">🎯 ROUND RULES & TIME SPECIFICATIONS</div>
            <ul class="rules-list">
              ${round.rules.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>

          <div class="gap-actions">
            <button class="btn-secondary" onclick="quizApp.showLanding()">
              ⬅ BACK TO HOME
            </button>
            <button id="btn-enter-round" class="btn-primary-glow btn-large">
              <span>ENTER ${round.title.toUpperCase()} ➡</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-enter-round').addEventListener('click', () => {
      window.audioMgr.playClick();
      this.startCurrentRound();
    });
  }

  startCurrentRound() {
    const round = this.data.rounds[this.currentRoundIdx];
    if (round.type === 'general') {
      this.currentQuestionIdx = 0;
      this.showGeneralQuestion();
    } else if (round.id === 2) {
      this.showRound2Boxes();
    } else if (round.id === 4) {
      this.showRound4Boxes();
    }
  }

  // ==========================================
  // GENERAL QUESTION VIEW (R1 = 30s, R3 = 40s, R5 = 40s)
  // ==========================================

  showGeneralQuestion() {
    this.currentView = 'general-q';
    this.currentR2Question = null;
    this.questionStarted = false;
    this.stopTimer();

    const round = this.data.rounds[this.currentRoundIdx];
    const q = round.questions[this.currentQuestionIdx];
    const dur = round.durationSeconds || 60;
    this.currentDuration = dur;

    this.dom.stage.className = 'stage-cover';
    this.dom.header.classList.remove('hidden');
    this.dom.timerContainer.classList.remove('hidden');
    this.resetTimerDisplay(dur);

    this.dom.roundBadge.innerText = round.title.toUpperCase();
    this.dom.qBadge.innerText = `QUESTION ${this.currentQuestionIdx + 1} OF ${round.totalQuestions}`;

    const hasMedia = q.video || q.image || q.audio;

    // Check if this is the final question of the entire quiz
    const isFinalQuizQuestion = (this.currentRoundIdx === this.data.rounds.length - 1) && 
                                (this.currentQuestionIdx === round.questions.length - 1);

    this.dom.viewContainer.innerHTML = `
      <div class="question-stage-layout fade-in">
        <!-- Ready / Start Timer Overlay -->
        <div id="ready-gate-overlay" class="ready-gate-card">
          <div class="ready-badge">${round.title.toUpperCase()} • QUESTION ${this.currentQuestionIdx + 1}</div>
          <h3 class="ready-prompt-title">Ready for the Question?</h3>
          <p class="ready-prompt-sub">Timer will begin counting down (${dur} seconds) immediately when revealed.</p>
          <button id="btn-start-timer-reveal" class="btn-primary-glow btn-huge">
            <span>⏱ START TIMER & REVEAL QUESTION</span>
          </button>
        </div>

        <!-- Question Body -->
        <div id="question-content-box" class="question-content-box question-blurred">
          <div class="question-header-row">
            <span class="q-number-pill">Q ${this.currentQuestionIdx + 1}</span>
            <span class="q-points-pill">${dur} SECONDS</span>
          </div>

          <div class="question-text-container">
            <h2 class="question-text-display">${q.text}</h2>
          </div>

          <!-- Media Zone -->
          ${hasMedia ? `
            <div class="media-display-zone">
              ${q.video ? `
                <div class="video-wrapper">
                  <video id="q-video-player" class="stage-video" controls preload="auto">
                    <source src="${q.video}" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                  <div class="media-note">▶ Click play on the video when ready to watch</div>
                </div>
              ` : ''}

              ${q.image ? `
                <div class="image-wrapper">
                  <img src="${q.image}" alt="Question Image" class="stage-image" onclick="quizApp.zoomImage(this.src)">
                  <div class="media-zoom-hint">🔍 Click image to enlarge</div>
                </div>
              ` : ''}

              ${q.audio ? `
                <div class="audio-wrapper">
                  <div class="audio-player-card">
                    <button id="btn-audio-play" class="btn-audio-control" onclick="quizApp.toggleAudio('${q.audio}')">
                      <span id="audio-btn-icon">▶</span>
                      <span id="audio-btn-label">PLAY AUDIO CLUE</span>
                    </button>
                    <audio id="q-audio-player" src="${q.audio}" preload="auto"></audio>
                    <div class="audio-waveform-bars">
                      <span></span><span></span><span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Bottom Judge & Navigation Bar -->
        <div class="bottom-action-bar">
          <div class="nav-button-group">
            <button class="btn-control" onclick="quizApp.prevGeneralQuestion()">⬅ PREVIOUS</button>
            ${isFinalQuizQuestion ? `
              <button class="btn-primary-glow" onclick="quizApp.promptShowResults()">
                <span>🏆 SHOW THE RESULT</span>
              </button>
            ` : `
              <button class="btn-control" onclick="quizApp.nextGeneralQuestion()">NEXT QUESTION ➡</button>
            `}
          </div>

          <div class="judge-quick-group">
            <button class="btn-eval btn-answer-key btn-primary-glow" onclick="quizApp.revealAnswerModal()">
              👁 SHOW ANSWER
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-start-timer-reveal').addEventListener('click', () => {
      this.startQuestionTimer();
    });
  }

  startQuestionTimer() {
    if (this.questionStarted) return;
    this.questionStarted = true;
    window.audioMgr.playClick();

    const gate = document.getElementById('ready-gate-overlay');
    if (gate) gate.classList.add('gate-hidden');

    const contentBox = document.getElementById('question-content-box');
    if (contentBox) contentBox.classList.remove('question-blurred');

    const round = this.data.rounds[this.currentRoundIdx];
    const dur = round.durationSeconds || 60;
    this.currentDuration = dur;
    this.startTimer(dur);
  }

  prevGeneralQuestion() {
    window.audioMgr.playClick();
    if (this.currentQuestionIdx > 0) {
      this.currentQuestionIdx--;
      this.showGeneralQuestion();
    } else {
      this.goToRoundGap(this.currentRoundIdx);
    }
  }

  nextGeneralQuestion() {
    window.audioMgr.playClick();
    const round = this.data.rounds[this.currentRoundIdx];
    if (this.currentQuestionIdx < round.questions.length - 1) {
      this.currentQuestionIdx++;
      this.showGeneralQuestion();
    } else {
      if (this.currentRoundIdx < this.data.rounds.length - 1) {
        this.goToRoundGap(this.currentRoundIdx + 1);
      } else {
        this.promptShowResults();
      }
    }
  }

  // ==========================================
  // ROUND 2: HIGHLIGHT BOX SPIN ROUND (1 Minute, Options H & A)
  // ==========================================

  showRound2Boxes() {
    this.currentView = 'r2-boxes';
    this.currentRoundIdx = 1;
    this.currentR2Question = null;
    this.stopTimer();

    this.dom.stage.className = 'stage-cover';
    this.dom.header.classList.remove('hidden');
    this.dom.timerContainer.classList.add('hidden');

    this.dom.roundBadge.innerText = 'ROUND 2';
    this.dom.qBadge.innerText = 'BOX SELECTION';

    const round = this.data.rounds[1];
    const remainingCount = round.boxes.length - this.r2UsedBoxes.size;

    this.dom.viewContainer.innerHTML = `
      <div class="box-stage-card fade-in">
        <div class="box-selection-header">
          <div class="box-round-title">ROUND 2: THE HIGHLIGHT BOX SELECTION</div>
          <p class="box-selection-subtitle">
            ${remainingCount > 1 
              ? 'Click SPIN to rapidly cycle for 4 seconds and randomly select a box, or click an available box.' 
              : 'FINAL REMAINING BOX! Click on it to choose Option H or A.'}
          </p>
        </div>

        <div class="boxes-grid" id="r2-boxes-grid">
          ${round.boxes.map(b => {
            const isUsed = this.r2UsedBoxes.has(b.boxNum);
            return `
              <div 
                id="r2-box-${b.boxNum}" 
                class="quiz-box-card ${isUsed ? 'box-hidden' : ''}"
                onclick="quizApp.onBoxClick(${b.boxNum})"
              >
                <div class="box-inner-glow"></div>
                <div class="box-folder-tab">FOLDER ${b.boxNum}</div>
                <div class="box-front">
                  <div class="box-icon">📦</div>
                  <div class="box-number">BOX ${b.boxNum}</div>
                  <div class="box-meta">Options H & A Inside</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="box-selection-actions">
          <button class="btn-secondary" onclick="quizApp.goToRoundGap(1)">
            ⬅ ROUND OVERVIEW
          </button>

          <button 
            id="btn-spin-r2" 
            class="btn-primary-glow btn-spin ${this.isSpinning || remainingCount === 0 ? 'disabled' : ''}"
            onclick="quizApp.spinRound2Boxes()"
          >
            <span>🎰 SPIN / RANDOM SELECT</span>
          </button>

          <button class="btn-control" onclick="quizApp.resetR2Boxes()">
            🔄 RESET BOXES
          </button>
        </div>
      </div>
    `;
  }

  spinRound2Boxes() {
    if (this.isSpinning) return;
    const round = this.data.rounds[1];
    const available = round.boxes.filter(b => !this.r2UsedBoxes.has(b.boxNum));

    if (available.length === 0) {
      alert("All boxes have been selected for Round 2!");
      return;
    }

    if (available.length === 1) {
      this.selectRound2Box(available[0].boxNum);
      return;
    }

    this.isSpinning = true;
    const spinBtn = document.getElementById('btn-spin-r2');
    if (spinBtn) spinBtn.classList.add('disabled');

    const winner = available[Math.floor(Math.random() * available.length)];
    const duration = 4000;
    const startTime = Date.now();
    let tickSpeed = 70;
    let currentIdx = 0;

    const cycle = () => {
      const elapsed = Date.now() - startTime;

      available.forEach(b => {
        const el = document.getElementById(`r2-box-${b.boxNum}`);
        if (el) el.classList.remove('box-highlighted');
      });

      const activeBox = available[currentIdx % available.length];
      const el = document.getElementById(`r2-box-${activeBox.boxNum}`);
      if (el) el.classList.add('box-highlighted');
      window.audioMgr.playSpinTick();

      currentIdx++;

      if (elapsed < duration) {
        if (elapsed > duration - 1200) {
          tickSpeed += 14;
        }
        setTimeout(cycle, tickSpeed);
      } else {
        available.forEach(b => {
          const el = document.getElementById(`r2-box-${b.boxNum}`);
          if (el) el.classList.remove('box-highlighted');
        });

        const winEl = document.getElementById(`r2-box-${winner.boxNum}`);
        if (winEl) {
          winEl.classList.add('box-selected-win');
        }
        window.audioMgr.playSpinLock();

        setTimeout(() => {
          this.isSpinning = false;
          this.selectRound2Box(winner.boxNum);
        }, 1200);
      }
    };

    cycle();
  }

  onBoxClick(boxNum) {
    if (this.isSpinning || this.r2UsedBoxes.has(boxNum)) return;
    this.selectRound2Box(boxNum);
  }

  selectRound2Box(boxNum) {
    this.currentBoxNum = boxNum;
    this.currentView = 'r2-choice';
    this.currentRoundIdx = 1;
    window.audioMgr.playClick();

    this.dom.stage.className = 'stage-cover';
    this.dom.header.classList.remove('hidden');
    this.dom.timerContainer.classList.add('hidden');

    this.dom.roundBadge.innerText = 'ROUND 2';
    this.dom.qBadge.innerText = `BOX ${boxNum} SELECTION`;

    // Options H and A instead of Q-1 and Q-2!
    this.dom.viewContainer.innerHTML = `
      <div class="box-stage-card fade-in">
        <div class="box-choice-header">
          <div class="choice-badge">BOX ${boxNum} UNLOCKED</div>
          <h2 class="choice-title">Choose Your Question</h2>
          <p class="choice-sub">The team must select either <strong>H</strong> or <strong>A</strong> to reveal.</p>
        </div>

        <div class="choice-cards-container">
          <div class="choice-card" onclick="quizApp.revealR2Question(1)">
            <div class="choice-card-tag">OPTION 1</div>
            <div class="choice-card-letter">H</div>
            <div class="choice-card-btn">SELECT H ➡</div>
          </div>

          <div class="choice-card" onclick="quizApp.revealR2Question(2)">
            <div class="choice-card-tag">OPTION 2</div>
            <div class="choice-card-letter">A</div>
            <div class="choice-card-btn">SELECT A ➡</div>
          </div>
        </div>

        <div class="box-choice-actions">
          <button class="btn-secondary" onclick="quizApp.showRound2Boxes()">
            ⬅ BACK TO BOXES
          </button>
        </div>
      </div>
    `;
  }

  revealR2Question(choiceNum) {
    window.audioMgr.playClick();
    this.currentRoundIdx = 1;
    const round = this.data.rounds[1];
    const box = round.boxes.find(b => b.boxNum === this.currentBoxNum);
    const q = box.questions[choiceNum - 1];
    this.currentR2Question = q;

    this.currentView = 'general-q';
    this.questionStarted = false;
    this.stopTimer();

    const dur = 60; // 1 minute
    this.currentDuration = dur;

    this.dom.stage.className = 'stage-cover';
    this.dom.header.classList.remove('hidden');
    this.dom.timerContainer.classList.remove('hidden');
    this.resetTimerDisplay(dur);

    this.dom.roundBadge.innerText = 'ROUND 2';
    this.dom.qBadge.innerText = `BOX ${this.currentBoxNum} • OPTION ${q.choice} (${q.qCode})`;

    this.dom.viewContainer.innerHTML = `
      <div class="question-stage-layout fade-in">
        <!-- Ready / Start Timer Overlay -->
        <div id="ready-gate-overlay" class="ready-gate-card">
          <div class="ready-badge">ROUND 2 • BOX ${this.currentBoxNum} • OPTION ${q.choice}</div>
          <h3 class="ready-prompt-title">Ready for Option ${q.choice}?</h3>
          <p class="ready-prompt-sub">Timer will begin counting down (1 minute) immediately upon reveal.</p>
          <button id="btn-start-timer-reveal" class="btn-primary-glow btn-huge">
            <span>⏱ START TIMER & REVEAL QUESTION</span>
          </button>
        </div>

        <!-- Question Body -->
        <div id="question-content-box" class="question-content-box question-blurred">
          <div class="question-header-row">
            <span class="q-number-pill">BOX ${this.currentBoxNum} - OPTION ${q.choice}</span>
            <span class="q-points-pill">1 MINUTE (60 SEC)</span>
          </div>

          <div class="question-text-container">
            <h2 class="question-text-display">${q.text}</h2>
          </div>

          ${q.image ? `
            <div class="media-display-zone">
              <div class="image-wrapper">
                <img src="${q.image}" alt="Question Image" class="stage-image" onclick="quizApp.zoomImage(this.src)">
                <div class="media-zoom-hint">🔍 Click image to enlarge</div>
              </div>
            </div>
          ` : ''}

          <!-- Answer Key Reveal (Discreet Judge Reference) -->
          <div id="answer-key-box" class="answer-key-box hidden">
            <div class="answer-label">OFFICIAL ANSWER REFERENCE:</div>
            <div class="answer-value">${q.answer}</div>
            ${q.hint ? `<div class="answer-hint">ℹ ${q.hint}</div>` : ''}
          </div>
        </div>

        <!-- Bottom Judge Action Bar: WRONG & CORRECT Buttons (5s Countdown) -->
        <div class="bottom-action-bar">
          <div class="nav-button-group">
            <button class="btn-control btn-return-boxes" onclick="quizApp.returnFromR2Question()">
              📦 RETURN TO BOX SELECTION
            </button>
          </div>

          <div class="judge-quick-group">
            <button class="btn-eval btn-wrong" onclick="quizApp.handleR2Evaluation(false)" title="Shortcut: Press W">
              ✖ WRONG <span class="key-badge">W</span>
            </button>
            <button class="btn-eval btn-correct" onclick="quizApp.handleR2Evaluation(true)" title="Shortcut: Press A or C">
              ✔ CORRECT <span class="key-badge">A / C</span>
            </button>
            <button class="btn-eval btn-answer-key" onclick="quizApp.toggleJudgeAnswerKey()" title="Shortcut: Press K">
              👁 ANSWER KEY <span class="key-badge">K</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-start-timer-reveal').addEventListener('click', () => {
      this.startQuestionTimer();
    });
  }

  /**
   * Round 2 Evaluation with 5-Second Countdown
   * If Wrong: 5..4..3..2..1 -> "Sorry, Wrong Answer", stays on same question to pass to next team!
   * If Correct: 5..4..3..2..1 -> "Correct Answer!" + reveals answer + button to return to boxes!
   */
  handleR2Evaluation(isCorrect) {
    if (this.r2EvalTimer) return; // Prevent duplicate rapid triggers

    window.audioMgr.playClick();
    if (this.timerRunning) {
      this.stopTimer();
    }

    const q = this.currentR2Question;
    if (!q) return;

    if (this.r2EvalTimer) {
      clearInterval(this.r2EvalTimer);
      this.r2EvalTimer = null;
    }

    const modal = document.getElementById('r2-eval-modal');
    const countdownView = document.getElementById('r2-eval-countdown-view');
    const countNum = document.getElementById('r2-countdown-number');
    const wrongCard = document.getElementById('r2-wrong-card');
    const correctCard = document.getElementById('r2-correct-card');
    const badge = document.getElementById('r2-eval-badge');

    if (modal) modal.classList.remove('hidden');
    if (countdownView) countdownView.classList.remove('hidden');
    if (wrongCard) wrongCard.classList.add('hidden');
    if (correctCard) correctCard.classList.add('hidden');

    if (badge) {
      badge.innerText = isCorrect 
        ? `ROUND 2 • OPTION ${q.choice} • VERIFYING ANSWER...`
        : `ROUND 2 • OPTION ${q.choice} • VERIFYING ANSWER...`;
    }

    let count = 5;
    if (countNum) countNum.innerText = count;
    window.audioMgr.playSuspenseTick(count);

    this.r2EvalTimer = setInterval(() => {
      count--;
      if (count > 0) {
        if (countNum) {
          countNum.innerText = count;
          countNum.style.animation = 'none';
          void countNum.offsetWidth;
          countNum.style.animation = 'countdownPulse 0.95s ease-out infinite';
        }
        window.audioMgr.playSuspenseTick(count);
      } else {
        clearInterval(this.r2EvalTimer);
        this.r2EvalTimer = null;

        if (countdownView) countdownView.classList.add('hidden');

        if (!isCorrect) {
          window.audioMgr.playWrong("Sorry, Wrong Answer");
          if (wrongCard) wrongCard.classList.remove('hidden');
        } else {
          window.audioMgr.playCorrect("Your answer is correct, Keep Going");
          window.confetti.fire(3500);

          const valEl = document.getElementById('r2-correct-answer-val');
          const hintEl = document.getElementById('r2-correct-answer-hint');
          if (valEl) valEl.innerText = q.answer;
          if (hintEl) hintEl.innerText = q.hint ? `ℹ ${q.hint}` : '';

          if (correctCard) correctCard.classList.remove('hidden');
        }
      }
    }, 1000);
  }

  closeR2WrongModal() {
    window.audioMgr.playClick();
    if (this.r2EvalTimer) {
      clearInterval(this.r2EvalTimer);
      this.r2EvalTimer = null;
    }
    const modal = document.getElementById('r2-eval-modal');
    if (modal) modal.classList.add('hidden');
    // Stays right on the same question so the judge can pass it to the next team!
  }

  completeR2FromModal() {
    window.audioMgr.playClick();
    if (this.r2EvalTimer) {
      clearInterval(this.r2EvalTimer);
      this.r2EvalTimer = null;
    }
    const modal = document.getElementById('r2-eval-modal');
    if (modal) modal.classList.add('hidden');
    this.returnFromR2Question();
  }

  returnFromR2Question() {
    window.audioMgr.playClick();
    if (this.currentBoxNum) {
      this.r2UsedBoxes.add(this.currentBoxNum);
    }
    this.showRound2Boxes();
  }

  resetR2Boxes() {
    if (confirm("Reset all boxes for Round 2?")) {
      this.r2UsedBoxes.clear();
      this.showRound2Boxes();
    }
  }

  toggleJudgeAnswerKey() {
    const box = document.getElementById('answer-key-box');
    if (box) {
      box.classList.toggle('hidden');
      window.audioMgr.playClick();
    }
  }

  // ==========================================
  // ROUND 4: CLUE ROUND (1 Minute with Spin)
  // ==========================================

  showRound4Boxes() {
    this.currentView = 'r4-boxes';
    this.currentRoundIdx = 3;
    this.stopTimer();

    this.dom.stage.className = 'stage-cover';
    this.dom.header.classList.remove('hidden');
    this.dom.timerContainer.classList.add('hidden');

    this.dom.roundBadge.innerText = 'ROUND 4';
    this.dom.qBadge.innerText = 'CLUE ROUND BOXES';

    const round = this.data.rounds[3];
    const remainingCount = round.boxes.length - this.r4UsedBoxes.size;

    this.dom.viewContainer.innerHTML = `
      <div class="box-stage-card fade-in">
        <div class="box-selection-header">
          <div class="box-round-title">ROUND 4: THE CLUE ROUND</div>
          <p class="box-selection-subtitle">
            ${remainingCount > 1 
              ? 'Click SPIN to rapidly cycle for 4 seconds and randomly select a clue box, or click an available box.' 
              : 'FINAL REMAINING CLUE BOX! Click on it to view clues.'}
          </p>
        </div>

        <div class="boxes-grid" id="r4-boxes-grid">
          ${round.boxes.map(b => {
            const isUsed = this.r4UsedBoxes.has(b.boxNum);
            return `
              <div 
                id="r4-box-${b.boxNum}" 
                class="quiz-box-card ${isUsed ? 'box-hidden' : ''}"
                onclick="quizApp.onRound4BoxClick(${b.boxNum})"
              >
                <div class="box-inner-glow"></div>
                <div class="box-folder-tab">CLUE BOX ${b.boxNum}</div>
                <div class="box-front">
                  <div class="box-icon">💡</div>
                  <div class="box-number">BOX ${b.boxNum}</div>
                  <div class="box-meta">3 Clues Inside</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="box-selection-actions">
          <button class="btn-secondary" onclick="quizApp.goToRoundGap(3)">
            ⬅ ROUND OVERVIEW
          </button>

          <button 
            id="btn-spin-r4" 
            class="btn-primary-glow btn-spin ${this.isSpinning || remainingCount === 0 ? 'disabled' : ''}"
            onclick="quizApp.spinRound4Boxes()"
          >
            <span>🎰 SPIN / RANDOM SELECT</span>
          </button>

          <button class="btn-control" onclick="quizApp.resetR4Boxes()">
            🔄 RESET CLUE BOXES
          </button>
        </div>
      </div>
    `;
  }

  spinRound4Boxes() {
    if (this.isSpinning) return;
    const round = this.data.rounds[3];
    const available = round.boxes.filter(b => !this.r4UsedBoxes.has(b.boxNum));

    if (available.length === 0) {
      alert("All clue boxes have been selected for Round 4!");
      return;
    }

    if (available.length === 1) {
      this.selectRound4Box(available[0].boxNum);
      return;
    }

    this.isSpinning = true;
    const spinBtn = document.getElementById('btn-spin-r4');
    if (spinBtn) spinBtn.classList.add('disabled');

    const winner = available[Math.floor(Math.random() * available.length)];
    const duration = 4000;
    const startTime = Date.now();
    let tickSpeed = 70;
    let currentIdx = 0;

    const cycle = () => {
      const elapsed = Date.now() - startTime;

      available.forEach(b => {
        const el = document.getElementById(`r4-box-${b.boxNum}`);
        if (el) el.classList.remove('box-highlighted');
      });

      const activeBox = available[currentIdx % available.length];
      const el = document.getElementById(`r4-box-${activeBox.boxNum}`);
      if (el) el.classList.add('box-highlighted');
      window.audioMgr.playSpinTick();

      currentIdx++;

      if (elapsed < duration) {
        if (elapsed > duration - 1200) {
          tickSpeed += 14;
        }
        setTimeout(cycle, tickSpeed);
      } else {
        available.forEach(b => {
          const el = document.getElementById(`r4-box-${b.boxNum}`);
          if (el) el.classList.remove('box-highlighted');
        });

        const winEl = document.getElementById(`r4-box-${winner.boxNum}`);
        if (winEl) {
          winEl.classList.add('box-selected-win');
        }
        window.audioMgr.playSpinLock();

        setTimeout(() => {
          this.isSpinning = false;
          this.selectRound4Box(winner.boxNum);
        }, 1200);
      }
    };

    cycle();
  }

  onRound4BoxClick(boxNum) {
    if (this.isSpinning || this.r4UsedBoxes.has(boxNum)) return;
    this.selectRound4Box(boxNum);
  }

  selectRound4Box(boxNum) {
    if (this.r4UsedBoxes.has(boxNum)) return;
    this.currentBoxNum = boxNum;
    this.currentRoundIdx = 3;
    this.currentR4ClueStep = 1;
    this.currentView = 'r4-clue';
    this.questionStarted = false;
    this.stopTimer();

    window.audioMgr.playClick();
    const round = this.data.rounds[3];
    const box = round.boxes.find(b => b.boxNum === boxNum);

    const dur = 60;
    this.currentDuration = dur;

    this.dom.stage.className = 'stage-cover';
    this.dom.header.classList.remove('hidden');
    this.dom.timerContainer.classList.remove('hidden');
    this.resetTimerDisplay(dur);

    this.dom.roundBadge.innerText = 'ROUND 4';
    this.dom.qBadge.innerText = `CLUE BOX ${boxNum} • ${box.qCode}`;

    this.renderClueQuestion(box);
  }

  renderClueQuestion(box) {
    const clue1 = box.clues[0];
    const clue2 = box.clues[1];
    const clue3 = box.clues[2];

    this.dom.viewContainer.innerHTML = `
      <div class="question-stage-layout clue-stage-layout fade-in">
        <!-- Ready / Start Timer Overlay -->
        <div id="ready-gate-overlay" class="ready-gate-card">
          <div class="ready-badge">ROUND 4 • CLUE BOX ${this.currentBoxNum}</div>
          <h3 class="ready-prompt-title">Ready for Clue 1?</h3>
          <p class="ready-prompt-sub">Timer will begin 1-minute (60 seconds) countdown for the whole question.</p>
          <button id="btn-start-timer-reveal" class="btn-primary-glow btn-huge">
            <span>⏱ START TIMER & REVEAL CLUE 1</span>
          </button>
        </div>

        <!-- Clue Question Content -->
        <div id="question-content-box" class="question-content-box question-blurred">
          <div class="question-header-row">
            <span class="q-number-pill">CLUE BOX ${this.currentBoxNum} (${box.qCode})</span>
            <span class="q-points-pill">1 MINUTE TOTAL</span>
          </div>

          <!-- Progressive Clues List -->
          <div class="clues-stack">
            <!-- CLUE 1 -->
            <div id="clue-card-1" class="clue-item-card clue-active">
              <div class="clue-badge-row">
                <span class="clue-step-badge">CLUE 1</span>
                <span class="clue-status-text">REVEALED AT START</span>
              </div>
              <div class="clue-text malayalam-text">${clue1.text}</div>
              ${clue1.image ? `
                <div class="clue-media-box">
                  <img src="${clue1.image}" alt="Clue 1 Image" class="stage-image-clue" onclick="quizApp.zoomImage(this.src)">
                </div>
              ` : ''}
            </div>

            <!-- CLUE 2 -->
            <div id="clue-card-2" class="clue-item-card ${this.currentR4ClueStep >= 2 ? 'clue-active' : 'clue-locked'}">
              <div class="clue-badge-row">
                <span class="clue-step-badge">CLUE 2</span>
                <span class="clue-status-text">${this.currentR4ClueStep >= 2 ? 'REVEALED' : 'LOCKED'}</span>
              </div>
              ${this.currentR4ClueStep >= 2 ? `
                <div class="clue-text malayalam-text">${clue2.text}</div>
                ${clue2.image ? `
                  <div class="clue-media-box">
                    <img src="${clue2.image}" alt="Clue 2 Image" class="stage-image-clue" onclick="quizApp.zoomImage(this.src)">
                  </div>
                ` : ''}
              ` : `
                <div class="clue-placeholder">
                  <span>🔒 Clue 2 is locked. Click 'REVEAL CLUE 2' when requested by the team.</span>
                </div>
              `}
            </div>

            <!-- CLUE 3 -->
            <div id="clue-card-3" class="clue-item-card ${this.currentR4ClueStep >= 3 ? 'clue-active' : 'clue-locked'}">
              <div class="clue-badge-row">
                <span class="clue-step-badge">CLUE 3</span>
                <span class="clue-status-text">${this.currentR4ClueStep >= 3 ? 'REVEALED' : 'LOCKED'}</span>
              </div>
              ${this.currentR4ClueStep >= 3 ? `
                <div class="clue-text malayalam-text">${clue3.text}</div>
                ${clue3.image ? `
                  <div class="clue-media-box">
                    <img src="${clue3.image}" alt="Clue 3 Image" class="stage-image-clue" onclick="quizApp.zoomImage(this.src)">
                  </div>
                ` : ''}
              ` : `
                <div class="clue-placeholder">
                  <span>🔒 Clue 3 is locked. Click 'REVEAL CLUE 3' when requested by the team.</span>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Bottom Judge & Next Clue Bar -->
        <div class="bottom-action-bar">
          <div class="nav-button-group">
            <button class="btn-control btn-return-boxes" onclick="quizApp.returnFromR4Question()">
              📦 COMPLETE & RETURN TO BOXES
            </button>
            
            ${this.currentR4ClueStep < 3 ? `
              <button id="btn-next-clue" class="btn-primary-glow" onclick="quizApp.revealNextClue()">
                <span>🔓 REVEAL CLUE ${this.currentR4ClueStep + 1} ➡</span>
              </button>
            ` : `
              <button class="btn-control disabled" disabled>ALL 3 CLUES REVEALED</button>
            `}
          </div>

          <div class="judge-quick-group">
            <button class="btn-eval btn-answer-key btn-primary-glow" onclick="quizApp.revealAnswerModal()">
              👁 SHOW ANSWER
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-start-timer-reveal').addEventListener('click', () => {
      this.startQuestionTimer();
    });
  }

  revealNextClue() {
    if (this.currentR4ClueStep >= 3) return;
    this.currentR4ClueStep++;
    window.audioMgr.playClick();
    const round = this.data.rounds[3];
    const box = round.boxes.find(b => b.boxNum === this.currentBoxNum);
    this.renderClueQuestion(box);

    const gate = document.getElementById('ready-gate-overlay');
    if (gate) gate.classList.add('gate-hidden');
    const contentBox = document.getElementById('question-content-box');
    if (contentBox) contentBox.classList.remove('question-blurred');
  }

  returnFromR4Question() {
    window.audioMgr.playClick();
    if (this.currentBoxNum) {
      this.r4UsedBoxes.add(this.currentBoxNum);
    }
    this.showRound4Boxes();
  }

  resetR4Boxes() {
    if (confirm("Reset all clue boxes for Round 4?")) {
      this.r4UsedBoxes.clear();
      this.showRound4Boxes();
    }
  }

  // ==========================================
  // DIRECT ANSWER REVEAL MODAL (R1, R3, R4, R5)
  // ==========================================

  revealAnswerModal() {
    window.audioMgr.playClick();
    let qObj = null;
    let roundTitle = "";
    const round = this.data.rounds[this.currentRoundIdx];

    if (this.currentRoundIdx === 3) { // Round 4
      const box = round.boxes.find(b => b.boxNum === this.currentBoxNum);
      qObj = box;
      roundTitle = `ROUND 4 • CLUE BOX ${this.currentBoxNum} (${box ? box.qCode : ''})`;
    } else { // Round 1, 3, 5
      qObj = round.questions[this.currentQuestionIdx];
      roundTitle = `${round.title.toUpperCase()} • QUESTION ${this.currentQuestionIdx + 1}`;
    }

    if (!qObj) return;

    const answerText = qObj.answer;
    const hintText = qObj.hint || "";
    const qText = qObj.text || (qObj.clues ? qObj.clues[0].text : "");

    if (this.timerRunning) {
      this.stopTimer();
    }

    this.showDirectAnswerModal(roundTitle, qText, answerText, hintText);
  }

  showDirectAnswerModal(roundTitle, qText, answerText, hintText) {
    this.dom.answerModal.classList.remove('hidden');
    this.dom.answerRevealCard.classList.remove('hidden');

    this.dom.answerModalBadge.innerText = roundTitle;
    this.dom.answerModalQText.innerText = qText;
    this.dom.answerModalValue.innerText = answerText;
    this.dom.answerModalHint.innerText = hintText ? `ℹ ${hintText}` : '';

    window.audioMgr.playAnswerReveal();
  }

  closeAnswerModal() {
    if (this.dom.answerModal) {
      this.dom.answerModal.classList.add('hidden');
    }
  }

  // ==========================================
  // CONFIRM RESULTS & COUNTDOWN MODAL
  // ==========================================

  promptShowResults() {
    window.audioMgr.playClick();
    if (this.timerRunning) {
      this.stopTimer();
    }
    const modal = document.getElementById('confirm-results-modal');
    if (modal) modal.classList.remove('hidden');
  }

  closeConfirmResultsModal() {
    window.audioMgr.playClick();
    const modal = document.getElementById('confirm-results-modal');
    if (modal) modal.classList.add('hidden');
  }

  startResultsCountdown() {
    window.audioMgr.playClick();
    this.closeConfirmResultsModal();

    const overlay = document.getElementById('results-countdown-overlay');
    const countNum = document.getElementById('results-countdown-number');
    if (overlay) overlay.classList.remove('hidden');

    let count = 3;
    if (countNum) countNum.innerText = count;
    window.audioMgr.playSuspenseTick(count);

    if (this.resultsCountdownTimer) {
      clearInterval(this.resultsCountdownTimer);
      this.resultsCountdownTimer = null;
    }

    this.resultsCountdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        if (countNum) {
          countNum.innerText = count;
          countNum.style.animation = 'none';
          void countNum.offsetWidth;
          countNum.style.animation = 'countdownPulse 0.95s ease-out infinite';
        }
        window.audioMgr.playSuspenseTick(count);
      } else {
        clearInterval(this.resultsCountdownTimer);
        this.resultsCountdownTimer = null;
        if (overlay) overlay.classList.add('hidden');
        this.showFinishScreen();
      }
    }, 1000);
  }

  // ==========================================
  // FINISH / OLYMPIC PODIUM RESULTS SCREEN
  // ==========================================

  showFinishScreen() {
    this.currentView = 'finish';
    this.stopTimer();

    this.dom.stage.className = 'stage-landing';
    this.dom.header.classList.add('hidden');
    this.dom.timerContainer.classList.add('hidden');

    // Sort teams by points descending
    const sortedTeams = [...this.teams].sort((a, b) => b.score - a.score);
    const firstPlace = sortedTeams[0] || { name: "Team A", score: 0 };
    const secondPlace = sortedTeams[1] || { name: "Team B", score: 0 };
    const thirdPlace = sortedTeams[2] || { name: "Team C", score: 0 };
    const remainingTeams = sortedTeams.slice(3);

    this.dom.viewContainer.innerHTML = `
      <div class="finish-view-content fade-in">
        <div class="finish-hero-backdrop"></div>
        <div class="finish-card finish-card-podium">
          <div class="finish-badge">CAMPUS ARTS FEST 2026 • GRAND FINALE</div>
          <h1 class="finish-title">QUIZ COMPETITION WINNERS!</h1>
          <p class="finish-subtitle">Official Final Leaderboard & Champion Podium</p>

          <!-- 3-TIER OLYMPIC PODIUM -->
          <div class="podium-stage-container">
            <!-- 2ND PLACE (LEFT - SILVER) -->
            <div class="podium-column podium-column-second">
              <div class="podium-avatar-wrapper">
                <span class="podium-badge-icon">🥈</span>
                <span class="podium-team-name">${secondPlace.name}</span>
                <span class="podium-team-score">${secondPlace.score} PTS</span>
              </div>
              <div class="podium-pedestal">
                <span class="podium-pedestal-num">2</span>
              </div>
            </div>

            <!-- 1ST PLACE (CENTER TOP - GOLD) -->
            <div class="podium-column podium-column-first">
              <div class="podium-avatar-wrapper">
                <span class="podium-badge-icon">👑🏆</span>
                <span class="podium-team-name">${firstPlace.name}</span>
                <span class="podium-team-score">${firstPlace.score} PTS</span>
              </div>
              <div class="podium-pedestal">
                <span class="podium-pedestal-num">1</span>
              </div>
            </div>

            <!-- 3RD PLACE (RIGHT - BRONZE) -->
            <div class="podium-column podium-column-third">
              <div class="podium-avatar-wrapper">
                <span class="podium-badge-icon">🥉</span>
                <span class="podium-team-name">${thirdPlace.name}</span>
                <span class="podium-team-score">${thirdPlace.score} PTS</span>
              </div>
              <div class="podium-pedestal">
                <span class="podium-pedestal-num">3</span>
              </div>
            </div>
          </div>

          <!-- REMAINING TEAMS TABLE (ROW-WISE) -->
          ${remainingTeams.length > 0 ? `
            <div class="remaining-teams-box">
              <div class="remaining-teams-title">OTHER PARTICIPATING TEAMS</div>
              <div class="remaining-teams-grid">
                ${remainingTeams.map((t, idx) => `
                  <div class="remaining-team-item">
                    <span class="rem-rank">#${idx + 4}</span>
                    <span class="rem-name">${t.name}</span>
                    <span class="rem-score">${t.score} PTS</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="finish-actions">
            <button class="btn-secondary" onclick="quizApp.showLanding()">
              🏠 BACK TO HOME
            </button>
            <button class="btn-primary-glow" onclick="quizApp.toggleScoreboard()">
              🏆 EDIT / ADJUST SCORES
            </button>
          </div>
        </div>
      </div>
    `;

    window.confetti.fire(6000);
    window.audioMgr.playCorrect("Congratulations to the champions!");
  }

  // ==========================================
  // TIMER ENGINE & WARNING COUNTDOWN
  // ==========================================

  startTimer(seconds) {
    this.stopTimer();
    const round = this.data.rounds[this.currentRoundIdx];
    const dur = seconds || (round ? round.durationSeconds : 60) || 60;
    this.currentDuration = dur;
    this.timerSeconds = dur;
    this.timerRunning = true;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      this.updateTimerDisplay();

      if (this.timerSeconds <= 10 && this.timerSeconds > 0) {
        window.audioMgr.playWarningBeep(this.timerSeconds);
        this.pulseTimerWarning();
      }

      if (this.timerSeconds <= 0) {
        this.stopTimer();
        this.triggerTimeFinished();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerRunning = false;
  }

  toggleTimerPause() {
    if (this.timerRunning) {
      this.stopTimer();
      window.audioMgr.playClick();
    } else if (this.timerSeconds > 0) {
      this.timerRunning = true;
      this.timerInterval = setInterval(() => {
        this.timerSeconds--;
        this.updateTimerDisplay();
        if (this.timerSeconds <= 10 && this.timerSeconds > 0) {
          window.audioMgr.playWarningBeep(this.timerSeconds);
          this.pulseTimerWarning();
        }
        if (this.timerSeconds <= 0) {
          this.stopTimer();
          this.triggerTimeFinished();
        }
      }, 1000);
      window.audioMgr.playClick();
    }
  }

  resetTimerDisplay(duration) {
    const round = this.data.rounds[this.currentRoundIdx];
    const dur = duration || (round ? round.durationSeconds : 60) || 60;
    this.currentDuration = dur;
    this.timerSeconds = dur;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const s = Math.max(0, this.timerSeconds);
    const formatted = s < 10 ? `0${s}` : `${s}`;
    if (this.dom.timerSeconds) {
      this.dom.timerSeconds.innerText = formatted;
    }

    if (this.dom.timerSvgCircle) {
      const circ = 276.46;
      const total = this.currentDuration || 60;
      const progress = s / total;
      const offset = circ * (1 - progress);
      this.dom.timerSvgCircle.style.strokeDashoffset = offset;

      if (s <= 10) {
        this.dom.timerSvgCircle.classList.add('timer-circle-warning');
        this.dom.timerContainer.classList.add('timer-warning');
      } else {
        this.dom.timerSvgCircle.classList.remove('timer-circle-warning');
        this.dom.timerContainer.classList.remove('timer-warning');
      }
    }
  }

  pulseTimerWarning() {
    if (this.dom.timerContainer) {
      this.dom.timerContainer.classList.add('timer-shake');
      setTimeout(() => {
        this.dom.timerContainer?.classList.remove('timer-shake');
      }, 350);
    }
  }

  triggerTimeFinished() {
    window.audioMgr.playTimeFinished();
    if (this.dom.timeOverModal) {
      this.dom.timeOverModal.classList.remove('hidden');
    }
  }

  // ==========================================
  // MEDIA CONTROLS & ZOOM
  // ==========================================

  toggleAudio(audioSrc) {
    const player = document.getElementById('q-audio-player');
    const btnLabel = document.getElementById('audio-btn-label');
    const btnIcon = document.getElementById('audio-btn-icon');
    if (!player) return;

    if (player.paused) {
      player.play();
      if (btnLabel) btnLabel.innerText = 'PAUSE AUDIO';
      if (btnIcon) btnIcon.innerText = '⏸';
      player.parentElement.classList.add('audio-playing');
    } else {
      player.pause();
      if (btnLabel) btnLabel.innerText = 'PLAY AUDIO CLUE';
      if (btnIcon) btnIcon.innerText = '▶';
      player.parentElement.classList.remove('audio-playing');
    }

    player.onended = () => {
      if (btnLabel) btnLabel.innerText = 'REPLAY AUDIO CLUE';
      if (btnIcon) btnIcon.innerText = '🔄';
      player.parentElement.classList.remove('audio-playing');
    };
  }

  zoomImage(src) {
    let zoomModal = document.getElementById('image-zoom-modal');
    if (!zoomModal) {
      zoomModal = document.createElement('div');
      zoomModal.id = 'image-zoom-modal';
      zoomModal.className = 'image-zoom-modal';
      zoomModal.innerHTML = `
        <div class="zoom-backdrop" onclick="this.parentElement.classList.add('hidden')"></div>
        <div class="zoom-content">
          <img id="zoom-img-target" src="" alt="Enlarged Visual">
          <button class="zoom-close-btn" onclick="this.parentElement.parentElement.classList.add('hidden')">✕ CLOSE</button>
        </div>
      `;
      document.body.appendChild(zoomModal);
    }
    document.getElementById('zoom-img-target').src = src;
    zoomModal.classList.remove('hidden');
  }

  // ==========================================
  // JUDGE DRAWER & LIVE SCOREBOARD
  // ==========================================

  toggleJudgeDrawer() {
    if (this.dom.judgeDrawer) {
      this.dom.judgeDrawer.classList.toggle('drawer-open');
    }
  }

  closeJudgeDrawer() {
    if (this.dom.judgeDrawer) {
      this.dom.judgeDrawer.classList.remove('drawer-open');
    }
  }

  toggleScoreboard() {
    if (this.dom.scoresModal) {
      this.dom.scoresModal.classList.toggle('hidden');
      this.renderScoreboard();
    }
  }

  closeScoreboard() {
    if (this.dom.scoresModal) {
      this.dom.scoresModal.classList.add('hidden');
    }
  }

  renderScoreboard() {
    const listEl = document.getElementById('scoreboard-teams-list');
    if (!listEl) return;

    listEl.innerHTML = this.teams.map((t, idx) => `
      <div class="scoreboard-row">
        <div class="team-info">
          <span class="team-index">${idx + 1}</span>
          <input type="text" class="team-name-input" value="${t.name}" onchange="quizApp.updateTeamName(${idx}, this.value)">
        </div>
        <div class="team-score-controls">
          <button class="score-adjust-btn btn-minus" title="Deduct 10" onclick="quizApp.adjustScore(${idx}, -10)">-10</button>
          <button class="score-adjust-btn btn-minus" title="Deduct 5" onclick="quizApp.adjustScore(${idx}, -5)">-5</button>
          <button class="score-adjust-btn btn-minus" title="Deduct 2" onclick="quizApp.adjustScore(${idx}, -2)">-2</button>
          <button class="score-adjust-btn btn-minus" title="Deduct 1" onclick="quizApp.adjustScore(${idx}, -1)">-1</button>
          <span class="team-score-num">${t.score}</span>
          <button class="score-adjust-btn btn-plus" title="Add 1" onclick="quizApp.adjustScore(${idx}, 1)">+1</button>
          <button class="score-adjust-btn btn-plus" title="Add 2" onclick="quizApp.adjustScore(${idx}, 2)">+2</button>
          <button class="score-adjust-btn btn-plus" title="Add 3" onclick="quizApp.adjustScore(${idx}, 3)">+3</button>
          <button class="score-adjust-btn btn-plus" title="Add 4" onclick="quizApp.adjustScore(${idx}, 4)">+4</button>
          <button class="score-adjust-btn btn-plus" title="Add 5" onclick="quizApp.adjustScore(${idx}, 5)">+5</button>
        </div>
      </div>
    `).join('');
  }

  adjustScore(teamIdx, delta) {
    if (this.teams[teamIdx]) {
      this.teams[teamIdx].score += delta;
      window.audioMgr.playClick();
      this.renderScoreboard();
    }
  }

  updateTeamName(teamIdx, newName) {
    if (this.teams[teamIdx]) {
      this.teams[teamIdx].name = newName;
    }
  }

  navigateNext() {
    if (this.currentView === 'general-q') {
      this.nextGeneralQuestion();
    }
  }

  navigateBack() {
    if (this.currentView === 'general-q') {
      this.prevGeneralQuestion();
    }
  }
}

// Global instance
window.quizApp = new QuizApp();
window.addEventListener('DOMContentLoaded', () => {
  window.quizApp.init();
});
