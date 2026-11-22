# Wafy Campus Fest Quiz Competition 2026-27

A presentation-grade, broadcast-quality Quiz Competition web application built for **Campus Arts Fest (November 21–22, 2026)** at **Wafy Campus Kalikavu**, led by **Hafsal Faizy Anjilangadi**.

Designed to replace static PPTX presentations with a dynamic, interactive stage-ready experience featuring custom audio synthesis, countdown timers, box randomizers, and judge tools.

---

## 🚀 How to Launch the Quiz

### Option 1: Quick Launcher (Recommended)
Double-click **`start_quiz.bat`**.
- It starts a zero-dependency local media streaming server on `http://localhost:3000` and automatically opens the presentation in your default browser.

### Option 2: Direct File Mode
Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Brave).
- Works 100% offline without an active internet connection.

---

## 🌟 Key Features & Rounds Overview

### 1. Presentation Aesthetics & Branding
- **Landing Page**: Uses `quizlanding.png` with official fest typography, festival dates, and quick round-jump buttons.
- **Stage Background**: Uses `quizcover.png` for all questions and transition screens.
- **Typography**: Uses `Anek Malayalam` & `Outfit` with crisp Malayalam and English rendering.
- **Widescreen Layout**: Styled for 16:9 projection displays and stage LED walls. Press <kbd>F</kbd> or click the **⛶** icon for true Fullscreen mode.

### 2. Five Comprehensive Rounds with Gap/Transition Pages & Custom Timers
Each round begins with a transition **Gap Page** outlining round rules, question formats, and scoring guidelines before entering:

- **Round 1 (General Round - 11 Questions • 30 Seconds)**:
  - 30-second live countdown timer per question.
  - Common questions featuring video (`round1-q1video.mp4`), audio (`round1-q2audio.mp3`), and images.
  - Video and audio require manual play clicks (no disruptive autoplays).
- **Round 2 (Highlight Box Selection Round - 6 Boxes, 2 Questions each • 1 Minute)**:
  - 6 mystery 3D folder tiles wrapped inside clean frosted presentation cards.
  - **Spin / Random Select Button**: Rapidly highlights boxes for **4 seconds** with ratchet wheel sound effects, locking onto a random box.
  - Selected box reveals two question choices: **Q-1** and **Q-2**.
  - **Dramatic Answer Reveal**: Clicking "SHOW ANSWER" triggers a full-screen suspense countdown: **5... 4... 3... 2... 1...** with escalating heartbeat/sonar suspense ticks before revealing the answer in the center!
  - Completing a question returns to the box screen, where the **selected box is hidden** for remaining teams.
  - When only 1 box remains, it is directly clickable.
- **Round 3 (General Round - 5 Questions • 40 Seconds)**:
  - 40-second live countdown timer per question.
  - Rapid visual observation questions. Answer reveals immediately in the center upon clicking "SHOW ANSWER".
- **Round 4 (The Clue Round - 6 Boxes, 3 Clues per Question • 1 Minute Total)**:
  - 6 mystery 3D folder tiles with **SPIN / Random Select setup** (identical to Round 2).
  - Clicking **SPIN** highlights boxes for **4 seconds** with mechanical ratchet sounds and locks onto a random clue box.
  - Each box holds **one question with 3 progressive clues**.
  - **1 Minute Total Timer** for all clues.
  - Clue 1 appears upon start; Judge clicks **"Reveal Clue 2"** and **"Reveal Clue 3"** as requested by the team.
  - Images appear seamlessly when specific clues are unlocked (e.g. Clue 2 for Box 1, Clue 1 for Box 6).
  - Returns to box selection with completed boxes hidden.
- **Round 5 (The Grand Finale - 5 Questions • 40 Seconds)**:
  - 40-second live countdown timer per question.
  - Decisive final questions leading to the grand winner celebration screen with confetti.

### 3. Smart Countdown Timer & NFS-Style Warning
- **Circular Countdown Ring + Digital HUD**: Smoothly adapts to 30s, 40s, or 60s per round.
- **Pre-Question Ready Gate**: "Start Timer & Reveal Question" prevents accidental premature reveals before the team is ready.
- **NFS Most Wanted Warning Sound**: At the final 10 seconds (10 to 1), dual-pulse sonar radar beeps and heartbeat pulses escalate in frequency and urgency.
- **Time Finished Overlay**: Dramatic buzzer and alarm when the time limit expires.

### 4. Judge Controls & Answer Reveal System
- **👁 SHOW ANSWER Modal**:
  - **Round 2**: Features an adrenaline-pumping **5, 4, 3, 2, 1 suspense countdown** with big pulsing numbers and ticking sound effects before the grand reveal in the center.
  - **Rounds 1, 3, 4, 5**: Immediately displays the verified answer prominently in the center of the screen with a clean dismiss button.
- **🏆 Live Team Scoreboard**: Modal to manage team names and adjust scores with 1-click buttons: **-10, -5, -2, -1** and **+1, +2, +3, +4, +5**.
- **⚙ Judge Master Drawer**: Accessible anytime via the gear icon or pressing <kbd>J</kbd>.

---

## ⌨ Presentation Keyboard Shortcuts

| Key | Action |
| --- | --- |
| <kbd>Space</kbd> | Start Timer / Reveal Next Clue |
| <kbd>W</kbd> | **Round 2: WRONG Answer** (5s countdown &rarr; *"Sorry, Wrong Answer"* &rarr; passes to next team) |
| <kbd>A</kbd> or <kbd>C</kbd> | **Round 2: CORRECT Answer / SHOW ANSWER** (5s countdown &rarr; Fanfare, Confetti & Answer Reveal) |
| <kbd>A</kbd> | **Rounds 1, 3, 4, 5**: Reveal Official Answer modal |
| <kbd>K</kbd> | **Round 2: Discreet Answer Key** (Toggles private judge answer reference without audience reveal) |
| <kbd>Enter</kbd> | Dismiss Wrong modal (back to question) / Complete Correct modal / Confirm final results |
| <kbd>S</kbd> | Open / Close **Live Team Scoreboard** |
| <kbd>P</kbd> | **Pause / Resume** Countdown Timer |
| <kbd>→</kbd> | Next Question |
| <kbd>←</kbd> | Previous Question |
| <kbd>F</kbd> | Toggle **Fullscreen** Mode |
| <kbd>J</kbd> | Open / Close **Judge Navigation Drawer** |
| <kbd>Esc</kbd> | Dismiss active modal / drawer |

---

## 📂 Project Structure

```
wafycampusfestquiz26-27/
│
├── index.html               # Main Single-Page Presentation App
├── server.js                # Local high-performance Node HTTP server
├── start_quiz.bat           # 1-Click Windows Launcher
├── quizlanding.png          # Main Fest Hero Landing Background
├── quizcover.png            # Stage Presentation Background
│
├── css/
│   └── styles.css           # Premium Game-Show Presentation Styles
│
├── js/
│   ├── quizData.js          # Complete structured question bank & metadata
│   ├── audioManager.js      # Web Audio API Synthesizer (NFS warning, buzzers, voice)
│   ├── confetti.js          # Hardware-accelerated canvas celebration particles
│   └── app.js               # State machine, timers, box randomizer, judge engine
│
└── quizassets/              # All 35 media files (images, audio, video)
```
