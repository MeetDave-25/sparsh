'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { isRemoteImage, type ScentsContent } from '@/lib/homeContent';
import styles from './ScentCarousel3D.module.css';



export default function ScentCarousel3D({ content }: { content: ScentsContent }) {
  const scents = content.items;
  const STEP = 360 / Math.max(scents.length, 1);
  // Radius (in card widths) that keeps neighbouring cards from overlapping for any count
  const ringFactor = Math.max(0.6 / Math.tan(Math.PI / Math.max(scents.length, 3)), 0.6);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Snap to whole faces so the active scent always settles square to the viewer
  const targetRotation = useMotionValue(0);
  const rotation = useSpring(targetRotation, { stiffness: 70, damping: 16, mass: 0.8 });
  const ringTilt = useTransform(scrollYProgress, [0, 0.5, 1], [-8, -4, -8]);
  const introScale = useTransform(scrollYProgress, [0, 0.08], [0.85, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(scents.length - 1, Math.max(0, Math.round(v * (scents.length - 1))));
    setActive(idx);
    targetRotation.set(-STEP * idx);
  });

  if (scents.length === 0) return null;

  if (reduceMotion) {
    return (
      <section className={styles.staticSection}>
        <div className={styles.staticHeader}>
          <span className={styles.eyebrow}>{content.eyebrow}</span>
          <h2 className={styles.heading}>{content.heading}</h2>
        </div>
        <div className={styles.staticGrid}>
          {scents.map((s, i) => (
            <div key={i} className={styles.staticCard}>
              <div className={styles.cardImage}>
                {s.image && <Image src={s.image} alt={`SpArsh ${s.name} ${s.note} soy candle`} fill sizes="25vw" style={{ objectFit: 'cover' }} unoptimized={isRemoteImage(s.image)} />}
              </div>
              <p className={styles.staticName}>{s.name} <em>{s.note}</em></p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const current = scents[active];

  return (
    <section ref={sectionRef} className={styles.section} style={{ height: `${scents.length * 60 + 100}vh` }}>
      <div className={styles.sticky}>
        <motion.div
          className={styles.tintGlow}
          animate={{ backgroundColor: current.tint || '#E8A0B4' }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
        />

        <div className={styles.layout}>
          {/* Copy panel, flips per scent */}
          <div className={styles.copy}>
            <span className={styles.eyebrow}>{content.eyebrow}</span>
            <h2 className={styles.heading}>{content.heading}</h2>

            <div className={styles.counter}>
              <span className={styles.counterNow}>{String(active + 1).padStart(2, '0')}</span>
              <span className={styles.counterTotal}>/ {String(scents.length).padStart(2, '0')}</span>
            </div>

            <div className={styles.flipStage}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, rotateX: -80, y: 20 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  exit={{ opacity: 0, rotateX: 80, y: -20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={styles.flipCard}
                >
                  <h3 className={styles.scentName}>
                    {current.name} <em>{current.note}</em>
                  </h3>
                  <p className={styles.scentDesc}>{current.desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <Link href={content.ctaHref || '/products'} className={styles.cta}>
              {content.ctaLabel} <ArrowRight size={16} />
            </Link>

            <div className={styles.progressTrack}>
              <motion.div className={styles.progressFill} style={{ width: progressWidth }} />
            </div>
          </div>

          {/* The 3D ring */}
          <div className={styles.scene} style={{ ['--ring-factor' as string]: ringFactor }}>
            <motion.div
              className={styles.ring}
              style={{ rotateY: rotation, rotateX: ringTilt, scale: introScale }}
            >
              {scents.map((s, i) => (
                <div
                  key={i}
                  className={`${styles.card} ${i === active ? styles.cardActive : ''}`}
                  style={{ ['--i' as string]: i, ['--step' as string]: `${STEP}deg` }}
                >
                  <div className={styles.cardImage}>
                    {s.image && <Image
                      src={s.image}
                      unoptimized={isRemoteImage(s.image)}
                      alt={`SpArsh ${s.name} ${s.note} soy candle`}
                      fill
                      sizes="(max-width: 900px) 40vw, 18vw"
                      style={{ objectFit: 'cover' }}
                    />}
                  </div>
                  <div className={styles.cardLabel}>{s.name}</div>
                </div>
              ))}
            </motion.div>
            <div className={styles.floorReflection} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">Scroll to explore</div>
      </div>
    </section>
  );
}
