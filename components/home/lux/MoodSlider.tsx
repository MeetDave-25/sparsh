'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './MoodSlider.module.css';

const SCENES = [
  { title: 'First Light', line: 'Mogra and morning tea', src: '/products/mogra-bloom.jpg', alt: 'SpArsh Mogra Bloom candle in soft morning light' },
  { title: 'Slow Evenings', line: 'Mocha, jasmine and a good book', src: '/story/mocha-wreath-fantasy.jpg', alt: 'SpArsh Mocha Coffee Latte candle wrapped in jasmine' },
  { title: 'Sea Breeze', line: 'Windows open, Wave lit', src: '/story/wave-wreath.jpg', alt: 'SpArsh Wave Sea Breeze candle in a floral wreath' },
  { title: 'Quiet Night', line: 'Lavender before sleep', src: '/products/lavender-calm.jpg', alt: 'SpArsh Lavender Calm candle beside fresh lavender' },
];

const INTERVAL = 5000;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function MoodSlider() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const playing = !reduce && !hovered && !hidden && onScreen;
  const scene = SCENES[index];

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % SCENES.length), INTERVAL);
    return () => clearTimeout(t);
  }, [playing, index]);

  return (
    <section
      ref={ref}
      className={styles.section}
      data-nav="dark"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-roledescription="carousel"
      aria-label="Candle moods"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={scene.src}
          className={styles.slide}
          initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2, ease: 'easeInOut' }, scale: { duration: 6, ease: 'easeOut' } }}
        >
          <Image src={scene.src} alt={scene.alt} fill sizes="100vw" style={{ objectFit: 'cover' }} />
        </motion.div>
      </AnimatePresence>
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.copy} aria-live="polite">
        <p className={styles.eyebrow}>A mood for every hour</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={scene.title}
            initial={{ opacity: 0, y: reduce ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -20 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2 className={styles.title}>{scene.title}</h2>
            <p className={styles.line}>{scene.line}</p>
          </motion.div>
        </AnimatePresence>
        <Link href="/products?category=candles" className={styles.cta}>
          Shop the mood
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className={styles.thumbs}>
        {SCENES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.title}`}
            aria-current={i === index}
          >
            <Image src={s.src} alt="" fill sizes="80px" style={{ objectFit: 'cover' }} />
            {i === index && playing && <span key={index} className={styles.timer} aria-hidden="true" />}
          </button>
        ))}
      </div>

      <p className={styles.count} aria-hidden="true">
        {String(index + 1).padStart(2, '0')} <span>/ {String(SCENES.length).padStart(2, '0')}</span>
      </p>
    </section>
  );
}
