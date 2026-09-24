'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Loader2, Trash2, Upload } from 'lucide-react';
import { BUILTIN_IMAGES } from '@/lib/builtinImages';
import { useMediaUpload, type MediaAsset } from './useMediaUpload';
import styles from './ContentEditor.module.css';

type Props = {
  /** When set, clicking an image selects it instead of just previewing it. */
  onSelect?: (url: string) => void;
  selectedUrl?: string;
  allowDelete?: boolean;
};

export default function MediaLibrary({ onSelect, selectedUrl, allowDelete }: Props) {
  const [assets, setAssets] = useState<MediaAsset[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { upload, uploading, error, setError } = useMediaUpload();

  useEffect(() => {
    fetch('/api/admin/media')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setAssets)
      .catch(() => {
        setLoadError('Could not load uploaded images.');
        setAssets([]);
      });
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      const asset = await upload(file);
      if (asset) {
        setAssets((prev) => [asset, ...(prev ?? [])]);
        if (onSelect && files.length === 1) onSelect(asset.url);
      }
    }
  }

  async function remove(asset: MediaAsset) {
    if (!confirm(`Delete "${asset.filename}"? Any section still using it will show no image.`)) return;
    const res = await fetch(`/api/admin/media/${asset.id}`, { method: 'DELETE' });
    if (res.ok) setAssets((prev) => (prev ?? []).filter((a) => a.id !== asset.id));
    else setError('Could not delete that image.');
  }

  const tile = (url: string, label: string, asset?: MediaAsset) => {
    const selected = selectedUrl === url;
    return (
      <div key={url} className={`${styles.tile} ${selected ? styles.tileSelected : ''}`}>
        <button
          type="button"
          className={styles.tileButton}
          onClick={() => onSelect?.(url)}
          disabled={!onSelect}
          title={label}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnails */}
          <img src={url} alt={label} loading="lazy" />
          {selected && (
            <span className={styles.tileCheck}>
              <Check size={14} />
            </span>
          )}
        </button>
        <div className={styles.tileMeta}>
          <span className={styles.tileLabel}>{label}</span>
          {allowDelete && asset && (
            <button type="button" className={styles.iconDanger} onClick={() => remove(asset)} aria-label={`Delete ${label}`}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.library}>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInput.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.current?.click()}
      >
        {uploading ? <Loader2 size={20} className={styles.spin} /> : <Upload size={20} />}
        <span>{uploading ? 'Uploading…' : 'Drop images here or click to upload'}</span>
        <small>JPG, PNG, WebP or HEIC, up to 12 MB. Large photos are resized automatically.</small>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {(error || loadError) && <p className={styles.errorMsg}>{error || loadError}</p>}

      <h4 className={styles.libraryHeading}>Your uploads</h4>
      {assets === null ? (
        <p className={styles.muted}>Loading…</p>
      ) : assets.length === 0 ? (
        <p className={styles.muted}>No uploads yet.</p>
      ) : (
        <div className={styles.tileGrid}>{assets.map((a) => tile(a.url, a.filename, a))}</div>
      )}

      <h4 className={styles.libraryHeading}>Built-in photos</h4>
      <div className={styles.tileGrid}>{BUILTIN_IMAGES.map((b) => tile(b.url, b.label))}</div>
    </div>
  );
}
