'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { isRemoteImage } from '@/lib/homeContent';

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Image that unveils with a clip-path wipe, then drifts slower than the page as you scroll. */
export default function ParallaxImage({ src, alt, className, priority, sizes = '100vw' }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
      initial={reduceMotion ? false : { clipPath: 'inset(50% 50% 50% 50% round 32px)', opacity: 0.4 }}
      animate={{ clipPath: 'inset(0% 0% 0% 0% round 32px)', opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div style={reduceMotion ? { position: 'absolute', inset: 0 } : { position: 'absolute', inset: '-14% 0', y }}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} style={{ objectFit: 'cover' }} unoptimized={isRemoteImage(src)} />
      </motion.div>
    </motion.div>
  );
}
