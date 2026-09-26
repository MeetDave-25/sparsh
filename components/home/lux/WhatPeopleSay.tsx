'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { TestimonialsContent } from '@/lib/homeContent';
import lux from './lux.module.css';
import styles from './WhatPeopleSay.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WhatPeopleSay({ content }: { content: TestimonialsContent }) {
  const reduce = useReducedMotion();
  const reviews = content.items.slice(0, 3);
  const rowRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const row = rowRef.current;
    if (!row) return;
    const card = row.children[0] as HTMLElement | undefined;
    if (!card) return;
    setActive(Math.round(row.scrollLeft / (card.offsetWidth + 16)));
  }

  function goTo(i: number) {
    const row = rowRef.current;
    const card = row?.children[i] as HTMLElement | undefined;
    if (row && card) row.scrollTo({ left: card.offsetLeft - row.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <section className={`${lux.section} ${styles.section}`}>
      <div className={lux.container}>
        <div className={styles.head}>
          <p className={lux.eyebrow}>{content.eyebrow}</p>
          <div className={styles.echoWrap}>
            <motion.h2
              className={styles.title}
              initial={reduce ? { opacity: 1 } : { opacity: 0, filter: 'blur(12px)', y: 18 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              What People <span className={lux.script}>Say</span>
            </motion.h2>
            <p className={`${styles.title} ${styles.echo}`} aria-hidden="true">
              What People <span className={lux.script}>Say</span>
            </p>
          </div>
          <p className={styles.tagline}>{content.tagline}</p>
        </div>

        <ul ref={rowRef} className={styles.row} onScroll={onScroll}>
          {reviews.map((r, i) => (
            <motion.li
              key={r.name}
              className={styles.card}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            >
              <span className={styles.quote} aria-hidden="true">“</span>
              <div className={styles.stars} aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, s) => (
                  <Star key={s} size={15} fill={s < r.rating ? 'currentColor' : 'none'} aria-hidden="true" />
                ))}
              </div>
              <p className={styles.text}>{r.text}</p>
              <div className={styles.person}>
                <span className={styles.avatar} aria-hidden="true">
                  {r.name.charAt(0)}
                </span>
                <span>
                  <span className={styles.name}>{r.name}</span>
                  <span className={styles.meta}>
                    {r.location} · {r.product}
                  </span>
                </span>
              </div>
            </motion.li>
          ))}
        </ul>

        <div className={styles.dots}>
          {reviews.map((r, i) => (
            <button
              key={r.name}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Show review from ${r.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
