'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { getAllThemes, themeMode, type Theme } from '@/lib/themes';
import styles from '../admin.module.css';

const THEMES = getAllThemes();

export default function AdminThemes() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/content/theme')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d: { themeId: string }) => setActiveId(d.themeId))
      .catch(() => setMessage({ ok: false, text: 'Could not load the current theme.' }));
  }, []);

  async function choose(theme: Theme) {
    if (savingId || theme.id === activeId) return;
    setSavingId(theme.id);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/content/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId: theme.id }),
      });
      if (!res.ok) throw new Error();
      setActiveId(theme.id);
      setMessage({ ok: true, text: `${theme.name} is now live for every visitor.` });
      router.refresh();
    } catch {
      setMessage({ ok: false, text: 'Saving failed — please try again.' });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Seasonal Themes</h1>
        <p>Change the colours and announcement banner of the whole website with one click.</p>
      </div>

      <div className={styles.card}>
        <h2>Select Active Theme</h2>
        <p className={styles.infoText} style={{ marginBottom: '24px' }}>
          The theme you pick here is saved and shown to every visitor, on every page. Visitors can&apos;t change
          it themselves. Dark or light styling comes automatically from the theme&apos;s colours.
        </p>

        {message && (
          <p
            role="status"
            style={{ marginBottom: 20, fontWeight: 600, color: message.ok ? '#2f855a' : '#c53030' }}
          >
            {message.text}
          </p>
        )}

        <div className={styles.themesGrid}>
          {THEMES.map((theme) => {
            const isActive = activeId === theme.id;
            const isSaving = savingId === theme.id;
            return (
              <button
                type="button"
                key={theme.id}
                className={`${styles.themeCard} ${isActive ? styles.themeCardActive : ''}`}
                onClick={() => choose(theme)}
                disabled={!!savingId || activeId === null}
                aria-pressed={isActive}
                style={{ textAlign: 'left', font: 'inherit', color: 'inherit' }}
              >
                <div className={styles.themeColors}>
                  <div className={styles.colorSwatch} style={{ background: theme.colors.primary }} />
                  <div className={styles.colorSwatch} style={{ background: theme.colors.accent }} />
                  <div className={styles.colorSwatch} style={{ background: theme.colors.background }} />
                </div>
                <div className={styles.themeInfo}>
                  <h3>
                    {theme.emoji} {theme.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: '4px 0' }}>
                    {themeMode(theme) === 'dark' ? 'Dark' : 'Light'} theme
                  </p>
                  {isActive && (
                    <span className={styles.activeBadge}>
                      <Check size={12} /> Active
                    </span>
                  )}
                  {isSaving && (
                    <span className={styles.activeBadge}>
                      <Loader2 size={12} /> Saving…
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
