'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { isRemoteImage } from '@/lib/homeContent';
import styles from './product.module.css';

type Props = {
  images: string[];
  name: string;
  badges?: React.ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProductGallery({ images, name, badges }: Props) {
  const reduceMotion = useReducedMotion();
  const photos = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const markBroken = (url: string) => setBroken((prev) => new Set(prev).add(url));

  // Pointer position drives both the 3D tilt and the zoom origin
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), { stiffness: 180, damping: 20 });
  const originX = useTransform(px, (v) => `${v * 100}%`);
  const originY = useTransform(py, (v) => `${v * 100}%`);

  function show(next: number) {
    if (photos.length < 2) return;
    const wrapped = (next + photos.length) % photos.length;
    setDirection(next > index ? 1 : -1);
    setIndex(wrapped);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -50 || info.velocity.x < -400) show(index + 1);
    else if (info.offset.x > 50 || info.velocity.x > 400) show(index - 1);
  }

  if (photos.length === 0) {
    return (
      <div className={styles.imageGallery}>
        <div className={`${styles.mainImage} ${styles.noPhoto}`}>No photo yet</div>
      </div>
    );
  }

  return (
    <div className={styles.imageGallery}>
      <motion.div
        className={styles.mainStage}
        style={reduceMotion ? undefined : { rotateX: zoom ? 0 : rotateX, rotateY: zoom ? 0 : rotateY, transformPerspective: 1100 }}
        initial={reduceMotion ? false : { opacity: 0, rotateY: -35, scale: 0.9 }}
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
        onPointerMove={(e) => {
          if (e.pointerType === 'touch') return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
          setZoom(false);
        }}
      >
        <div className={styles.mainImage}>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={photos[index]}
              className={styles.slide}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, rotateY: d * 55, x: d * 80, scale: 0.92 }),
                center: { opacity: 1, rotateY: 0, x: 0, scale: 1 },
                exit: (d: number) => ({ opacity: 0, rotateY: d * -55, x: d * -80, scale: 0.92 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: EASE }}
              drag={photos.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={onDragEnd}
              onClick={() => setZoom((z) => !z)}
            >
              <motion.div
                className={styles.zoomLayer}
                style={{ originX, originY }}
                animate={{ scale: zoom ? 1.8 : 1 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {broken.has(photos[index]) ? (
                  <span className={styles.photoUnavailable}>
                    <ImageOff size={28} />
                    Photo unavailable
                  </span>
                ) : (
                <Image
                  src={photos[index]}
                  onError={() => markBroken(photos[index])}
                  alt={`${name} — photo ${index + 1} of ${photos.length}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  draggable={false}
                  unoptimized={isRemoteImage(photos[index])}
                />
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {badges && <div className={styles.badges}>{badges}</div>}

          {photos.length > 1 && (
            <>
              <button type="button" className={`${styles.navBtn} ${styles.navPrev}`} onClick={() => show(index - 1)} aria-label="Previous photo">
                <ChevronLeft size={20} />
              </button>
              <button type="button" className={`${styles.navBtn} ${styles.navNext}`} onClick={() => show(index + 1)} aria-label="Next photo">
                <ChevronRight size={20} />
              </button>
              <div className={styles.dots}>
                {photos.map((_, i) => (
                  <span key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
                ))}
              </div>
            </>
          )}
          <span className={styles.zoomHint}>{zoom ? 'Tap to zoom out' : 'Tap to zoom'}</span>
        </div>
      </motion.div>

      {photos.length > 1 && (
        <div className={styles.thumbnailGrid}>
          {photos.map((img, i) => (
            <button
              key={img + i}
              type="button"
              className={`${styles.thumbnail} ${i === index ? styles.thumbnailActive : ''}`}
              onClick={() => show(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
            >
              {broken.has(img) ? (
                <span className={styles.photoUnavailable}><ImageOff size={16} /></span>
              ) : (
                <Image src={img} alt="" fill sizes="96px" style={{ objectFit: 'cover' }} unoptimized={isRemoteImage(img)} onError={() => markBroken(img)} />
              )}
              {i === index && <motion.span layoutId="thumbRing" className={styles.thumbRing} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
