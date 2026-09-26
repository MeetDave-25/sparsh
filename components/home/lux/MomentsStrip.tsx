'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LuxHeading from './LuxHeading';
import lux from './lux.module.css';
import styles from './MomentsStrip.module.css';

const MOMENTS = [
  { src: '/story/mocha-splash.jpg', title: 'The Pour', line: 'Mocha, cream and a slow morning', href: '/products?category=candles' },
  { src: '/products/blossom-3.jpg', title: 'Wreathed in Bloom', line: 'Blossom, framed in flowers', href: '/products?category=candles' },
  { src: '/story/blossom-ad-card.jpg', title: 'Gifting, Dil Se', line: 'Wrapped by hand, sent with love', href: '/products?category=hampers' },
  { src: '/story/wave-wreath-fantasy.jpg', title: 'Sea & Sky', line: 'Wave Sea Breeze, lit at dusk', href: '/products?category=candles' },
  { src: '/story/scents-that-stay-1.jpg', title: 'Scents That Stay', line: 'Long after the flame is out', href: '/about' },
  { src: '/products/lavender-calm.jpg', title: 'Quiet Hours', line: 'Lavender Calm before sleep', href: '/products?category=candles' },
];

export default function MomentsStrip() {
  const [active, setActive] = useState(0);

  return (
    <section className={`${lux.section} ${styles.section}`}>
      <div className={lux.container}>
        <LuxHeading eyebrow="From the studio" lead="Moments with" script="Sparsh" />
      </div>

      <div className={styles.strip}>
        {MOMENTS.map((m, i) => {
          const isActive = i === active;
          return (
            <Link
              key={m.title}
              href={m.href}
              className={`${styles.panel} ${isActive ? styles.active : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={(e) => {
                // First tap on a touch screen opens the panel; the second follows the link.
                if (!isActive) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              aria-label={`${m.title} — ${m.line}`}
            >
              <Image src={m.src} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
              <span className={styles.shade} aria-hidden="true" />
              <span className={styles.vertical} aria-hidden="true">
                {m.title}
              </span>
              <span className={styles.caption} aria-hidden="true">
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.title}>{m.title}</span>
                <span className={styles.line}>{m.line}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
