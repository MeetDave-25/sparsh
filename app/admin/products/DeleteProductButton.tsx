'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash } from 'lucide-react';
import styles from './ProductsAdmin.module.css';

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`Delete "${name}"? It will be removed from the website. This can't be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert('Could not delete the product. Please try again.');
  }

  return (
    <button type="button" className={`${styles.actionBtn} ${styles.danger}`} onClick={remove} disabled={busy} aria-label={`Delete ${name}`}>
      {busy ? <Loader2 size={16} className={styles.spin} /> : <Trash size={16} />}
    </button>
  );
}
