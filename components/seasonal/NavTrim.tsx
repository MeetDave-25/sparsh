import type { CSSProperties } from 'react';
import type { ThemeDecor } from '@/lib/themes';
import styles from './Seasonal.module.css';

const TILES = 28;
const HEART = 'M0,-0.2 C0,-0.45 -0.5,-0.5 -0.5,-0.15 C-0.5,0.1 -0.2,0.3 0,0.5 C0.2,0.3 0.5,0.1 0.5,-0.15 C0.5,-0.5 0,-0.45 0,-0.2 Z';
const BULBS = ['#E63946', '#FFC940', '#2EC46B', '#4DA3FF'];

/** Point on the quadratic swag from (0,y0) through control (w/2,dip) to (w,y0). */
function swag(t: number, w: number, y0: number, dip: number) {
  return { x: w * t, y: (1 - t) ** 2 * y0 + 2 * t * (1 - t) * dip + t ** 2 * y0 };
}

function Icicle({ x, y, len }: { x: number; y: number; len: number }) {
  return <path d={`M${x - 3.5} ${y} L${x + 3.5} ${y} L${x} ${y + len} Z`} fill="url(#trim-ice)" />;
}

function ChristmasTile({ i }: { i: number }) {
  const bulb = swag(0.5, 120, 4, 22);
  return (
    <svg viewBox="0 0 120 46" width="120" height="46" className={styles.tile}>
      <path d="M0 0 H120 V3 Q105 7 90 3 Q75 6 60 3 Q45 7 30 3 Q15 6 0 3 Z" fill="#fff" opacity="0.95" />
      <Icicle x={20} y={swag(1 / 6, 120, 4, 22).y} len={18 + (i % 3) * 5} />
      <Icicle x={36} y={swag(0.3, 120, 4, 22).y} len={10} />
      <Icicle x={92} y={swag(0.77, 120, 4, 22).y} len={14 + (i % 2) * 8} />
      <path d="M0 4 Q60 22 120 4" stroke="#24402A" strokeWidth="1.4" fill="none" />
      <rect x={bulb.x - 3} y={bulb.y - 1} width="6" height="5" rx="1" fill="#3A4A3A" />
      <ellipse
        cx={bulb.x}
        cy={bulb.y + 11}
        rx="4.6"
        ry="7"
        fill={BULBS[i % BULBS.length]}
        className={styles.bulb}
        style={{ animationDelay: `${(i % 4) * 0.35}s`, color: BULBS[i % BULBS.length] } as CSSProperties}
      />
    </svg>
  );
}

function DiwaliTile({ i }: { i: number }) {
  const flowers = Array.from({ length: 10 }, (_, k) => swag(0.05 + k * 0.1, 120, 3, 30));
  const mid = swag(0.5, 120, 3, 30);
  return (
    <svg viewBox="0 0 120 58" width="120" height="58" className={styles.tile}>
      <path d="M0 3 Q60 30 120 3" stroke="#7A4A12" strokeWidth="1" fill="none" />
      {flowers.map((p, k) => (
        <g key={k}>
          <circle cx={p.x} cy={p.y} r="4.6" fill={k % 2 ? '#FFC21A' : '#FF8A00'} />
          <circle cx={p.x} cy={p.y} r="2.2" fill={k % 2 ? '#F29E00' : '#E06A00'} />
        </g>
      ))}
      {/* Mango leaf and a small brass bell at the lowest point of the swag */}
      <g className={styles.swing} style={{ transformOrigin: `${mid.x}px ${mid.y}px`, animationDelay: `${(i % 5) * 0.3}s` }}>
        <path d={`M${mid.x} ${mid.y + 3} C${mid.x + 7} ${mid.y + 12} ${mid.x + 4} ${mid.y + 20} ${mid.x} ${mid.y + 25} C${mid.x - 4} ${mid.y + 20} ${mid.x - 7} ${mid.y + 12} ${mid.x} ${mid.y + 3} Z`} fill={i % 2 ? '#3E8E41' : '#2F7A36'} />
        <path d={`M${mid.x} ${mid.y + 5} V${mid.y + 23}`} stroke="#9ED39F" strokeWidth="0.6" />
      </g>
      {i % 2 === 0 && (
        <g>
          <path d="M0 3 V12" stroke="#B8860B" strokeWidth="0.8" />
          <path d="M-4 18 Q0 8 4 18 Z" fill="#E0B040" />
        </g>
      )}
    </svg>
  );
}

function ValentineTile({ i }: { i: number }) {
  const mid = swag(0.5, 80, 2, 14);
  return (
    <svg viewBox="0 0 80 38" width="80" height="38" className={styles.tile}>
      <path d="M0 2 Q40 14 80 2" stroke="#B85A6E" strokeWidth="0.8" fill="none" />
      <g className={styles.swing} style={{ transformOrigin: `${mid.x}px ${mid.y}px`, animationDelay: `${(i % 4) * 0.4}s` }}>
        <path d={`M${mid.x} ${mid.y} V${mid.y + 8}`} stroke="#B85A6E" strokeWidth="0.8" />
        <path d={HEART} transform={`translate(${mid.x} ${mid.y + 16}) scale(18)`} fill={i % 2 ? '#FF7A9A' : '#E63956'} />
      </g>
    </svg>
  );
}

function MonsoonTile({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 60 40" width="60" height="40" className={styles.tile}>
      <g className={styles.drip} style={{ animationDelay: `${(i * 0.37) % 2.4}s` }}>
        <path d="M20 2 C23 7 24 9 24 11 A4 4 0 0 1 16 11 C16 9 17 7 20 2 Z" fill="#7AB8C8" opacity="0.85" />
      </g>
    </svg>
  );
}

function Lantern({ side }: { side: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 44 110" width="44" height="110" className={`${styles.lantern} ${styles[side]}`}>
      <defs>
        <linearGradient id={`kandil-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB23E" />
          <stop offset="1" stopColor="#D8321E" />
        </linearGradient>
        <radialGradient id={`kandil-glow-${side}`}>
          <stop offset="0" stopColor="#FFF4C2" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFB23E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M22 0 V26" stroke="#7A4A12" strokeWidth="1" />
      <rect x="15" y="24" width="14" height="5" rx="1.5" fill="#B8860B" />
      <path d="M22 29 L41 54 L22 79 L3 54 Z" fill={`url(#kandil-${side})`} />
      <path d="M22 29 L22 79 M3 54 L41 54" stroke="#FFE08A" strokeWidth="0.8" opacity="0.8" />
      <ellipse cx="22" cy="54" rx="12" ry="14" fill={`url(#kandil-glow-${side})`} className={styles.lanternGlow} />
      {[12, 17, 22, 27, 32].map((x) => (
        <path key={x} d={`M22 79 L${x} 104`} stroke="#FFC940" strokeWidth="0.9" />
      ))}
    </svg>
  );
}

/** One repeat of a data-driven garland: triangle bunting along a swag, with an emoji swinging from the middle. */
function DecorTile({ i, garland }: { i: number; garland: NonNullable<ThemeDecor['garland']> }) {
  const W = 110;
  const bunting = garland.bunting ?? [];
  const items = garland.items ?? [];
  const line = garland.string ?? (bunting.length ? '#6B5A4A' : '#8A6A3A');
  const flags = bunting.length ? [0.14, 0.32, 0.68, 0.86] : [];
  const mid = swag(0.5, W, 2, 20);
  const item = items.length ? items[i % items.length] : null;
  return (
    <svg viewBox="0 0 110 60" width={W} height="60" className={styles.tile}>
      <path d={`M0 2 Q${W / 2} 20 ${W} 2`} stroke={line} strokeWidth="1.2" fill="none" />
      {flags.map((t, k) => {
        const p = swag(t, W, 2, 20);
        const color = bunting[(i * flags.length + k) % bunting.length];
        return <path key={k} d={`M${p.x - 8} ${p.y - 1} L${p.x + 8} ${p.y - 1} L${p.x} ${p.y + 16} Z`} fill={color} stroke="rgba(0,0,0,0.12)" strokeWidth="0.6" />;
      })}
      {item && (
        <g className={styles.swing} style={{ transformOrigin: `${mid.x}px ${mid.y}px`, animationDelay: `${(i % 5) * 0.3}s` }}>
          <path d={`M${mid.x} ${mid.y} V${mid.y + 8}`} stroke={line} strokeWidth="0.9" />
          <text x={mid.x} y={mid.y + 22} fontSize="20" textAnchor="middle" dominantBaseline="central">
            {item}
          </text>
        </g>
      )}
    </svg>
  );
}

/** Seasonal garland hanging from the bottom edge of the navbar. */
export default function NavTrim({ season, decor }: { season: string; decor?: ThemeDecor }) {
  if (decor) {
    const garland = decor.garland;
    if (!garland) return null;
    return (
      <div className={`${styles.trim} ${styles.trimDecor}`} aria-hidden="true">
        <div className={styles.tiles}>
          {Array.from({ length: TILES }, (_, i) => (
            <DecorTile key={i} i={i} garland={garland} />
          ))}
        </div>
      </div>
    );
  }
  const Tile =
    season === 'christmas'
      ? ChristmasTile
      : season === 'diwali'
        ? DiwaliTile
        : season === 'valentine'
          ? ValentineTile
          : season === 'monsoon'
            ? MonsoonTile
            : null;
  if (!Tile) return null;

  return (
    <div className={`${styles.trim} ${styles[`trim_${season}`]}`} aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="trim-ice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#A9D6F5" stopOpacity="0.55" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.tiles}>
        {Array.from({ length: TILES }, (_, i) => (
          <Tile key={i} i={i} />
        ))}
      </div>
      {season === 'diwali' && (
        <>
          <Lantern side="left" />
          <Lantern side="right" />
        </>
      )}
    </div>
  );
}
