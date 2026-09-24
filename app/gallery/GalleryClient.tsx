'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import TiltCard from '@/components/motion/TiltCard';
import { isRemoteImage } from '@/lib/homeContent';
import styles from './gallery.module.css';

export type GalleryImage = { url: string; caption: string; group: string };

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GalleryClient({ images }: { images: GalleryImage[] }) {
  const reduceMotion = useReducedMotion();
  const groups = useMemo(() => ['All', ...Array.from(new Set(images.map((i) => i.group)))], [images]);
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const visible = useMemo(() => (filter === 'All' ? images : images.filter((i) => i.group === filter)), [images, filter]);

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      setOpen((i) => (i === null ? i : (i + delta + visible.length) % visible.length));
    },
    [visible.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  }

  const current = open !== null ? visible[open] : null;

  return (
    <>
      <div className={styles.filters} role="tablist" aria-label="Filter gallery">
        {groups.map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={filter === g}
            className={`${styles.filterPill} ${filter === g ? styles.filterActive : ''}`}
            onClick={() => setFilter(g)}
          >
            {filter === g && <motion.span layoutId="galleryFilter" className={styles.filterBg} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <span className={styles.filterLabel}>{g}</span>
          </button>
        ))}
      </div>

      <motion.div layout className={styles.masonryGrid}>
        <AnimatePresence mode="popLayout">
          {visible.map((img, i) => (
            <motion.div
              key={img.url}
              layout
              className={`${styles.galleryItem} ${i % 7 === 0 ? styles.feature : ''}`}
              style={{ transformPerspective: 1000 }}
              initial={reduceMotion ? false : { opacity: 0, rotateX: 35, y: 60, scale: 0.92 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: EASE }}
            >
              <TiltCard className={styles.tile} max={8}>
                <button type="button" className={styles.tileButton} onClick={() => { setDirection(0); setOpen(i); }} aria-label={`View ${img.caption}`}>
                  <Image
                    src={img.url}
                    alt={img.caption}
                    fill
                    sizes={i % 7 === 0 ? '(max-width: 600px) 100vw, 50vw' : '(max-width: 600px) 50vw, 25vw'}
                    className={styles.image}
                    unoptimized={isRemoteImage(img.url)}
                  />
                  <span className={styles.overlay}>
                    <span className={styles.overlayGroup}>{img.group}</span>
                    <span className={styles.overlayCaption}>{img.caption}</span>
                    <Maximize2 size={16} className={styles.overlayIcon} />
                  </span>
                </button>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={current.caption}
          >
            <button className={`${styles.lbBtn} ${styles.lbClose}`} onClick={() => setOpen(null)} aria-label="Close">
              <X size={22} />
            </button>
            <button className={`${styles.lbBtn} ${styles.lbPrev}`} onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo">
              <ChevronLeft size={26} />
            </button>
            <button className={`${styles.lbBtn} ${styles.lbNext}`} onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo">
              <ChevronRight size={26} />
            </button>

            <div className={styles.lbStage} onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={current.url}
                  className={styles.lbFrame}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 160, rotateY: d * -35, scale: d === 0 ? 0.8 : 0.9 }),
                    center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
                    exit: (d: number) => ({ opacity: 0, x: d * -160, rotateY: d * 35, scale: 0.9 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: EASE }}
                  drag={visible.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={onDragEnd}
                >
                  <Image
                    src={current.url}
                    alt={current.caption}
                    fill
                    sizes="90vw"
                    style={{ objectFit: 'contain' }}
                    draggable={false}
                    unoptimized={isRemoteImage(current.url)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={styles.lbCaption} onClick={(e) => e.stopPropagation()}>
              <strong>{current.caption}</strong>
              <span>
                {open + 1} / {visible.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
