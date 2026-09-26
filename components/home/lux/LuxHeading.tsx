'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import styles from './lux.module.css';

type Props = {
  eyebrow?: string;
  lead: string;
  script?: string;
  tail?: string;
  sub?: ReactNode;
  center?: boolean;
  dark?: boolean;
  as?: 'h1' | 'h2';
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Serif heading with a single gold script accent word, revealed from blur. */
export default function LuxHeading({ eyebrow, lead, script, tail, sub, center, dark, as = 'h2' }: Props) {
  const reduce = useReducedMotion();
  const Tag = as === 'h1' ? motion.h1 : motion.h2;
  const hidden = reduce ? { opacity: 1 } : { opacity: 0, filter: 'blur(12px)', y: 18 };
  const shown = { opacity: 1, filter: 'blur(0px)', y: 0 };

  return (
    <div className={`${styles.headingWrap} ${center ? styles.center : ''} ${dark ? styles.dark : ''}`}>
      {eyebrow && (
        <motion.p
          className={styles.eyebrow}
          initial={hidden}
          whileInView={shown}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {eyebrow}
        </motion.p>
      )}
      <Tag
        className={styles.heading}
        initial={hidden}
        whileInView={shown}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
      >
        {lead}
        {script && (
          <>
            {' '}
            <span className={styles.script}>{script}</span>
          </>
        )}
        {tail && <> {tail}</>}
      </Tag>
      {sub && (
        <motion.p
          className={styles.sub}
          initial={hidden}
          whileInView={shown}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
