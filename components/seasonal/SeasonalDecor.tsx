'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { SeasonScene } from './SeasonArt';
import styles from './Seasonal.module.css';

type Season = string;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  phase: number;
  alpha: number;
  sprite: number;
  life: number;
  maxLife: number;
};

type Config = {
  /** Particles per 10,000 px² of viewport, before the cap. */
  density: number;
  max: number;
  spawn: (w: number, h: number, initial: boolean) => Omit<Particle, 'sprite'> & { sprite?: number };
  sprites: HTMLCanvasElement[];
  kind: 'sprite' | 'rain';
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function sprite(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) draw(ctx, size);
  return c;
}

function glowDot(inner: string, outer: string) {
  return sprite(64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, outer);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

function snowflake() {
  return sprite(64, (ctx, s) => {
    ctx.translate(s / 2, s / 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.shadowColor = 'rgba(110,150,190,0.8)';
    ctx.shadowBlur = 4;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -26);
      ctx.moveTo(0, -15);
      ctx.lineTo(-7, -21);
      ctx.moveTo(0, -15);
      ctx.lineTo(7, -21);
      ctx.stroke();
    }
  });
}

function heart(color: string) {
  return sprite(64, (ctx, s) => {
    ctx.translate(s / 2, s / 2 + 2);
    ctx.scale(s / 1.15, s / 1.15);
    ctx.beginPath();
    ctx.moveTo(0, -0.2);
    ctx.bezierCurveTo(0, -0.45, -0.5, -0.5, -0.5, -0.15);
    ctx.bezierCurveTo(-0.5, 0.1, -0.2, 0.3, 0, 0.5);
    ctx.bezierCurveTo(0.2, 0.3, 0.5, 0.1, 0.5, -0.15);
    ctx.bezierCurveTo(0.5, -0.5, 0, -0.45, 0, -0.2);
    ctx.fillStyle = color;
    ctx.fill();
  });
}

function petal(color: string) {
  return sprite(64, (ctx, s) => {
    ctx.translate(s / 2, s / 2);
    const g = ctx.createLinearGradient(-20, 0, 20, 0);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(255,255,255,0.85)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function configFor(season: Season): Config | null {
  const base = { rot: 0, vr: 0, phase: 0, life: 0, maxLife: 0 };
  switch (season) {
    case 'christmas':
      return {
        density: 1.1,
        max: 140,
        kind: 'sprite',
        sprites: [
          glowDot('rgba(255,255,255,1)', 'rgba(205,225,242,0.9)'),
          snowflake(),
        ],
        spawn: (w, h, initial) => {
          const size = rand(3, 9);
          // Bigger flakes are drawn as crystals; small ones as soft dots.
          const crystal = size > 7.5;
          return {
            ...base,
            x: rand(0, w),
            y: initial ? rand(0, h) : rand(-40, -10),
            vx: rand(-8, 8),
            vy: rand(25, 60) * (size / 6),
            size: crystal ? size * 2.2 : size,
            sprite: crystal ? 1 : 0,
            vr: rand(-0.6, 0.6),
            phase: rand(0, Math.PI * 2),
            alpha: rand(0.7, 1),
          };
        },
      };
    case 'diwali':
      return {
        density: 0.45,
        max: 70,
        kind: 'sprite',
        sprites: [
          glowDot('rgba(255,244,200,1)', 'rgba(255,170,40,0.7)'),
          glowDot('rgba(255,236,170,1)', 'rgba(255,110,40,0.6)'),
        ],
        spawn: (w, h, initial) => ({
          ...base,
          x: rand(0, w),
          y: initial ? rand(0, h) : h + rand(10, 40),
          vx: rand(-6, 6),
          vy: -rand(18, 45),
          size: rand(4, 11),
          phase: rand(0, Math.PI * 2),
          alpha: rand(0.5, 0.95),
          sprite: Math.random() < 0.5 ? 0 : 1,
        }),
      };
    case 'valentine':
      return {
        density: 0.28,
        max: 40,
        kind: 'sprite',
        sprites: [heart('#E63956'), heart('#FF7A9A'), heart('#C9184A')],
        spawn: (w, h, initial) => ({
          ...base,
          x: rand(0, w),
          y: initial ? rand(0, h) : h + rand(10, 40),
          vx: rand(-5, 5),
          vy: -rand(18, 40),
          size: rand(10, 22),
          vr: rand(-0.4, 0.4),
          phase: rand(0, Math.PI * 2),
          alpha: rand(0.35, 0.7),
          sprite: Math.floor(rand(0, 3)),
        }),
      };
    case 'monsoon':
      return {
        density: 0.9,
        max: 130,
        kind: 'rain',
        sprites: [],
        spawn: (w, h, initial) => {
          const vy = rand(550, 850);
          return {
            ...base,
            x: rand(-100, w),
            y: initial ? rand(0, h) : rand(-60, -10),
            vx: vy * 0.18,
            vy,
            size: rand(12, 24),
            phase: 0,
            alpha: rand(0.22, 0.45),
            sprite: 0,
          };
        },
      };
    default:
      return {
        density: 0.2,
        max: 28,
        kind: 'sprite',
        sprites: [petal('#F3A6BE'), petal('#F8C8D6')],
        spawn: (w, h, initial) => ({
          ...base,
          x: rand(0, w),
          y: initial ? rand(0, h) : rand(-40, -10),
          vx: rand(-10, 14),
          vy: rand(22, 45),
          size: rand(9, 16),
          vr: rand(-1.2, 1.2),
          rot: rand(0, Math.PI * 2),
          phase: rand(0, Math.PI * 2),
          alpha: rand(0.45, 0.8),
          sprite: Math.random() < 0.5 ? 0 : 1,
        }),
      };
  }
}

type Spark = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string };

const FIREWORK_COLORS = ['#FFD34D', '#FF9933', '#FF5E5B', '#FFF1B8', '#FF7AD9', '#7CF0FF'];

/**
 * Site-wide seasonal atmosphere: a full-screen particle layer (snow, Diwali
 * embers and fireworks, hearts, rain, petals) plus a small corner scene.
 * Purely decorative: click-through, hidden from screen readers, and off for
 * reduced-motion users.
 */
export default function SeasonalDecor({ season }: { season: Season }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const config = configFor(season);
    if (!canvas || !ctx || !config) return;

    const small = window.matchMedia('(max-width: 768px)').matches;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    const sparks: Spark[] = [];
    let nextFirework = performance.now() + 1500;

    const target = () =>
      Math.min(config.max * (small ? 0.5 : 1), Math.round(((w * h) / 10000) * config.density));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = target();
      while (particles.length < n) particles.push(config.spawn(w, h, true) as Particle);
      particles = particles.slice(0, n);
    };
    resize();

    const burst = () => {
      const x = rand(w * 0.12, w * 0.88);
      const y = rand(h * 0.12, h * 0.42);
      const color = FIREWORK_COLORS[Math.floor(rand(0, FIREWORK_COLORS.length))];
      const count = small ? 26 : 44;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const speed = rand(70, 150);
        const life = rand(1.1, 1.8);
        sparks.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life, maxLife: life, color });
      }
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (config.kind === 'rain') {
        ctx.lineCap = 'round';
        ctx.lineWidth = 1.1;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += dt;
        p.x += (p.vx + Math.sin(p.phase * 1.3) * (config.kind === 'rain' ? 0 : 14)) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;

        const out = p.vy > 0 ? p.y > h + 30 : p.y < -30;
        if (out || p.x < -120 || p.x > w + 120) {
          particles[i] = config.spawn(w, h, false) as Particle;
          continue;
        }

        if (config.kind === 'rain') {
          ctx.strokeStyle = `rgba(122, 170, 200, ${p.alpha})`;
          const k = p.size / p.vy;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * k, p.y - p.vy * k);
          ctx.stroke();
          continue;
        }

        // Diwali embers flicker as they rise.
        const flicker = season === 'diwali' ? 0.65 + Math.sin(p.phase * 9) * 0.35 : 1;
        ctx.globalAlpha = p.alpha * flicker;
        const img = config.sprites[p.sprite] ?? config.sprites[0];
        const s = p.size * (season === 'diwali' ? 2.4 : 1);
        if (p.rot || p.vr) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot + (season === 'valentine' ? Math.sin(p.phase) * 0.3 : 0));
          ctx.drawImage(img, -s / 2, -s / 2, s, s);
          ctx.restore();
        } else {
          ctx.drawImage(img, p.x - s / 2, p.y - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;

      if (season === 'diwali') {
        if (now > nextFirework) {
          burst();
          nextFirework = now + rand(2200, 4800);
        }
        ctx.globalCompositeOperation = 'lighter';
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.life -= dt;
          if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }
          s.vx *= 1 - dt * 1.6;
          s.vy = s.vy * (1 - dt * 1.6) + 55 * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          const t = s.life / s.maxLife;
          ctx.globalAlpha = t;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.2 + t * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());

    start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [season, reduce]);

  return (
    <div className={styles.decor} aria-hidden="true">
      {!reduce && <canvas ref={canvasRef} className={styles.canvas} />}
      <SeasonScene season={season} />
    </div>
  );
}
