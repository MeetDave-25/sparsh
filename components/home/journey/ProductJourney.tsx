'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { ArrowRight, ChevronDown, Flame, Hourglass, Leaf, Sparkles } from 'lucide-react';
import type { CraftContent, HeroContent, ScentsContent } from '@/lib/homeContent';
import styles from './ProductJourney.module.css';

const PetalField = dynamic(() => import('../hero3d/PetalField'), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;

// Transparent studio cut-outs; the journey jar and the scent finale are built from these.
const JARS = [
  { key: 'Blossom', src: '/products/cutouts/blossom.png', glow: '#F3A6BE', bg: '#3A0F1E', fallbackNote: 'Flower Bouquet', fallbackDesc: 'Rose, peony and baby’s breath, soft as a first bouquet.' },
  { key: 'White Musk', src: '/products/cutouts/white-musk.png', glow: '#9CCFEA', bg: '#0E2230', fallbackNote: 'Pure', fallbackDesc: 'Clean musk and white florals, like fresh linen.' },
  { key: 'Lemon', src: '/products/cutouts/lemon.png', glow: '#F4E37C', bg: '#272008', fallbackNote: 'Fresh', fallbackDesc: 'Zesty lemon peel and green leaves. Pure sunshine.' },
  { key: 'Glow', src: '/products/cutouts/glow.png', glow: '#F5B97E', bg: '#2E1508', fallbackNote: 'Summer Breeze', fallbackDesc: 'Frangipani, peach and golden-hour warmth.' },
];

const FEATURES = [
  { icon: Leaf, title: '100% soy wax', body: 'Clean-burning, plant-based wax. No paraffin, ever.' },
  { icon: Flame, title: 'Cotton wick', body: 'Lead-free cotton for a calm, even flame.' },
  { icon: Hourglass, title: '40+ hour burn', body: 'Weeks of slow evenings from a single jar.' },
  { icon: Sparkles, title: 'Skin-safe fragrance', body: 'Premium oils, blended in small batches.' },
];

// Base render size of the floating jar; each anchor scales it to fit.
const BASE_W = 420;
const BASE_H = 508;

type Props = { hero: HeroContent; craft: CraftContent; scents: ScentsContent };

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ProductJourney({ hero, craft, scents }: Props) {
  const reduce = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [scent, setScent] = useState(0);
  const [shown, setShown] = useState(0);
  const [ready, setReady] = useState(false);
  const [lite] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia('(max-width: 768px)').matches || (navigator.hardwareConcurrency || 8) <= 4),
  );

  const details = JARS.map((jar) => {
    const item = scents.items.find((s) => s.name.toLowerCase() === jar.key.toLowerCase());
    return { ...jar, note: item?.note ?? jar.fallbackNote, desc: item?.desc ?? jar.fallbackDesc };
  });
  const active = details[scent];

  // The finale pins for four steps; each step turns the jar to the next scent.
  const { scrollYProgress: finaleProgress } = useScroll({ target: finaleRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(finaleProgress, 'change', (v) => {
    progressRef.current = v;
    const next = Math.min(JARS.length - 1, Math.max(0, Math.floor(v * JARS.length * 0.999)));
    setScent((s) => (s === next ? s : next));
  });

  // Turntable squash, swapping the label at the thinnest point.
  useEffect(() => {
    if (scent === shown) return;
    const spin = spinRef.current;
    if (reduce || !spin) {
      const t = setTimeout(() => setShown(scent), 0);
      return () => clearTimeout(t);
    }
    spin.animate(
      [
        { transform: 'scaleX(1)', filter: 'brightness(1)' },
        { transform: 'scaleX(0.04)', filter: 'brightness(1.6)' },
        { transform: 'scaleX(1)', filter: 'brightness(1)' },
      ],
      { duration: 720, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
    );
    const t = setTimeout(() => setShown(scent), 360);
    return () => clearTimeout(t);
  }, [scent, shown, reduce]);

  useEffect(() => {
    layerRef.current?.style.setProperty('--jar-glow', JARS[scent].glow);
  }, [scent]);

  // The flight: every frame, place the jar between the two anchors that
  // straddle the middle of the screen, eased and spring-smoothed.
  useEffect(() => {
    if (reduce) return;
    const layer = layerRef.current;
    const box = boxRef.current;
    const tilt = tiltRef.current;
    const glow = glowRef.current;
    const shadow = shadowRef.current;
    if (!layer || !box || !tilt || !glow || !shadow) return;

    const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-jar-anchor]'));
    const cur = { x: 0, y: 0, s: 1, r: 0, glow: 0, shadow: 0 };
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    let first = true;
    let raf = 0;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const read = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        s: Math.min(rect.width / BASE_W, rect.height / BASE_H),
        r: Number(el.dataset.jarRotate || 0),
        glow: Number(el.dataset.jarGlow || 0),
        shadow: Number(el.dataset.jarShadow || 0),
      };
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const focal = window.innerHeight * 0.5;
      const pts = anchors.map(read);
      if (pts.length === 0) return;

      let target = pts[0];
      if (pts[pts.length - 1].y <= focal) target = pts[pts.length - 1];
      else if (pts[0].y < focal) {
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          if (a.y <= focal && b.y > focal) {
            const k = easeInOut((focal - a.y) / (b.y - a.y));
            target = {
              x: a.x + (b.x - a.x) * k,
              y: a.y + (b.y - a.y) * k,
              s: a.s + (b.s - a.s) * k,
              r: a.r + (b.r - a.r) * k,
              glow: a.glow + (b.glow - a.glow) * k,
              shadow: a.shadow + (b.shadow - a.shadow) * k,
            };
            break;
          }
        }
      }

      const f = first ? 1 : 1 - Math.exp(-dt * 9);
      first = false;
      cur.x += (target.x - cur.x) * f;
      cur.y += (target.y - cur.y) * f;
      cur.s += (target.s - cur.s) * f;
      cur.r += (target.r - cur.r) * f;
      cur.glow += (target.glow - cur.glow) * f;
      cur.shadow += (target.shadow - cur.shadow) * f;

      const pf = 1 - Math.exp(-dt * 4);
      pointer.sx += (pointer.x - pointer.sx) * pf;
      pointer.sy += (pointer.y - pointer.sy) * pf;

      const bob = Math.sin(now / 900) * 7 * cur.s;
      box.style.transform = `translate3d(${cur.x - BASE_W / 2}px, ${cur.y - BASE_H / 2 + bob}px, 0) scale(${cur.s}) rotate(${cur.r}deg)`;
      tilt.style.transform = `rotateY(${pointer.sx * 12}deg) rotateX(${-pointer.sy * 7}deg)`;
      glow.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%) scale(${cur.s})`;
      glow.style.opacity = String(cur.glow);
      shadow.style.transform = `translate3d(${cur.x}px, ${cur.y + (BASE_H / 2) * cur.s * 0.96}px, 0) translate(-50%, -50%) scale(${cur.s * (1 - bob / 400)})`;
      shadow.style.opacity = String(cur.shadow);
    };

    raf = requestAnimationFrame((t) => {
      last = t;
      loop(t);
      setReady(true);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduce]);

  const staticJar = (src: string, alt: string) =>
    reduce ? <Image src={src} alt={alt} fill sizes="40vw" style={{ objectFit: 'contain' }} /> : null;

  function goToScent(i: number) {
    const el = finaleRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / JARS.length), behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <div className={styles.journey}>
      {/* ---------------- The floating jar ---------------- */}
      {!reduce && (
        <div ref={layerRef} className={`${styles.layer} ${ready ? styles.layerReady : ''}`} aria-hidden="true">
          <div ref={glowRef} className={styles.glow} />
          <div ref={shadowRef} className={styles.shadow} />
          <div ref={boxRef} className={styles.box} style={{ width: BASE_W, height: BASE_H }}>
            <div ref={tiltRef} className={styles.tilt}>
              <div ref={spinRef} className={styles.spin}>
                {JARS.map((jar, i) => (
                  <Image
                    key={jar.key}
                    src={jar.src}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 70vw, 460px"
                    className={`${styles.jarImg} ${i === shown ? styles.jarShown : ''}`}
                    style={{ objectFit: 'contain' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 1. Hero ---------------- */}
      <section className={styles.hero} data-nav="dark">
        {!reduce && (
          <div className={styles.petals} aria-hidden="true">
            <PetalField progress={progressRef} active lite={lite} />
          </div>
        )}
        <p className={styles.giantWord} aria-hidden="true">
          SpArsh
        </p>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            >
              {hero.eyebrow}
            </motion.p>
            <h1 className={styles.heroTitle}>
              <span className={styles.mask}>
                <motion.span
                  className={styles.titleSerif}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                >
                  {hero.titleLine1}
                </motion.span>
              </span>
              <span className={`${styles.mask} ${styles.maskScript}`}>
                <motion.span
                  className={styles.titleScript}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, delay: 0.48, ease: EASE }}
                >
                  {hero.titleLine2}
                </motion.span>
              </span>
            </h1>
            <motion.p
              className={styles.heroSub}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            >
              {hero.subtitle}
            </motion.p>
            <motion.div
              className={styles.ctas}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            >
              <Link href={hero.ctaHref || '/products'} className={styles.btnGlow} id="hero-shop-btn">
                {hero.ctaLabel}
                <ArrowRight size={16} />
              </Link>
              {hero.secondaryLabel && (
                <Link href={hero.secondaryHref || '/customize'} className={styles.btnGhost} id="hero-customize-btn">
                  {hero.secondaryLabel}
                </Link>
              )}
            </motion.div>
            <motion.ul
              className={styles.trust}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.05 }}
            >
              {hero.trust.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </motion.ul>
          </div>

          <div className={styles.heroStage}>
            <div className={styles.anchorHero} data-jar-anchor data-jar-rotate="-5" data-jar-glow="1" data-jar-shadow="0.55">
              {staticJar(JARS[0].src, 'SpArsh Blossom Flower Bouquet soy candle')}
            </div>
            <div className={styles.badge} aria-hidden="true">
              <svg viewBox="0 0 120 120">
                <defs>
                  <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                </defs>
                <text>
                  <textPath href="#badge-circle">HAND POURED ✦ 100% SOY ✦ DIL SE ✦</textPath>
                </text>
              </svg>
              <span>✦</span>
            </div>
            <p className={styles.tag}>
              <span>Blossom</span> Flower Bouquet
            </p>
          </div>
        </div>

        <div className={styles.cue} aria-hidden="true">
          <span>Scroll</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* ---------------- 2. The craft ---------------- */}
      <section className={styles.craft} data-nav="light">
        <div className={styles.craftGrid}>
          <div className={styles.archWrap}>
            <div className={styles.arch} aria-hidden="true" />
            <div className={styles.anchorCraft} data-jar-anchor data-jar-rotate="9" data-jar-glow="0" data-jar-shadow="1">
              {staticJar(JARS[0].src, 'SpArsh Blossom soy candle')}
            </div>
          </div>
          <motion.div
            className={styles.craftCopy}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 1, ease: EASE }}
          >
            <p className={styles.eyebrowDark}>{craft.eyebrow}</p>
            <h2 className={styles.heading}>
              {craft.headingLead} <span className={styles.script}>{craft.headingAccent}</span>
            </h2>
            {craft.paragraphs.map((p, i) => (
              <p key={i} className={styles.para}>
                {p}
              </p>
            ))}
            <Link href={craft.linkHref} className={styles.textLink}>
              {craft.linkLabel}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------------- 3. Features around the jar ---------------- */}
      <section className={styles.features} data-nav="light">
        <motion.h2
          className={`${styles.heading} ${styles.center}`}
          initial={reduce ? false : { opacity: 0, filter: 'blur(12px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          Made to <span className={styles.script}>Glow</span>
        </motion.h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                className={`${styles.feature} ${styles[`f${i}`]}`}
                initial={reduce ? false : { opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20% 0px' }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: EASE }}
              >
                <span className={styles.featureIcon}>
                  <Icon size={20} />
                </span>
                <span>
                  <span className={styles.featureTitle}>{f.title}</span>
                  <span className={styles.featureBody}>{f.body}</span>
                </span>
              </motion.div>
            );
          })}
          <div className={styles.plinthWrap}>
            <div className={styles.anchorFeature} data-jar-anchor data-jar-rotate="0" data-jar-glow="0" data-jar-shadow="1">
              {staticJar(JARS[0].src, 'SpArsh Blossom soy candle')}
            </div>
            <div className={styles.plinth} aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ---------------- 4. Scent finale (pinned) ---------------- */}
      <div ref={finaleRef} className={styles.finale}>
        <motion.section
          className={styles.finaleStage}
          data-nav="dark"
          animate={{ backgroundColor: active.bg }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={active.key}
              className={styles.finaleWord}
              aria-hidden="true"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {active.key}
            </motion.p>
          </AnimatePresence>

          <div className={styles.finaleGrid}>
            <div className={styles.finaleCopy} aria-live="polite">
              <p className={styles.eyebrow}>Signature scents</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.key}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className={styles.counter}>
                    <span>{String(scent + 1).padStart(2, '0')}</span> / {String(JARS.length).padStart(2, '0')}
                  </p>
                  <h2 className={styles.finaleName}>{active.key}</h2>
                  <p className={styles.finaleNote}>{active.note}</p>
                  <p className={styles.finaleDesc}>{active.desc}</p>
                </motion.div>
              </AnimatePresence>
              <Link href={scents.ctaHref || '/products?category=candles'} className={styles.btnGlow}>
                Shop this scent
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className={styles.anchorFinale} data-jar-anchor data-jar-rotate="0" data-jar-glow="1" data-jar-shadow="0.4">
              {reduce && (
                <Image src={details[scent].src} alt={`SpArsh ${active.key} soy candle`} fill sizes="40vw" style={{ objectFit: 'contain' }} />
              )}
            </div>

            <ol className={styles.scentList}>
              {details.map((d, i) => (
                <li key={d.key}>
                  <button
                    type="button"
                    className={`${styles.scentBtn} ${i === scent ? styles.scentBtnActive : ''}`}
                    onClick={() => goToScent(i)}
                    aria-current={i === scent}
                  >
                    <span className={styles.scentDot} style={{ background: d.glow }} />
                    {d.key}
                  </button>
                </li>
              ))}
              <li>
                <Link href={scents.ctaHref || '/products?category=candles'} className={styles.allScents}>
                  All 8 scents <ArrowRight size={14} />
                </Link>
              </li>
            </ol>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
