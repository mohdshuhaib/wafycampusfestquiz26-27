/**
 * Lightweight, zero-dependency Stage Confetti Cannon for Correct Answers
 */
class ConfettiCannon {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animId = null;
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire(durationMs = 3000) {
    this.resize();
    const colors = ['#f5b324', '#ff4d4d', '#ffffff', '#22c55e', '#38bdf8', '#fbbf24', '#e11d48'];
    const count = 160;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: window.innerWidth * (0.2 + Math.random() * 0.6),
        y: window.innerHeight * 0.4 + (Math.random() * 80),
        vx: (Math.random() - 0.5) * 22,
        vy: -Math.random() * 18 - 6,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!this.animId) {
      this.loop();
    }

    setTimeout(() => {
      // Fade out remaining particles
      const fadeInterval = setInterval(() => {
        let alive = false;
        this.particles.forEach(p => {
          p.alpha -= 0.05;
          if (p.alpha > 0) alive = true;
        });
        if (!alive) {
          clearInterval(fadeInterval);
          this.particles = [];
        }
      }, 50);
    }, durationMs);
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // Gravity
      p.vx *= 0.985; // Air drag
      p.rotation += p.rSpeed;

      if (p.y > this.canvas.height + 20 || p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

window.confetti = new ConfettiCannon();
