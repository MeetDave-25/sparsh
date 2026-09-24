'use client';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Theme } from '@/lib/themes';
import { Check } from 'lucide-react';
import styles from '../admin.module.css';

export default function AdminThemes() {
  const { allThemes, activeTheme, setTheme } = useTheme();

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Seasonal Themes</h1>
        <p>Change the entire look and feel of the website with one click.</p>
      </div>

      <div className={styles.card}>
        <h2>Select Active Theme</h2>
        <p className={styles.infoText} style={{ marginBottom: '24px' }}>
          This changes the colors, homepage hero text, and announcement banner across the site instantly.
          Note: In this MVP, this change is saved to your local browser only. 
          To make it global for all users, you would update <code>data/themes.json</code> in the codebase.
        </p>

        <div className={styles.themesGrid}>
          {allThemes.map((theme: Theme) => {
            const isActive = activeTheme.id === theme.id;
            return (
              <div 
                key={theme.id}
                className={`${styles.themeCard} ${isActive ? styles.themeCardActive : ''}`}
                onClick={() => setTheme(theme.id)}
              >
                <div className={styles.themeColors}>
                  <div className={styles.colorSwatch} style={{ background: theme.colors.primary }} />
                  <div className={styles.colorSwatch} style={{ background: theme.colors.accent }} />
                  <div className={styles.colorSwatch} style={{ background: theme.colors.background }} />
                </div>
                <div className={styles.themeInfo}>
                  <h3>{theme.emoji} {theme.name}</h3>
                  {isActive && <span className={styles.activeBadge}><Check size={12} /> Active</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
