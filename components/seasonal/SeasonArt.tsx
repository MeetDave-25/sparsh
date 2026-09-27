import type { CSSProperties } from 'react';
import type { ThemeDecor } from '@/lib/themes';
import styles from './Seasonal.module.css';

const HEART = 'M0,-0.2 C0,-0.45 -0.5,-0.5 -0.5,-0.15 C-0.5,0.1 -0.2,0.3 0,0.5 C0.2,0.3 0.5,0.1 0.5,-0.15 C0.5,-0.5 0,-0.45 0,-0.2 Z';

function ChristmasScene() {
  const ornaments = [
    [115, 62, '#E63946'], [136, 70, '#FFC940'], [109, 84, '#4DA3FF'], [142, 88, '#E63946'],
    [125, 77, '#FFFFFF'], [101, 100, '#FFC940'], [149, 100, '#4DA3FF'], [124, 96, '#E63946'],
  ] as const;
  return (
    <svg viewBox="0 0 180 124" className={styles.scene}>
      {/* Tree */}
      <rect x="120" y="102" width="10" height="12" fill="#6B4226" />
      <path d="M125 28 L98 70 H152 Z" fill="#1F6B3A" />
      <path d="M125 44 L93 90 H157 Z" fill="#23773F" />
      <path d="M125 60 L88 108 H162 Z" fill="#2A8048" />
      <path d="M98 70 Q110 66 125 70 Q140 66 152 70 M93 90 Q110 85 125 90 Q140 85 157 90" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9" />
      {ornaments.map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r="3.2" fill={c} className={styles.twinkle} style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
      <path
        d="M125 14 L128.5 22 L137 22.5 L130.5 28 L132.5 36 L125 31.5 L117.5 36 L119.5 28 L113 22.5 L121.5 22 Z"
        fill="#FFD34D"
        className={styles.star}
      />

      {/* Snowman */}
      <g className={styles.snowman}>
        <path d="M34 60 L14 46 M20 50 L14 52 M66 60 L84 44 M79 48 L86 50" stroke="#6B4226" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="50" cy="96" r="22" fill="#FFFFFF" stroke="#C9DAE8" strokeWidth="1.5" />
        <circle cx="50" cy="63" r="16" fill="#FFFFFF" stroke="#C9DAE8" strokeWidth="1.5" />
        <circle cx="50" cy="38" r="12" fill="#FFFFFF" stroke="#C9DAE8" strokeWidth="1.5" />
        <circle cx="46" cy="35" r="1.5" fill="#222" />
        <circle cx="54" cy="35" r="1.5" fill="#222" />
        <path d="M50 38 L63 40.5 L50 41.5 Z" fill="#F28C28" />
        <path d="M45 44 Q50 47 55 44" stroke="#222" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="58" r="1.9" fill="#333" />
        <circle cx="50" cy="66" r="1.9" fill="#333" />
        <circle cx="50" cy="90" r="1.9" fill="#333" />
        <rect x="37" y="47" width="26" height="6" rx="3" fill="#D62839" />
        <rect x="54" y="49" width="6" height="15" rx="2" fill="#B81F2F" />
        <rect x="35" y="25" width="30" height="4" rx="1" fill="#1E1E1E" />
        <rect x="41" y="8" width="18" height="18" rx="1.5" fill="#1E1E1E" />
        <rect x="41" y="20" width="18" height="4" fill="#D62839" />
      </g>

      {/* Snow ground */}
      <path d="M0 124 V112 Q30 102 62 110 Q100 100 132 111 Q160 104 180 110 V124 Z" fill="#FFFFFF" stroke="#D5E4EF" strokeWidth="1" />
    </svg>
  );
}

function Diya({ x, delay }: { x: number; delay: number }) {
  return (
    <g transform={`translate(${x} 62)`}>
      <ellipse cx="0" cy="-26" rx="14" ry="18" fill="url(#diya-glow)" className={styles.flameGlow} style={{ animationDelay: `${delay}s` }} />
      <path d="M0 -30 C7 -19 7 -10 0 -5 C-7 -10 -7 -19 0 -30 Z" fill="url(#diya-flame)" className={styles.flame} style={{ animationDelay: `${delay}s` }} />
      <path d="M0 -20 C3 -14 3 -10 0 -7 C-3 -10 -3 -14 0 -20 Z" fill="#FFF6D0" />
      <path d="M-24 -4 Q0 20 24 -4 Z" fill="#B5541C" />
      <path d="M-24 -4 Q0 4 24 -4" stroke="#7A3510" strokeWidth="1.6" fill="none" />
      <path d="M-18 3 Q0 14 18 3" stroke="#F2B633" strokeWidth="1.2" strokeDasharray="1.5 3" fill="none" />
    </g>
  );
}

function DiwaliScene() {
  return (
    <svg viewBox="0 0 180 80" className={styles.scene}>
      <defs>
        <linearGradient id="diya-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FF6A00" />
          <stop offset="0.6" stopColor="#FFB000" />
          <stop offset="1" stopColor="#FFE680" />
        </linearGradient>
        <radialGradient id="diya-glow">
          <stop offset="0" stopColor="#FFD166" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FF8A00" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Rangoli beneath the diyas */}
      <g transform="translate(90 72)" opacity="0.9">
        <ellipse rx="86" ry="7" fill="#FF6B35" opacity="0.35" />
        <ellipse rx="64" ry="5" fill="#FFC21A" opacity="0.5" />
        <ellipse rx="40" ry="3" fill="#E63973" opacity="0.5" />
      </g>
      <Diya x={34} delay={0} />
      <Diya x={90} delay={0.4} />
      <Diya x={146} delay={0.8} />
    </svg>
  );
}

function ValentineScene() {
  const balloons = [
    [32, 40, 34, '#E63956', 0],
    [66, 26, 40, '#FF7A9A', 0.6],
    [92, 54, 30, '#C9184A', 1.2],
  ] as const;
  return (
    <svg viewBox="0 0 120 150" className={styles.scene}>
      {balloons.map(([x, y, s, c, d]) => (
        <g key={c} className={styles.balloon} style={{ animationDelay: `${d}s` }}>
          <path d={`M${x} ${y + s * 0.5} Q${x + 6} ${(y + 146) / 2} 62 146`} stroke="#B85A6E" strokeWidth="0.9" fill="none" />
          <path d={HEART} transform={`translate(${x} ${y}) scale(${s})`} fill={c} />
          <ellipse cx={x - s * 0.18} cy={y - s * 0.12} rx={s * 0.07} ry={s * 0.11} fill="#fff" opacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

function MonsoonScene() {
  return (
    <svg viewBox="0 0 160 90" className={styles.scene}>
      <g className={styles.boat}>
        <path d="M38 58 L122 58 L108 74 L52 74 Z" fill="#FFFFFF" stroke="#9BB8C6" strokeWidth="1" />
        <path d="M80 22 L100 58 H60 Z" fill="#F4F8FA" stroke="#9BB8C6" strokeWidth="1" />
        <path d="M80 22 L80 58" stroke="#C7D8E0" strokeWidth="1" />
      </g>
      <path className={styles.wave} d="M0 76 Q20 68 40 76 T80 76 T120 76 T160 76 T200 76 V90 H0 Z" fill="#4A90A4" opacity="0.75" />
      <path className={styles.wave2} d="M0 80 Q20 74 40 80 T80 80 T120 80 T160 80 T200 80 V90 H0 Z" fill="#2E6B7D" opacity="0.8" />
    </svg>
  );
}

/** A small festive vignette fixed to the bottom-left corner of every page. */
export function SeasonScene({ season, decor }: { season: string; decor?: ThemeDecor }) {
  if (decor) {
    if (!decor.corner?.length) return null;
    return (
      <div className={`${styles.corner} ${styles.cornerEmoji}`}>
        {decor.corner.map((e, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.45}s` }}>
            {e}
          </span>
        ))}
      </div>
    );
  }
  const Scene =
    season === 'christmas'
      ? ChristmasScene
      : season === 'diwali'
        ? DiwaliScene
        : season === 'valentine'
          ? ValentineScene
          : season === 'monsoon'
            ? MonsoonScene
            : null;
  if (!Scene) return null;
  return (
    <div className={`${styles.corner} ${styles[`corner_${season}`]}`}>
      <Scene />
    </div>
  );
}

/** Seasonal edge sitting on top of the footer: a snow drift or a row of lights. */
export function FooterTrim({ season, decor }: { season: string; decor?: ThemeDecor }) {
  if (decor?.footerLights?.length) {
    const colors = decor.footerLights;
    return (
      <div className={styles.footerLights} aria-hidden="true">
        {Array.from({ length: 40 }, (_, i) => {
          const c = colors[i % colors.length];
          return <span key={i} style={{ animationDelay: `${(i % 6) * 0.25}s`, background: c, boxShadow: `0 0 8px 2px ${c}` } as CSSProperties} />;
        })}
      </div>
    );
  }
  if (season === 'christmas' || decor?.footer === 'snow') {
    return (
      <svg className={styles.footerTrim} viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 40 V22 Q60 6 130 18 T270 16 T420 20 T560 12 T720 20 T880 14 T1030 20 T1200 12 V40 Z"
          fill="#FFFFFF"
        />
        <path
          d="M0 40 V30 Q80 20 170 28 T350 26 T540 30 T740 24 T940 30 T1200 24 V40 Z"
          fill="#E8F2FA"
        />
      </svg>
    );
  }
  if (season === 'diwali') {
    return (
      <div className={styles.footerLights} aria-hidden="true">
        {Array.from({ length: 40 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${(i % 6) * 0.25}s` }} />
        ))}
      </div>
    );
  }
  return null;
}
