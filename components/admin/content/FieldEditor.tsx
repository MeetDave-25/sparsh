'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Copy, Plus, Star, Trash2 } from 'lucide-react';
import type { Field } from '@/lib/homeContent';
import ImagePicker from './ImagePicker';
import styles from './ContentEditor.module.css';

type Obj = Record<string, unknown>;

function blankItem(fields: Field[]): Obj {
  const out: Obj = {};
  for (const f of fields) {
    if (f.kind === 'color') out[f.key] = '#E8A0B4';
    else if (f.kind === 'number') out[f.key] = f.max;
    else if (f.kind === 'stringList' || f.kind === 'list') out[f.key] = [];
    else out[f.key] = '';
  }
  return out;
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function TextField({ field, value, onChange }: { field: Extract<Field, { kind: 'text' }>; value: string; onChange: (v: string) => void }) {
  const max = field.max;
  const common = {
    className: field.multiline ? styles.textarea : styles.input,
    value,
    maxLength: max,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };
  return (
    <label className={styles.field}>
      <span className={styles.labelRow}>
        <span className={styles.label}>{field.label}</span>
        {max && <span className={styles.counter}>{value.length}/{max}</span>}
      </span>
      {field.multiline ? <textarea rows={4} {...common} /> : <input {...common} />}
      {field.help && <small className={styles.help}>{field.help}</small>}
    </label>
  );
}

function StringListField({ field, value, onChange }: { field: Extract<Field, { kind: 'stringList' }>; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{field.label}</span>
      <div className={styles.stringList}>
        {value.map((item, i) => (
          <div key={i} className={styles.stringRow}>
            {field.multiline ? (
              <textarea className={styles.textarea} rows={3} value={item} maxLength={field.max} onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))} />
            ) : (
              <input className={styles.input} value={item} maxLength={field.max} onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))} />
            )}
            <div className={styles.rowTools}>
              <button type="button" className={styles.iconBtn} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} aria-label="Move up"><ArrowUp size={14} /></button>
              <button type="button" className={styles.iconBtn} disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))} aria-label="Move down"><ArrowDown size={14} /></button>
              <button type="button" className={styles.iconDanger} onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {value.length < field.maxItems && (
        <button type="button" className={styles.addBtn} onClick={() => onChange([...value, ''])}>
          <Plus size={14} /> Add {field.itemLabel.toLowerCase()}
        </button>
      )}
    </div>
  );
}

function ListField({ field, value, onChange }: { field: Extract<Field, { kind: 'list' }>; value: Obj[]; onChange: (v: Obj[]) => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const canRemove = value.length > field.minItems;
  const canAdd = value.length < field.maxItems;

  return (
    <div className={styles.field}>
      <span className={styles.labelRow}>
        <span className={styles.label}>{field.label}</span>
        <span className={styles.counter}>{value.length} / {field.maxItems}</span>
      </span>
      <div className={styles.itemList}>
        {value.map((item, i) => {
          const isOpen = openIndex === i;
          const title = String(item[field.titleKey] || '').trim() || `${field.itemLabel} ${i + 1}`;
          const thumb = field.fields.find((f) => f.kind === 'image');
          const thumbUrl = thumb ? String(item[thumb.key] || '') : '';
          return (
            <div key={i} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
              <div className={styles.itemHeader}>
                <button type="button" className={styles.itemToggle} onClick={() => setOpenIndex(isOpen ? null : i)} aria-expanded={isOpen}>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  {thumbUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                    <img src={thumbUrl} alt="" className={styles.itemThumb} />
                  )}
                  <span>{title}</span>
                </button>
                <div className={styles.rowTools}>
                  <button type="button" className={styles.iconBtn} disabled={i === 0} onClick={() => { onChange(move(value, i, i - 1)); setOpenIndex(null); }} aria-label="Move up"><ArrowUp size={14} /></button>
                  <button type="button" className={styles.iconBtn} disabled={i === value.length - 1} onClick={() => { onChange(move(value, i, i + 1)); setOpenIndex(null); }} aria-label="Move down"><ArrowDown size={14} /></button>
                  {canAdd && (
                    <button type="button" className={styles.iconBtn} onClick={() => { const copy = [...value]; copy.splice(i + 1, 0, structuredClone(item)); onChange(copy); }} aria-label="Duplicate"><Copy size={14} /></button>
                  )}
                  <button
                    type="button"
                    className={styles.iconDanger}
                    disabled={!canRemove}
                    title={canRemove ? 'Remove' : `Keep at least ${field.minItems}`}
                    onClick={() => {
                      if (confirm(`Remove "${title}"?`)) {
                        onChange(value.filter((_, j) => j !== i));
                        setOpenIndex(null);
                      }
                    }}
                    aria-label="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className={styles.itemBody}>
                  <FieldsEditor fields={field.fields} value={item} onChange={(next) => onChange(value.map((v, j) => (j === i ? next : v)))} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {canAdd && (
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => {
            onChange([...value, blankItem(field.fields)]);
            setOpenIndex(value.length);
          }}
        >
          <Plus size={14} /> Add {field.itemLabel.toLowerCase()}
        </button>
      )}
    </div>
  );
}

export function FieldsEditor({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  return (
    <div className={styles.fields}>
      {fields.map((f) => {
        const v = value[f.key];
        switch (f.kind) {
          case 'text':
            return <TextField key={f.key} field={f} value={String(v ?? '')} onChange={(x) => set(f.key, x)} />;
          case 'link':
            return (
              <label key={f.key} className={styles.field}>
                <span className={styles.label}>{f.label}</span>
                <input className={styles.input} value={String(v ?? '')} placeholder="/products or https://…" onChange={(e) => set(f.key, e.target.value)} />
                <small className={styles.help}>Start with / for a page on this site, or https:// for another site.</small>
              </label>
            );
          case 'image':
            return <ImagePicker key={f.key} label={f.label} help={f.help} value={String(v ?? '')} onChange={(x) => set(f.key, x)} />;
          case 'color':
            return (
              <label key={f.key} className={styles.field}>
                <span className={styles.label}>{f.label}</span>
                <span className={styles.colorRow}>
                  <input type="color" value={String(v || '#E8A0B4')} onChange={(e) => set(f.key, e.target.value)} />
                  <code>{String(v || '')}</code>
                </span>
              </label>
            );
          case 'number':
            return (
              <div key={f.key} className={styles.field}>
                <span className={styles.label}>{f.label}</span>
                <span className={styles.stars}>
                  {Array.from({ length: f.max - f.min + 1 }, (_, k) => f.min + k).map((n) => (
                    <button key={n} type="button" className={styles.starBtn} onClick={() => set(f.key, n)} aria-label={`${n} stars`}>
                      <Star size={18} fill={Number(v) >= n ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </span>
              </div>
            );
          case 'stringList':
            return <StringListField key={f.key} field={f} value={(v as string[]) ?? []} onChange={(x) => set(f.key, x)} />;
          case 'list':
            return <ListField key={f.key} field={f} value={(v as Obj[]) ?? []} onChange={(x) => set(f.key, x)} />;
        }
      })}
    </div>
  );
}
