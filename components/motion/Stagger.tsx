'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { revealVariants, type RevealVariant } from './Reveal';

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Seconds between each child starting. */
  gap?: number;
  amount?: number;
};

/** Reveals its StaggerItem children one after another as the group scrolls into view. */
export function Stagger({ children, className, gap = 0.1, amount = 0.15 }: StaggerProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = 'flip',
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} style={{ transformPerspective: 1000 }} variants={revealVariants(variant, 0, 0.8)}>
      {children}
    </motion.div>
  );
}
