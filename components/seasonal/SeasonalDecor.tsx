'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { ThemeDecor } from '@/lib/themes';
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
  /** Stars stay put and pulse instead of moving off-screen. */
  twinkle?: boolean;
  /** Sprites are drawn at this multiple of the particle size (glow dots fade out at their edges). */
  scale?: number;
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

const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

function emojiSprite(ch: string) {
  return sprite(96, (ctx, s) => {
    ctx.font = `${s * 0.78}px ${EMOJI_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, s / 2, s / 2 + s * 0.04);
  });
}

function confettiSprite(color: string) {
  return sprite(32, (ctx, s) => {
    ctx.fillStyle = color;
    ctx.fillRect(s * 0.2, s * 0.34, s * 0.6, s * 0.32);
    // A faint edge so white confetti still shows on pale pages.
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(s * 0.2, s * 0.34, s * 0.6, s * 0.32);
  });
}

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${alpha})`;
}

type SpriteKind = 'emoji' | 'dot' | 'confetti';
const KIND_SCALE: Record<SpriteKind, number> = { emoji: 1, confetti: 1.6, dot: 2.4 };

/** Builds the particle layer for a data-only theme from its `decor.particles`. */
function configFromDecor(p: NonNullable<ThemeDecor['particles']>): Config | null {
  const sprites: HTMLCanvasElement[] = [];
  const kinds: SpriteKind[] = [];
  const add = (c: HTMLCanvasElement, k: SpriteKind) => {
    sprites.push(c);
    kinds.push(k);
  };
  p.emoji?.forEach((e) => add(emojiSprite(e), 'emoji'));
  p.dots?.forEach((c) => add(glowDot(withAlpha(c, 0.95), withAlpha(c, 0.55)), 'dot'));
  p.glow?.forEach(([a, b]) => add(glowDot(a, withAlpha(b, 0.75)), 'dot'));
  p.confetti?.forEach((c) => add(confettiSprite(c), 'confetti'));
  if (!sprites.length) return null;

  const [sMin, sMax] = p.size ?? [10, 20];
  const [vMin, vMax] = p.speed ?? [15, 40];
  const [aMin, aMax] = p.opacity ?? [0.6, 1];
  const emojiIdx = kinds.flatMap((k, i) => (k === 'emoji' ? [i] : []));
  const otherIdx = kinds.flatMap((k, i) => (k !== 'emoji' ? [i] : []));
  // When emoji are mixed with dots, emoji make up about a third, so they read as accents.
  const pick = () => {
    if (!emojiIdx.length || !otherIdx.length) return Math.floor(rand(0, sprites.length));
    const pool = Math.random() < 0.34 ? emojiIdx : otherIdx;
    return pool[Math.floor(rand(0, pool.length))];
  };

  return {
    density: p.density ?? 0.25,
    max: p.max ?? 40,
    kind: 'sprite',
    sprites,
    twinkle: p.motion === 'twinkle',
    spawn: (w, h, initial) => {
      const sprite = pick();
      const kind = kinds[sprite];
      const size = rand(sMin, sMax) * KIND_SCALE[kind];
      const speed = rand(vMin, vMax);
      const spin = !!p.spin || kind === 'confetti';
      const common = {
        rot: spin ? rand(0, Math.PI * 2) : 0,
        vr: spin ? rand(-1.6, 1.6) : 0,
        phase: rand(0, Math.PI * 2),
        alpha: rand(aMin, aMax),
        life: 0,
        maxLife: 0,
        size,
        sprite,
      };
      switch (p.motion) {
        case 'rise':
        case 'float':
          return { ...common, x: rand(0, w), y: initial ? rand(0, h) : h + rand(10, 40), vx: rand(-8, 8), vy: -speed };
        case 'drift': {
          const fromLeft = Math.random() < 0.5;
          return {
            ...common,
            x: initial ? rand(0, w) : fromLeft ? -40 : w + 40,
            y: rand(h * 0.08, h * 0.7),
            vx: (fromLeft ? 1 : -1) * speed * 1.6,
            vy: rand(-4, 4),
            vr: 0,
            rot: rand(-0.3, 0.3),
          };
        }
        case 'twinkle':
          return { ...common, x: rand(0, w), y: rand(0, h), vx: 0, vy: 0, vr: 0, rot: 0 };
        default:
          return { ...common, x: rand(0, w), y: initial ? rand(0, h) : rand(-40, -10), vx: rand(-10, 10), vy: speed };
      }
    },
  };
}

function configFor(season: Season, decor?: ThemeDecor): Config | null {
  if (decor) return decor.particles ? configFromDecor(decor.particles) : null;
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
        scale: 2.4,
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

type Spark = {
  kind: 'spark' | 'puff' | 'comic' | 'streak';
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  word?: string;
};

type Bursts = NonNullable<ThemeDecor['bursts']>;

const FIREWORK_COLORS = ['#FFD34D', '#FF9933', '#FF5E5B', '#FFF1B8', '#FF7AD9', '#7CF0FF'];
const DIWALI_BURSTS: Bursts = { style: 'firework', colors: FIREWORK_COLORS, every: [2200, 4800] };

/** A jagged star-burst outline for comic-book sound effects. */
function starburst(ctx: CanvasRenderingContext2D, r: number, points = 12) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.62 : r * (0.95 + ((i * 7) % 5) * 0.03);
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.78);
  }
  ctx.closePath();
}

/**
 * Site-wide seasonal atmosphere: a full-screen particle layer (snow, embers,
 * hearts, rain, petals, emoji, confetti), occasional bursts (fireworks, Holi
 * colour clouds, comic "POW!"s, shooting stars) plus a small corner scene.
 * Purely decorative: click-through, hidden from screen readers, and off for
 * reduced-motion users.
 */
export default function SeasonalDecor({ season, decor }: { season: Season; decor?: ThemeDecor }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const config = configFor(season, decor);
    const bursts = decor ? decor.bursts : season === 'diwali' ? DIWALI_BURSTS : undefined;
    if (!canvas || !ctx || (!config && !bursts)) return;

    const small = window.matchMedia('(max-width: 768px)').matches;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    const sparks: Spark[] = [];
    let nextBurst = performance.now() + 1500;

    const target = () =>
      config ? Math.min(config.max * (small ? 0.5 : 1), Math.round(((w * h) / 10000) * config.density)) : 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = target();
      while (config && particles.length < n) particles.push(config.spawn(w, h, true) as Particle);
      particles = particles.slice(0, n);
    };
    resize();

    const puffSprites = new Map<string, HTMLCanvasElement>();
    const puff = (color: string) => {
      let c = puffSprites.get(color);
      if (!c) {
        c = glowDot(withAlpha(color, 0.9), withAlpha(color, 0.5));
        puffSprites.set(color, c);
      }
      return c;
    };

    const burst = (b: Bursts) => {
      const color = b.colors[Math.floor(rand(0, b.colors.length))] ?? '#FFD34D';
      const x = rand(w * 0.12, w * 0.88);
      if (b.style === 'powder') {
        // A cloud of gulal thrown into the air.
        const y = rand(h * 0.2, h * 0.75);
        const count = small ? 10 : 16;
        for (let i = 0; i < count; i++) {
          const a = rand(0, Math.PI * 2);
          const speed = rand(30, 130);
          const life = rand(1.6, 2.6);
          sparks.push({ kind: 'puff', x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 20, life, maxLife: life, color, size: rand(30, 60) });
        }
      } else if (b.style === 'comic') {
        const words = b.words?.length ? b.words : ['POW!'];
        sparks.push({
          kind: 'comic',
          x,
          y: rand(h * 0.22, h * 0.7),
          vx: 0,
          vy: 0,
          life: 1.5,
          maxLife: 1.5,
          color,
          size: small ? 44 : 64,
          word: words[Math.floor(rand(0, words.length))],
        });
      } else if (b.style === 'shooting') {
        const dir = Math.random() < 0.5 ? 1 : -1;
        sparks.push({ kind: 'streak', x, y: rand(h * 0.05, h * 0.35), vx: dir * rand(520, 760), vy: rand(180, 280), life: 1.1, maxLife: 1.1, color, size: 2 });
      } else {
        const y = rand(h * 0.12, h * 0.42);
        const count = small ? 26 : 44;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          const speed = rand(70, 150);
          const life = rand(1.1, 1.8);
          sparks.push({ kind: 'spark', x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life, maxLife: life, color, size: 1 });
        }
      }
    };

    const drawSparks = (dt: number) => {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const t = s.life / s.maxLife;
        if (s.kind === 'spark') {
          s.vx *= 1 - dt * 1.6;
          s.vy = s.vy * (1 - dt * 1.6) + 55 * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = t;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.2 + t * 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        } else if (s.kind === 'puff') {
          s.vx *= 1 - dt * 2.2;
          s.vy = s.vy * (1 - dt * 2.2) + 12 * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          const size = s.size * (1 + (1 - t) * 1.8);
          ctx.globalAlpha = Math.min(1, t * 1.4) * 0.55;
          ctx.drawImage(puff(s.color), s.x - size / 2, s.y - size / 2, size, size);
        } else if (s.kind === 'streak') {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          const tx = s.x - s.vx * 0.18;
          const ty = s.y - s.vy * 0.18;
          const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
          g.addColorStop(0, withAlpha(s.color, t));
          g.addColorStop(1, withAlpha(s.color, 0));
          ctx.globalAlpha = 1;
          ctx.strokeStyle = g;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        } else {
          // Pop in with a little overshoot, hold, then fade.
          const age = s.maxLife - s.life;
          const pop = age < 0.18 ? (age / 0.18) * 1.15 : age < 0.3 ? 1.15 - ((age - 0.18) / 0.12) * 0.15 : 1;
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(-0.12);
          ctx.scale(pop, pop);
          ctx.globalAlpha = t < 0.3 ? t / 0.3 : 1;
          starburst(ctx, s.size * 1.25);
          ctx.fillStyle = s.color;
          ctx.fill();
          ctx.lineWidth = 3.5;
          ctx.strokeStyle = '#111';
          ctx.stroke();
          ctx.font = `italic 900 ${s.size * 0.5}px Impact, "Arial Black", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.lineWidth = 5;
          ctx.strokeText(s.word ?? '', 0, 2);
          ctx.fillStyle = s.color === '#FFD23F' ? '#E23636' : '#FFFFFF';
          ctx.fillText(s.word ?? '', 0, 2);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (config?.kind === 'rain') {
        ctx.lineCap = 'round';
        ctx.lineWidth = 1.1;
      }

      for (let i = 0; config && i < particles.length; i++) {
        const p = particles[i];
        p.phase += dt;
        const img = config.sprites[p.sprite] ?? config.sprites[0];

        if (config.twinkle) {
          ctx.globalAlpha = p.alpha * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p.phase * 2.2)));
          ctx.drawImage(img, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          continue;
        }

        p.x += (p.vx + Math.sin(p.phase * 1.3) * (config.kind === 'rain' ? 0 : 14)) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;

        const out = p.vy > 0 ? p.y > h + 30 : p.vy < 0 ? p.y < -30 : false;
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
        const s = p.size * (config.scale ?? 1);
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

      if (bursts) {
        if (now > nextBurst) {
          burst(bursts);
          const [a, b] = bursts.every ?? [2200, 4800];
          nextBurst = now + rand(a, b);
        }
        drawSparks(dt);
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
  }, [season, decor, reduce]);

  return (
    <div className={styles.decor} aria-hidden="true">
      {!reduce && <canvas ref={canvasRef} className={styles.canvas} />}
      <SeasonScene season={season} decor={decor} />
    </div>
  );
}
