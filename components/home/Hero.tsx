'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Heart } from 'lucide-react';
import { isRemoteImage, type HeroContent } from '@/lib/homeContent';
import styles from './Hero.module.css';

const TRUST_ICONS = [Leaf, Heart];

export default function Hero({ content }: { content: HeroContent }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pointer-driven 3D tilt; values are -0.5..0.5 across the card
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [14, -14]), { stiffness: 150, damping: 18 });
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-18, 18]), { stiffness: 150, damping: 18 });
  const glareX = useTransform(px, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(py, [-0.5, 0.5], ['0%', '100%']);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.35), transparent 55%)`;
  const combinedTiltX = useTransform(() => tiltX.get() + scrollTilt.get());

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    px.set(0);
    py.set(0);
  }

  const lineReveal = {
    hidden: { y: '115%', rotateX: -50 },
    visible: (i: number) => ({
      y: '0%',
      rotateX: 0,
      transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section ref={sectionRef} className={styles.heroContainer}>
      <div className={styles.bgGradient} />
      <div className={styles.ridge} aria-hidden="true" />

      <div className={styles.heroGrid}>
        {/* Left: copy */}
        <motion.div
          className={styles.heroText}
          style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
        >
          <motion.div
            className={styles.heroEyebrow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={13} />
            <span>{content.eyebrow}</span>
          </motion.div>

          <h1 className={styles.heroTitle} aria-label={`${content.titleLine1} ${content.titleLine2}`}>
            {[content.titleLine1, content.titleLine2].filter(Boolean).map((line, i) => (
              <span key={i} className={styles.lineMask} aria-hidden="true">
                <motion.span
                  className={i === 0 ? styles.titleLine1 : styles.titleLine2}
                  custom={i}
                  variants={lineReveal}
                  initial="hidden"
                  animate="visible"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            className={styles.heroCTAs}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href={content.ctaHref || '/products'} className="btn btn-primary btn-lg" id="hero-shop-btn">
              {content.ctaLabel}
              <ArrowRight size={18} />
            </Link>
            {content.secondaryLabel && (
              <Link href={content.secondaryHref || '/customize'} className="btn btn-ghost btn-lg" id="hero-customize-btn">
                {content.secondaryLabel}
              </Link>
            )}
          </motion.div>

          <motion.div
            className={styles.trustRow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {content.trust.map((point, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <span key={i} className={styles.trustItem}>
                  {i > 0 && <span className={styles.trustDivider} />}
                  <span>
                    {Icon && <Icon size={14} />} {point}
                  </span>
                </span>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right: the floating showcase card */}
        <motion.div
          className={styles.heroVisual}
          style={reduceMotion ? undefined : { y: imageY }}
          initial={{ opacity: 0, scale: 0.7, rotateY: -60, rotateX: 20, z: -300 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0, z: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            className={styles.tiltLayer}
            style={reduceMotion ? undefined : { rotateX: combinedTiltX, rotateY: tiltY }}
          >
          <motion.div
            className={styles.cardShell}
            animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className={styles.visualCard}>
              <Image
                src={content.image || '/story/wave-wreath-fantasy.jpg'}
                alt={content.imageAlt}
                fill
                priority
                unoptimized={isRemoteImage(content.image)}
                sizes="(max-width: 1024px) 80vw, 40vw"
                style={{ objectFit: 'cover' }}
                className={styles.visualImage}
              />
              <motion.div className={styles.glare} style={{ background: glare }} aria-hidden="true" />
            </div>

            <motion.div
              className={`${styles.floatChip} ${styles.chipTop}`}
              initial={{ opacity: 0, x: -16, z: 70 }}
              animate={{ opacity: 1, x: 0, z: 70 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <span className={styles.dot} />
              {content.chipTop}
            </motion.div>

            <motion.div
              className={`${styles.floatChip} ${styles.chipBottom}`}
              initial={{ opacity: 0, x: 16, z: 90 }}
              animate={{ opacity: 1, x: 0, z: 90 }}
              transition={{ duration: 0.6, delay: 1.35 }}
            >
              <span className={styles.dot} />
              {content.chipBottom}
            </motion.div>
          </motion.div>
          </motion.div>

          <div className={styles.visualGlow} aria-hidden="true" />
        </motion.div>
      </div>

      {/* Soft horizon bridging into the next section */}
      <svg
        className={styles.cloudHorizon}
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,140 C120,80 220,180 340,120 C460,60 560,170 680,110 C800,50 900,160 1020,100 C1140,40 1260,150 1440,90 L1440,220 L0,220 Z" />
      </svg>
    </section>
  );
}
