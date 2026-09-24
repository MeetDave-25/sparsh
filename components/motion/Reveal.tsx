'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

export type RevealVariant = 'up' | 'left' | 'right' | 'flip' | 'zoom';

const EASE = [0.22, 1, 0.36, 1] as const;

// Each variant starts tilted away in 3D space and settles flat, so content feels like it swings into place.
const FROM: Record<RevealVariant, Record<string, number | string>> = {
  up: { opacity: 0, y: 48, rotateX: 18, filter: 'blur(6px)' },
  left: { opacity: 0, x: -60, rotateY: 22, filter: 'blur(6px)' },
  right: { opacity: 0, x: 60, rotateY: -22, filter: 'blur(6px)' },
  flip: { opacity: 0, y: 30, rotateX: 70, filter: 'blur(4px)' },
  zoom: { opacity: 0, scale: 0.86, filter: 'blur(10px)' },
};

const TO = { opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1, filter: 'blur(0px)' };

export function revealVariants(variant: RevealVariant = 'up', delay = 0, duration = 0.9): Variants {
  return {
    hidden: FROM[variant],
    visible: { ...TO, transition: { duration, delay, ease: EASE } },
  };
}

type Props = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
};

export default function Reveal({ children, variant = 'up', delay = 0, className, amount = 0.25 }: Props) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1200 }}
      variants={revealVariants(variant, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
