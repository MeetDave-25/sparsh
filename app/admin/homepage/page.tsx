'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Loader2, RotateCcw, Save } from 'lucide-react';
import { DEFAULT_HOME_CONTENT, HOME_SECTIONS, type HomeContent } from '@/lib/homeContent';
import { FieldsEditor } from '@/components/admin/content/FieldEditor';
import styles from '@/components/admin/content/ContentEditor.module.css';

type Obj = Record<string, unknown>;

export default function HomepageEditor() {
  const [saved, setSaved] = useState<HomeContent | null>(null);
  const [draft, setDraft] = useState<HomeContent | null>(null);
  const [active, setActive] = useState<keyof HomeContent>('hero');
  const [status, setStatus] = useState<{ kind: 'idle' | 'saving' | 'saved' | 'error'; msg?: string }>({ kind: 'idle' });
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/content/home')
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = await r.json();
        setSaved(data.content);
        setDraft(data.content);
        setUpdatedAt(data.updatedAt);
      })
      .catch(() => setStatus({ kind: 'error', msg: 'Could not load homepage content.' }));
  }, []);

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  const dirtySections = useMemo(() => {
    if (!saved || !draft) return new Set<string>();
    return new Set(HOME_SECTIONS.filter((s) => JSON.stringify(saved[s.key]) !== JSON.stringify(draft[s.key])).map((s) => s.key));
  }, [saved, draft]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function save() {
    if (!draft) return;
    setStatus({ kind: 'saving' });
    try {
      const res = await fetch('/api/admin/content/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSaved(data.content);
      setDraft(data.content);
      setUpdatedAt(data.updatedAt);
      setStatus({ kind: 'saved', msg: 'Saved. The homepage is updated.' });
    } catch (e) {
      setStatus({ kind: 'error', msg: e instanceof Error ? e.message : 'Save failed' });
    }
  }

  if (!draft) {
    return (
      <div className={styles.page}>
        {status.kind === 'error' ? <p className={styles.errorMsg}>{status.msg}</p> : <p className={styles.muted}><Loader2 size={16} className={styles.spin} /> Loading…</p>}
      </div>
    );
  }

  const section = HOME_SECTIONS.find((s) => s.key === active)!;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Homepage</h1>
          <p className={styles.muted}>
            Edit every section of the landing page. Changes go live when you press Save.
            {updatedAt && <> Last saved {new Date(updatedAt).toLocaleString()}.</>}
          </p>
        </div>
        <div className={styles.headerActions}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.btnSmallGhost}>
            <ExternalLink size={14} /> View site
          </a>
          <button type="button" className={styles.btnPrimary} onClick={save} disabled={!dirty || status.kind === 'saving'}>
            {status.kind === 'saving' ? <Loader2 size={16} className={styles.spin} /> : <Save size={16} />}
            {status.kind === 'saving' ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
          </button>
        </div>
      </div>

      {status.msg && status.kind !== 'saving' && (
        <p className={status.kind === 'error' ? styles.errorMsg : styles.successMsg} role="status">{status.msg}</p>
      )}

      <div className={styles.editorLayout}>
        <nav className={styles.sectionNav} aria-label="Homepage sections">
          {HOME_SECTIONS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className={`${styles.sectionTab} ${active === s.key ? styles.sectionTabActive : ''}`}
              onClick={() => setActive(s.key)}
            >
              <span className={styles.sectionNum}>{i + 1}</span>
              {s.title}
              {dirtySections.has(s.key) && <span className={styles.dirtyDot} title="Unsaved changes" />}
            </button>
          ))}
        </nav>

        <section className={styles.sectionPanel}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{section.title}</h2>
              <p className={styles.muted}>{section.description}</p>
            </div>
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => {
                if (confirm(`Reset "${section.title}" to the original content? You can still undo this by not saving.`)) {
                  setDraft({ ...draft, [section.key]: structuredClone(DEFAULT_HOME_CONTENT[section.key]) });
                }
              }}
            >
              <RotateCcw size={14} /> Reset to original
            </button>
          </div>

          <FieldsEditor
            key={section.key}
            fields={section.fields}
            value={draft[section.key] as unknown as Obj}
            onChange={(next) => {
              setDraft({ ...draft, [section.key]: next });
              if (status.kind !== 'idle') setStatus({ kind: 'idle' });
            }}
          />
        </section>
      </div>
    </div>
  );
}
