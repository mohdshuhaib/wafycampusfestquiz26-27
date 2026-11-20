/**
 * High-End Web Audio API Sound Synthesizer & Voice Engine
 * 100% Offline, Zero Latency, NFS Most Wanted Sound Profile
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.speechEnabled = true;
    this.speechVoice = null;
    this.initAudioContext();
    this.initSpeech();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initSpeech() {
    if ('speechSynthesis' in window) {
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        // Prefer natural English voices (Google, Microsoft, Natural)
        this.speechVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira') || v.name.includes('David'))) || voices.find(v => v.lang.startsWith('en')) || null;
      };
      setVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    }
  }

  speak(text) {
    if (this.muted || !this.speechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.speechVoice) {
        utterance.voice = this.speechVoice;
      }
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  }

  /**
   * NFS Most Wanted Style Urgent Countdown Warning (Seconds 10 -> 1)
   * High tension dual-pulse radar/sonar chirp with escalating pitch & sub thump
   */
  playWarningBeep(secondsLeft) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const urgency = Math.max(1, 11 - secondsLeft); // 1 (at 10s) to 10 (at 1s)

    // Base frequency rises as seconds tick down (from 600Hz at 10s up to 1250Hz at 1s)
    const baseFreq = 580 + (urgency * 65);

    // 1. Sub Bass Heartbeat Thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80 + urgency * 4, t);
    subOsc.frequency.exponentialRampToValueAtTime(35, t + 0.18);
    subGain.gain.setValueAtTime(0.5, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.22);

    // 2. High-Octane Laser/Sonar Pulse (Double Ping in NFS style)
    const playPing = (offset, freq, vol) => {
      const pingTime = t + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 1.2, pingTime);
      osc.frequency.exponentialRampToValueAtTime(freq, pingTime + 0.08);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, pingTime);
      filter.Q.setValueAtTime(6.0, pingTime);

      gain.gain.setValueAtTime(vol, pingTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, pingTime + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(pingTime);
      osc.stop(pingTime + 0.1);
    };

    // Primary chirp
    playPing(0, baseFreq, 0.45);
    // Secondary urgent echo-chirp (faster & more pronounced in last 5 seconds)
    playPing(0.12, baseFreq * 1.15, 0.35);

    // Extra high alarm overtone if under 5 seconds
    if (secondsLeft <= 4) {
      playPing(0.24, baseFreq * 1.3, 0.3);
    }
  }

  /**
   * Dramatic Time-Finished Alarm / Game Show Time Out Siren
   */
  playTimeFinished() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Siren sweeps down aggressively
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(750, t);
    osc1.frequency.linearRampToValueAtTime(240, t + 0.6);
    osc1.frequency.linearRampToValueAtTime(700, t + 1.1);
    osc1.frequency.linearRampToValueAtTime(180, t + 1.8);

    osc2.frequency.setValueAtTime(755, t);
    osc2.frequency.linearRampToValueAtTime(245, t + 0.6);
    osc2.frequency.linearRampToValueAtTime(705, t + 1.1);
    osc2.frequency.linearRampToValueAtTime(185, t + 1.8);

    gain.gain.setValueAtTime(0.55, t);
    gain.gain.setValueAtTime(0.5, t + 1.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 2.05);
    osc2.stop(t + 2.05);
  }

  /**
   * Rapid Mechanical / Roulette Spin Tick for Round 2
   */
  playSpinTick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Lock In / Selection Impact Sound (When Spin stops on a box)
   */
  playSpinLock() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // High shimmer
    const oscHigh = this.ctx.createOscillator();
    const gainHigh = this.ctx.createGain();
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(880, t);
    oscHigh.frequency.exponentialRampToValueAtTime(1760, t + 0.25);
    gainHigh.gain.setValueAtTime(0.4, t);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    oscHigh.connect(gainHigh);
    gainHigh.connect(this.ctx.destination);
    oscHigh.start(t);
    oscHigh.stop(t + 0.42);

    // Deep punch
    const oscPunch = this.ctx.createOscillator();
    const gainPunch = this.ctx.createGain();
    oscPunch.type = 'triangle';
    oscPunch.frequency.setValueAtTime(180, t);
    oscPunch.frequency.exponentialRampToValueAtTime(45, t + 0.35);
    gainPunch.gain.setValueAtTime(0.6, t);
    gainPunch.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    oscPunch.connect(gainPunch);
    gainPunch.connect(this.ctx.destination);
    oscPunch.start(t);
    oscPunch.stop(t + 0.42);
  }

  /**
   * Dramatic Suspense Countdown Tick (5, 4, 3, 2, 1) for Round 2 Answer Reveal
   */
  playSuspenseTick(num) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const urgency = 6 - num; // 1 (at 5) to 5 (at 1)

    // 1. Cinematic Sub Hit / Heartbeat
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(90 + (urgency * 15), t);
    sub.frequency.exponentialRampToValueAtTime(30, t + 0.35);
    subGain.gain.setValueAtTime(0.65, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.4);

    // 2. High Expectant Ping / Resonant Metallic Click
    const ping = this.ctx.createOscillator();
    const pingGain = this.ctx.createGain();
    ping.type = 'triangle';
    const pingFreq = 440 + (urgency * 120); // 560Hz up to 1040Hz
    ping.frequency.setValueAtTime(pingFreq, t);
    ping.frequency.exponentialRampToValueAtTime(pingFreq * 1.5, t + 0.15);
    pingGain.gain.setValueAtTime(0.4, t);
    pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    ping.connect(pingGain);
    pingGain.connect(this.ctx.destination);
    ping.start(t);
    ping.stop(t + 0.24);
  }

  /**
   * Grand Answer Reveal Impact Chime
   */
  playAnswerReveal() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C Major shimmering chord
    chords.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.05);
      gain.gain.setValueAtTime(0.3, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.05);
      osc.stop(t + 1.25);
    });
  }

  /**
   * Correct Answer Fanfare & Voice:
   * "Your answer is correct, Keep Going"
   */
  playCorrect(customText = "Your answer is correct, Keep Going") {
    if (this.muted) return;
    this.ensureContext();
    if (this.ctx) {
      const t = this.ctx.currentTime;
      // Majestic 5-note victory arpeggio: C5, E5, G5, B5, C6
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
      notes.forEach((freq, idx) => {
        const noteTime = t + (idx * 0.09);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        // Add warm harmonics with a subtle second oscillator
        const harm = this.ctx.createOscillator();
        const harmGain = this.ctx.createGain();
        harm.type = 'triangle';
        harm.frequency.setValueAtTime(freq * 2, noteTime);

        const dur = idx === notes.length - 1 ? 0.9 : 0.35;
        gain.gain.setValueAtTime(0.35, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

        harmGain.gain.setValueAtTime(0.12, noteTime);
        harmGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

        osc.connect(gain);
        harm.connect(harmGain);
        gain.connect(this.ctx.destination);
        harmGain.connect(this.ctx.destination);

        osc.start(noteTime);
        harm.start(noteTime);
        osc.stop(noteTime + dur + 0.05);
        harm.stop(noteTime + dur + 0.05);
      });
    }

    setTimeout(() => {
      this.speak(customText);
    }, 450);
  }

  /**
   * Wrong Answer Buzzer & Voice:
   * "Sorry, Wrong Answer"
   */
  playWrong(customText = "Sorry, Wrong Answer") {
    if (this.muted) return;
    this.ensureContext();
    if (this.ctx) {
      const t = this.ctx.currentTime;

      // Heavy harsh buzzer (dual detuned sawtooth oscillators)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, t);
      osc2.frequency.setValueAtTime(144, t);

      // Low pitch slide
      osc1.frequency.linearRampToValueAtTime(95, t + 0.65);
      osc2.frequency.linearRampToValueAtTime(98, t + 0.65);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.75);
      osc2.stop(t + 0.75);
    }

    setTimeout(() => {
      this.speak(customText);
    }, 350);
  }

  /**
   * Subtle UI Button Click Sound
   */
  playClick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.muted;
  }
}

// Global instance
window.audioMgr = new AudioManager();
