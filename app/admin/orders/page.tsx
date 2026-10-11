'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Loader2, Mail, MessageCircle, Phone, RefreshCw, Search, Trash2 } from 'lucide-react';
import { ORDER_STATUSES, customerWhatsApp, type OrderStatus } from '@/lib/orders/status';
import styles from './orders.module.css';

type Order = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  productCategory: string;
  productName: string | null;
  customizations: string;
  deliveryDate: string | null;
  specialNotes: string | null;
  status: OrderStatus;
  createdAt: string;
};

const statusInfo = (id: string) => ORDER_STATUSES.find((s) => s.id === id) ?? ORDER_STATUSES[0];

function when(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch('/api/admin/orders')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { orders: Order[] }) => {
        setOrders(d.orders);
        setError('');
      })
      .catch(() => setError('Could not load orders.'));
  }, []);

  useEffect(load, [load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    for (const o of orders ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders ?? []).filter(
      (o) =>
        (filter === 'all' || o.status === filter) &&
        (!q || [o.customerName, o.phone, o.email, o.productCategory, o.productName ?? ''].join(' ').toLowerCase().includes(q)),
    );
  }, [orders, filter, query]);

  async function setStatus(o: Order, status: OrderStatus) {
    setBusy(o.id);
    const res = await fetch(`/api/admin/orders/${o.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    if (res.ok) setOrders((list) => list?.map((x) => (x.id === o.id ? { ...x, status } : x)) ?? null);
    else alert('Could not update the order. Please try again.');
  }

  async function remove(o: Order) {
    if (!confirm(`Delete the order from ${o.customerName}? This can't be undone.`)) return;
    setBusy(o.id);
    const res = await fetch(`/api/admin/orders/${o.id}`, { method: 'DELETE' });
    setBusy(null);
    if (res.ok) setOrders((list) => list?.filter((x) => x.id !== o.id) ?? null);
    else alert('Could not delete the order. Please try again.');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Orders</h1>
          <p>Every Custom Order form sent from the website. Update the status as you go.</p>
        </div>
        <button type="button" className={styles.refresh} onClick={load}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className={styles.tools}>
        <div className={styles.tabs} role="tablist" aria-label="Filter by status">
          {[{ id: 'all', label: 'All', color: '' }, ...ORDER_STATUSES].map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={filter === s.id}
              className={`${styles.tab} ${filter === s.id ? styles.tabActive : ''}`}
              onClick={() => setFilter(s.id as typeof filter)}
            >
              {s.label}
              <span className={styles.count}>{counts[s.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone, product…" aria-label="Search orders" />
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {!orders && !error && (
        <p className={styles.muted}>
          <Loader2 size={16} className={styles.spin} /> Loading orders…
        </p>
      )}
      {orders && shown.length === 0 && (
        <div className={styles.empty}>
          {orders.length === 0
            ? 'No orders yet. When someone sends the Custom Order form, it will appear here.'
            : 'No orders match this filter.'}
        </div>
      )}

      <ul className={styles.list}>
        {shown.map((o) => {
          const s = statusInfo(o.status);
          const isOpen = open === o.id;
          const wa = customerWhatsApp(o.phone);
          const waText = `Hi ${o.customerName.split(' ')[0]}, thank you for your custom order request with Sparsh Divine Art Studio (${o.productName || o.productCategory}).`;
          return (
            <li key={o.id} className={`${styles.order} ${isOpen ? styles.orderOpen : ''}`}>
              <div className={styles.row}>
                <button type="button" className={styles.summary} onClick={() => setOpen(isOpen ? null : o.id)} aria-expanded={isOpen}>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className={styles.who}>
                    <strong>{o.customerName}</strong>
                    <span>{o.productName || o.productCategory}</span>
                  </span>
                  <span className={styles.date}>{when(o.createdAt)}</span>
                </button>
                <span className={styles.statusWrap}>
                  <span className={styles.dot} style={{ background: s.color }} aria-hidden="true" />
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o, e.target.value as OrderStatus)}
                    disabled={busy === o.id}
                    aria-label={`Status for ${o.customerName}`}
                    className={styles.select}
                  >
                    {ORDER_STATUSES.map((x) => (
                      <option key={x.id} value={x.id}>{x.label}</option>
                    ))}
                  </select>
                </span>
              </div>

              {isOpen && (
                <div className={styles.details}>
                  <div className={styles.contactBtns}>
                    {wa && (
                      <a href={`https://wa.me/${wa}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer" className={styles.wa}>
                        <MessageCircle size={15} /> WhatsApp
                      </a>
                    )}
                    {o.email && (
                      <a href={`mailto:${o.email}?subject=${encodeURIComponent('Your custom order with Sparsh Divine Art Studio')}`} className={styles.ghost}>
                        <Mail size={15} /> Email
                      </a>
                    )}
                    <a href={`tel:${o.phone}`} className={styles.ghost}>
                      <Phone size={15} /> Call
                    </a>
                    <button type="button" className={styles.delete} onClick={() => remove(o)} disabled={busy === o.id}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                  <dl className={styles.grid}>
                    <dt>Phone</dt>
                    <dd>{o.phone}</dd>
                    <dt>Email</dt>
                    <dd>{o.email || '—'}</dd>
                    <dt>Category</dt>
                    <dd>{o.productCategory}</dd>
                    {o.productName && (
                      <>
                        <dt>Product</dt>
                        <dd>{o.productName}</dd>
                      </>
                    )}
                    {o.deliveryDate && (
                      <>
                        <dt>Needed by</dt>
                        <dd>{o.deliveryDate}</dd>
                      </>
                    )}
                    <dt>Details</dt>
                    <dd className={styles.pre}>{o.customizations || '—'}</dd>
                    {o.specialNotes && (
                      <>
                        <dt>Notes</dt>
                        <dd className={styles.pre}>{o.specialNotes}</dd>
                      </>
                    )}
                  </dl>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
