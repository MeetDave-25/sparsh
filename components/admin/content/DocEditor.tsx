'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Loader2, RotateCcw, Save } from 'lucide-react';
import type { DocSection } from '@/lib/content/docs';
import { FieldsEditor } from './FieldEditor';
import styles from './ContentEditor.module.css';

type Obj = Record<string, unknown>;

type Props = {
  apiUrl: string;
  title: string;
  description: string;
  viewHref: string;
  sections: DocSection[];
  defaults: Obj;
};

/** Section-by-section editor for one admin-editable document, saved as a whole. */
export default function DocEditor({ apiUrl, title, description, viewHref, sections, defaults }: Props) {
  const [saved, setSaved] = useState<Obj | null>(null);
  const [draft, setDraft] = useState<Obj | null>(null);
  const [active, setActive] = useState(sections[0].key);
  const [status, setStatus] = useState<{ kind: 'idle' | 'saving' | 'saved' | 'error'; msg?: string }>({ kind: 'idle' });
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl)
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = await r.json();
        setSaved(data.content);
        setDraft(data.content);
        setUpdatedAt(data.updatedAt);
      })
      .catch(() => setStatus({ kind: 'error', msg: `Could not load ${title}.` }));
  }, [apiUrl, title]);

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  const dirtySections = useMemo(() => {
    if (!saved || !draft) return new Set<string>();
    return new Set(sections.filter((s) => JSON.stringify(saved[s.key]) !== JSON.stringify(draft[s.key])).map((s) => s.key));
  }, [saved, draft, sections]);

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
      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSaved(data.content);
      setDraft(data.content);
      setUpdatedAt(data.updatedAt);
      setStatus({ kind: 'saved', msg: 'Saved. The website is updated.' });
    } catch (e) {
      setStatus({ kind: 'error', msg: e instanceof Error ? e.message : 'Save failed' });
    }
  }

  if (!draft) {
    return (
      <div className={styles.page}>
        {status.kind === 'error' ? (
          <p className={styles.errorMsg}>{status.msg}</p>
        ) : (
          <p className={styles.muted}>
            <Loader2 size={16} className={styles.spin} /> Loading…
          </p>
        )}
      </div>
    );
  }

  const section = sections.find((s) => s.key === active) ?? sections[0];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{title}</h1>
          <p className={styles.muted}>
            {description} Changes go live when you press Save.
            {updatedAt && <> Last saved {new Date(updatedAt).toLocaleString()}.</>}
          </p>
        </div>
        <div className={styles.headerActions}>
          <a href={viewHref} target="_blank" rel="noopener noreferrer" className={styles.btnSmallGhost}>
            <ExternalLink size={14} /> View page
          </a>
          <button type="button" className={styles.btnPrimary} onClick={save} disabled={!dirty || status.kind === 'saving'}>
            {status.kind === 'saving' ? <Loader2 size={16} className={styles.spin} /> : <Save size={16} />}
            {status.kind === 'saving' ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
          </button>
        </div>
      </div>

      {status.msg && status.kind !== 'saving' && (
        <p className={status.kind === 'error' ? styles.errorMsg : styles.successMsg} role="status">
          {status.msg}
        </p>
      )}

      <div className={styles.editorLayout}>
        <nav className={styles.sectionNav} aria-label={`${title} sections`}>
          {sections.map((s, i) => (
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
                if (confirm(`Reset "${section.title}" to the original content? Nothing changes on the site until you press Save.`)) {
                  setDraft({ ...draft, [section.key]: structuredClone(defaults[section.key]) });
                }
              }}
            >
              <RotateCcw size={14} /> Reset to original
            </button>
          </div>

          <FieldsEditor
            key={section.key}
            fields={section.fields}
            value={draft[section.key] as Obj}
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
