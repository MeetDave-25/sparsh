'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { isRemoteImage, type CraftContent } from '@/lib/homeContent';
import styles from './ArtOfCraft.module.css';

export default function ArtOfCraft({ content }: { content: CraftContent }) {
  return (
    <section id="art-of-craft" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <motion.div
          className={styles.imageCol}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          {content.mainImage && (
            <div className={styles.imageMain}>
              <Image
                src={content.mainImage}
                alt={content.mainAlt}
                fill
                sizes="(max-width: 900px) 90vw, 40vw"
                style={{ objectFit: 'cover' }}
                unoptimized={isRemoteImage(content.mainImage)}
              />
            </div>
          )}
          {content.accentImage && (
            <div className={styles.imageAccent}>
              <Image
                src={content.accentImage}
                alt={content.accentAlt}
                fill
                sizes="128px"
                style={{ objectFit: 'cover' }}
                unoptimized={isRemoteImage(content.accentImage)}
              />
            </div>
          )}
        </motion.div>

        <motion.div
          className={styles.textCol}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className={styles.eyebrow}>{content.eyebrow}</span>
          <h2 className={styles.heading}>
            {content.headingLead} {content.headingAccent && <em>{content.headingAccent}</em>}
          </h2>
          {content.paragraphs.map((p, i) => (
            <p key={i} className={styles.body}>{p}</p>
          ))}
          {content.linkLabel && (
            <Link href={content.linkHref || '/products'} className={styles.link}>
              {content.linkLabel}
              <ArrowRight size={16} />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
