'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { MessageCircle, Mail, Sparkles } from 'lucide-react';
import type { CustomOrderContent } from '@/lib/homeContent';
import styles from './CustomOrderCTA.module.css';

export default function CustomOrderCTA({ content }: { content: CustomOrderContent }) {
  return (
    <section className={styles.section}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={`container ${styles.inner}`}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>{content.badge}</span>
        </div>

        <h2 className={styles.title}>
          {content.titleLead}
          <br />
          <span className={styles.titleAccent}>{content.titleAccent}</span>
        </h2>

        <p className={styles.desc}>{content.description}</p>

        <div className={styles.steps}>
          {content.steps.map((step, i) => (
            <Fragment key={i}>
              {i > 0 && <div className={styles.stepLine} />}
              <div className={styles.step}>
                <div className={styles.stepNum}>{i + 1}</div>
                <p>{step}</p>
              </div>
            </Fragment>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/customize" className="btn btn-primary btn-lg" id="cta-customize-btn">
            <Sparkles size={18} />
            {content.primaryLabel}
          </Link>
          <a
            href="https://wa.me/918160901481"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-lg ${styles.whatsappBtn}`}
            id="cta-whatsapp-btn"
          >
            <MessageCircle size={18} />
            {content.whatsappLabel}
          </a>
          <a
            href="mailto:info@sparshdivineartstudio.com"
            className="btn btn-secondary btn-lg"
            id="cta-email-btn"
          >
            <Mail size={18} />
            {content.emailLabel}
          </a>
        </div>

        <p className={styles.note}>{content.note}</p>
      </div>
    </section>
  );
}
