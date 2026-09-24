'use client';

import { ArrowUpRight, Package, Sparkles, MessageCircle } from 'lucide-react';
import styles from '../admin.module.css';

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome back to your studio admin panel.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Sparkles size={24} /></div>
          <div>
            <h3>Total Products</h3>
            <div className={styles.statValue}>12</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--color-accent)' }}><Package size={24} /></div>
          <div>
            <h3>Categories</h3>
            <div className={styles.statValue}>5</div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2>Custom Orders Process</h2>
        <p className={styles.infoText}>
          Remember: When a customer fills out the Custom Order form, you will receive an email 
          at <strong>info@sparshdivineartstudio.com</strong>, and they will immediately be directed to chat 
          with you on your WhatsApp number <strong>(+91 8160901481)</strong>.
        </p>
        <p className={styles.infoText}>
          Keep an eye on WhatsApp for instant inquiries!
        </p>
        <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '16px' }}>
          <MessageCircle size={18} /> Open WhatsApp Web
        </a>
      </div>
    </div>
  );
}
