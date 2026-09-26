'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { isRemoteImage, type CategoriesContent } from '@/lib/homeContent';
import LuxHeading from './LuxHeading';
import lux from './lux.module.css';
import styles from './CollectionArches.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CollectionArches({ content }: { content: CategoriesContent }) {
  const reduce = useReducedMotion();
  // Remote collection photos are admin-editable links and can die; show a styled panel instead of a broken image.
  const [failed, setFailed] = useState<Record<string, true>>({});

  return (
    <section className={`${lux.section} ${styles.section}`}>
      <div className={lux.container}>
        <LuxHeading eyebrow={content.eyebrow} lead="Shop by" script="Collection" sub={content.subtitle} center />

        <motion.ul
          className={styles.row}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ staggerChildren: 0.08 }}
        >
          {content.items.map((item) => (
            <motion.li
              key={item.slug}
              className={styles.item}
              variants={{
                hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 40 },
                shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }}
            >
              <Link href={`/products?category=${item.slug}`} className={styles.card}>
                <span className={styles.arch}>
                  <span className={styles.photo}>
                    {item.image && !failed[item.slug] ? (
                      <Image
                        src={item.image}
                        alt={`SpArsh ${item.name}`}
                        fill
                        sizes="(max-width: 768px) 62vw, 20vw"
                        unoptimized={isRemoteImage(item.image)}
                        style={{ objectFit: 'cover' }}
                        onError={() => setFailed((f) => ({ ...f, [item.slug]: true }))}
                      />
                    ) : (
                      <span className={styles.placeholder} aria-hidden="true">
                        <span className={styles.placeholderMark}>{item.hindi.charAt(0)}</span>
                      </span>
                    )}
                  </span>
                </span>
                <span className={styles.hindi}>{item.hindi}</span>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.desc}>{item.desc}</span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
