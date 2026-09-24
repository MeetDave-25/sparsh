'use client';

import { useRef, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SplitHeading from '@/components/motion/SplitHeading';
import TiltCard from '@/components/motion/TiltCard';
import { isRemoteImage } from '@/lib/homeContent';
import styles from './PageHero.module.css';

type Props = {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: ReactNode;
  /** Optional floating showcase image on the right. */
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  compact?: boolean;
};

// Fixed positions (not random) so server and client render identically.
const PARTICLES = [
  { left: '8%', size: 4, delay: 0, dur: 11 },
  { left: '18%', size: 3, delay: 3, dur: 14 },
  { left: '29%', size: 5, delay: 6, dur: 12 },
  { left: '41%', size: 3, delay: 1.5, dur: 16 },
  { left: '52%', size: 4, delay: 8, dur: 13 },
  { left: '63%', size: 3, delay: 4, dur: 15 },
  { left: '74%', size: 5, delay: 2, dur: 12 },
  { left: '85%', size: 3, delay: 7, dur: 14 },
  { left: '93%', size: 4, delay: 5, dur: 11 },
];

export default function PageHero({ eyebrow, title, accent, subtitle, image, imageAlt = '', children, compact }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const cardTilt = useTransform(scrollYProgress, [0, 1], [0, 16]);

  return (
    <section ref={ref} className={`${styles.hero} ${compact ? styles.compact : ''} ${image ? styles.withImage : ''}`}>
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.ridge} aria-hidden="true" />
      <div className={styles.particles} aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            style={{ left: p.left, width: p.size, height: p.size, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}
          />
        ))}
      </div>

      <div className={styles.inner}>
        <motion.div className={styles.text} style={reduceMotion ? undefined : { y: textY, opacity: fade }}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 12, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.2em' }}
            transition={{ duration: 0.9 }}
          >
            <Sparkles size={12} /> {eyebrow}
          </motion.span>
          <SplitHeading as="h1" text={title} accent={accent} className={styles.title} onMount delay={0.15} />
          {subtitle && (
            <motion.div
              className={styles.subtitle}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              {subtitle}
            </motion.div>
          )}
          {children && (
            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>

        {image && (
          <motion.div
            className={styles.visual}
            style={reduceMotion ? undefined : { y: cardY, rotateX: cardTilt }}
            initial={{ opacity: 0, rotateY: -50, scale: 0.8, z: -200 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }}
            transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className={styles.floater}
              animate={reduceMotion ? undefined : { y: [0, -12, 0], rotateZ: [2, -1, 2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TiltCard className={styles.card} max={12}>
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 900px) 60vw, 30vw"
                  style={{ objectFit: 'cover' }}
                  unoptimized={isRemoteImage(image)}
                />
              </TiltCard>
            </motion.div>
            <div className={styles.cardGlow} aria-hidden="true" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
