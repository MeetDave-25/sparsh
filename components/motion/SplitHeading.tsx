'use client';

import { motion, useReducedMotion } from 'framer-motion';
import styles from './motion.module.css';

type Props = {
  text: string;
  /** Optional second line shown in the gradient italic accent style. */
  accent?: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** Animate on mount (page headers) instead of when scrolled into view. */
  onMount?: boolean;
  delay?: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Words({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className={styles.wordMask} aria-hidden="true">
          <motion.span
            className={`${styles.word} ${className ?? ''}`}
            variants={{
              hidden: { y: '115%', rotateX: -70, opacity: 0 },
              visible: { y: '0%', rotateX: 0, opacity: 1, transition: { duration: 0.8, ease: EASE } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/** Headline whose words rise out of a mask one by one, tipping forward in 3D. */
export default function SplitHeading({ text, accent, as = 'h2', className, onMount, delay = 0 }: Props) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];
  const label = accent ? `${text} ${accent}` : text;

  if (reduceMotion) {
    const Plain = as;
    return (
      <Plain className={className}>
        {text}
        {accent && <span className={`${styles.accentLine} ${styles.accentText}`}>{accent}</span>}
      </Plain>
    );
  }

  const trigger = onMount ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once: true, amount: 0.5 } };

  return (
    <Tag
      className={className}
      aria-label={label}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      <Words text={text} />
      {accent && (
        <span className={styles.accentLine}>
          <Words text={accent} className={styles.accentText} />
        </span>
      )}
    </Tag>
  );
}
