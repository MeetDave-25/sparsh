'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { isRemoteImage } from '@/lib/homeContent';
import styles from './ProductImage.module.css';

type Props = Omit<ImageProps, 'src' | 'unoptimized' | 'onError'> & { src?: string | null };

/**
 * A product photo that falls back to a branded placeholder when the image is
 * missing or fails to load, so a dead link never shows broken-image text.
 */
export default function ProductImage({ src, alt, ...rest }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={styles.placeholder} role="img" aria-label={alt}>
        <span className={styles.mark} />
      </div>
    );
  }

  return <Image src={src} alt={alt} unoptimized={isRemoteImage(src)} onError={() => setFailed(true)} {...rest} />;
}
