'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { isRemoteImage, type Chapter as ChapterData, type JourneyContent } from '@/lib/homeContent';
import styles from './ScentJourney.module.css';

const wordContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const word = {
  hidden: { y: '110%', rotateX: -60, opacity: 0 },
  visible: {
    y: '0%',
    rotateX: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function Chapter({ ch, reverse }: { ch: ChapterData; reverse: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  const dir = reverse ? -1 : 1;
  const rotateY = useTransform(p, [0, 1], [38 * dir, 0]);
  const rotateX = useTransform(p, [0, 1], [18, 0]);
  const z = useTransform(p, [0, 1], [-260, 0]);
  const scale = useTransform(p, [0, 1], [0.78, 1]);
  const clip = useTransform(p, [0, 0.8], ['inset(100% 0% 0% 0% round 32px)', 'inset(0% 0% 0% 0% round 32px)']);
  const imgY = useTransform(p, [0, 1], ['-12%', '0%']);
  const imgScale = useTransform(p, [0, 1], [1.35, 1.05]);

  return (
    <div ref={ref} className={`${styles.chapter} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.imageCol}>
        <motion.div
          className={styles.frame3d}
          style={reduceMotion ? undefined : { rotateY, rotateX, z, scale }}
        >
          <motion.div className={styles.frame} style={reduceMotion ? undefined : { clipPath: clip }}>
            <motion.div
              className={styles.frameInner}
              style={reduceMotion ? undefined : { y: imgY, scale: imgScale }}
            >
              {ch.image && (
                <Image
                  src={ch.image}
                  alt={ch.alt}
                  fill
                  sizes="(max-width: 900px) 80vw, 30vw"
                  style={{ objectFit: 'cover' }}
                  unoptimized={isRemoteImage(ch.image)}
                />
              )}
            </motion.div>
          </motion.div>
          <div className={styles.frameEdge} aria-hidden="true" />
        </motion.div>
        <div className={styles.frameGlow} aria-hidden="true" />
      </div>

      <motion.div
        className={styles.textCol}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.span
          className={styles.chapterEyebrow}
          variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
        >
          {ch.eyebrow}
        </motion.span>

        <motion.h3 className={styles.chapterTitle} variants={wordContainer} aria-label={ch.title}>
          {ch.title.split(' ').map((w, i) => (
            <span key={i} className={styles.wordMask} aria-hidden="true">
              <motion.span className={styles.word} variants={word}>
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h3>

        <motion.p
          className={styles.chapterBody}
          variants={{ hidden: { opacity: 0, y: 24, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, delay: 0.35 } } }}
        >
          {ch.body}
        </motion.p>

        {ch.ctaLabel && (
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.55 } } }}
          >
            <Link href={ch.ctaHref || '/products'} className={styles.chapterLink}>
              {ch.ctaLabel}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function ScentJourney({ content }: { content: JourneyContent }) {
  if (content.chapters.length === 0) return null;

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.header}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={wordContainer}
      >
        <motion.span
          className={styles.eyebrow}
          variants={{ hidden: { opacity: 0, letterSpacing: '0.6em' }, visible: { opacity: 1, letterSpacing: '0.2em', transition: { duration: 0.9 } } }}
        >
          {content.eyebrow}
        </motion.span>
        <h2 className={styles.heading} aria-label={content.heading}>
          {content.heading.split(' ').map((w, i) => (
            <span key={i} className={styles.wordMask} aria-hidden="true">
              <motion.span className={styles.word} variants={word}>
                {w}
              </motion.span>
            </span>
          ))}
        </h2>
      </motion.div>

      {content.chapters.map((ch, i) => (
        <Chapter key={i} ch={ch} reverse={i % 2 === 1} />
      ))}
    </section>
  );
}
