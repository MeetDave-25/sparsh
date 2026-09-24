'use client';

import { useState } from 'react';

export type MediaAsset = {
  id: string;
  url: string;
  filename: string;
  width: number;
  height: number;
  size: number;
  createdAt: string;
};

// Serverless hosts (e.g. Vercel) reject request bodies over ~4.5 MB, so big photos are
// downscaled in the browser first. The server still resizes and re-encodes everything.
const SAFE_UPLOAD_BYTES = 3.5 * 1024 * 1024;
const MAX_EDGE = 2400;

async function shrinkIfNeeded(file: File): Promise<File> {
  if (file.size <= SAFE_UPLOAD_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    // Formats the browser can't decode (e.g. HEIC outside Safari) go up as-is
    return file;
  }
}

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File): Promise<MediaAsset | null> {
    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', await shrinkIfNeeded(file));
      const res = await fetch('/api/admin/media', { method: 'POST', body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error ||
            (res.status === 413 ? 'That photo is too large. Try exporting it as a JPG under 4 MB.' : 'Upload failed')
        );
        return null;
      }
      return data as MediaAsset;
    } catch {
      setError('Upload failed. Check your connection.');
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, error, setError };
}
