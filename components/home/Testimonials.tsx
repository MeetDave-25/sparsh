'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { TestimonialsContent } from '@/lib/homeContent';
import styles from './Testimonials.module.css';



export default function Testimonials({ content }: { content: TestimonialsContent }) {
  const testimonials = content.items;
  const [current, setCurrent] = useState(0);

  if (testimonials.length === 0) return null;

  const prev = () => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(i => (i + 1) % testimonials.length);

  const visible = Array.from({ length: Math.min(3, testimonials.length) }, (_, k) => ({
    t: testimonials[(current + k) % testimonials.length],
    idx: (current + k) % testimonials.length,
  }));

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.heading}</h2>
          <div className="divider" />
          <p className="hindi-phrase">{content.tagline}</p>
        </div>

        <div className={styles.carousel}>
          {visible.map(({ t, idx }, i) => (
            <div
              key={idx}
              className={`${styles.card} ${i === 0 ? styles.active : ''}`}
            >
              <Quote size={32} className={styles.quoteIcon} />
              <div className={styles.stars}>
                {[...Array(t.rating)].map((_, si) => (
                  <Star key={si} size={14} fill="currentColor" className={styles.star} />
                ))}
              </div>
              <p className={styles.text}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{t.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.meta}>{t.location} · {t.product}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          <button onClick={prev} className={styles.controlBtn} aria-label="Previous testimonial" id="testimonial-prev">
            <ChevronLeft size={20} />
          </button>
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                id={`testimonial-dot-${i}`}
              />
            ))}
          </div>
          <button onClick={next} className={styles.controlBtn} aria-label="Next testimonial" id="testimonial-next">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
