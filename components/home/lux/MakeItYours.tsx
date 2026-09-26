'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Mail, MessageCircle } from 'lucide-react';
import type { CustomOrderContent } from '@/lib/homeContent';
import { getWhatsAppDirectURL } from '@/lib/whatsapp';
import LuxHeading from './LuxHeading';
import lux from './lux.module.css';
import styles from './MakeItYours.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function MakeItYours({ content }: { content: CustomOrderContent }) {
  const reduce = useReducedMotion();

  return (
    <section className={`${lux.section} ${styles.section}`}>
      <div className={lux.container}>
        <LuxHeading eyebrow={content.badge} lead="Make it" script="Yours" sub={content.description} center />

        <motion.ol
          className={styles.steps}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: '-15% 0px' }}
        >
          <motion.span
            className={styles.line}
            aria-hidden="true"
            variants={{
              hidden: { scaleX: reduce ? 1 : 0 },
              shown: { scaleX: 1, transition: { duration: 1.6, ease: EASE } },
            }}
          />
          {content.steps.map((step, i) => (
            <li key={i} className={styles.step}>
              <motion.span
                className={styles.num}
                variants={{
                  hidden: reduce ? { opacity: 1 } : { opacity: 0, scale: 0.8 },
                  shown: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.25 + i * 0.35, ease: EASE } },
                }}
              >
                {i + 1}
              </motion.span>
              <motion.span
                className={styles.label}
                variants={{
                  hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 12 },
                  shown: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.35 + i * 0.35, ease: EASE } },
                }}
              >
                {step}
              </motion.span>
            </li>
          ))}
        </motion.ol>

        <div className={styles.actions}>
          <Link href="/customize" className={lux.btnGlow}>
            {content.primaryLabel}
            <ArrowRight size={16} />
          </Link>
          <a href={getWhatsAppDirectURL()} target="_blank" rel="noopener noreferrer" className={lux.btnOutline}>
            <MessageCircle size={16} />
            {content.whatsappLabel}
          </a>
          <a href="mailto:info@sparshdivineartstudio.com" className={lux.btnOutline}>
            <Mail size={16} />
            {content.emailLabel}
          </a>
        </div>
        <p className={styles.note}>{content.note}</p>
      </div>
    </section>
  );
}
