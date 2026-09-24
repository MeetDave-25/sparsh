'use client';

import { useState, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import styles from './motion.module.css';

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
};

/**
 * Leans toward the pointer with a moving light glare. Only reacts to a mouse or pen,
 * so touch scrolling on phones is never hijacked.
 */
export default function TiltCard({ children, className, max = 10 }: Props) {
  const reduceMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), { stiffness: 200, damping: 20 });
  const gx = useTransform(px, [-0.5, 0.5], ['0%', '100%']);
  const gy = useTransform(py, [-0.5, 0.5], ['0%', '100%']);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.22), transparent 55%)`;

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={`${styles.tilt} ${className ?? ''}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType === 'touch') return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
        setHovering(true);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
        setHovering(false);
      }}
    >
      {children}
      <motion.span
        className={styles.glare}
        style={{ background: glare }}
        animate={{ opacity: hovering ? 1 : 0 }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
