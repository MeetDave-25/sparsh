'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import MediaLibrary from './MediaLibrary';
import { useMediaUpload } from './useMediaUpload';
import styles from './ContentEditor.module.css';

type Props = {
  value: string;
  onChange: (url: string) => void;
  label: string;
  help?: string;
};

export default function ImagePicker({ value, onChange, label, help }: Props) {
  const [open, setOpen] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { upload, uploading, error } = useMediaUpload();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const asset = await upload(file);
    if (asset) onChange(asset.url);
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.imagePicker}>
        <div className={styles.imagePreview}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs
            <img src={value} alt="" />
          ) : (
            <span className={styles.noImage}>
              <ImageIcon size={22} />
              No image
            </span>
          )}
          {uploading && (
            <span className={styles.previewOverlay}>
              <Loader2 size={22} className={styles.spin} />
            </span>
          )}
        </div>

        <div className={styles.imageActions}>
          <button type="button" className={styles.btnSmall} onClick={() => fileInput.current?.click()} disabled={uploading}>
            <Upload size={14} /> Upload new
          </button>
          <button type="button" className={styles.btnSmallGhost} onClick={() => setOpen(true)}>
            <ImageIcon size={14} /> Choose from library
          </button>
          <button type="button" className={styles.linkBtn} onClick={() => setShowUrl((s) => !s)}>
            {showUrl ? 'Hide URL' : 'Paste a URL'}
          </button>
          {value && (
            <button type="button" className={styles.linkBtnDanger} onClick={() => onChange('')}>
              Remove image
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </div>
      </div>
      {showUrl && (
        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /products/…"
        />
      )}
      {help && <small className={styles.help}>{help}</small>}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {open && (
        <div className={styles.modalBackdrop} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Choose an image">
            <div className={styles.modalHeader}>
              <h3>Choose an image</h3>
              <button type="button" className={styles.iconBtn} onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <MediaLibrary
                selectedUrl={value}
                onSelect={(url) => {
                  onChange(url);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
