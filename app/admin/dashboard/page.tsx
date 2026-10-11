'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, FileText, HelpCircle, Home, Image as ImageIcon, Images, Mail, MessageCircle, Package, Palette, Settings, ShoppingBag, Sparkles, Tags,
} from 'lucide-react';
import styles from '../admin.module.css';

const EDITORS = [
  { href: '/admin/orders', icon: ShoppingBag, title: 'Orders', desc: 'Custom order requests from the website, with their status.' },
  { href: '/admin/content/site', icon: Settings, title: 'Site Settings', desc: 'Phone, WhatsApp, email, social links, menu, footer, announcement bar, and switching features or homepage sections on and off.' },
  { href: '/admin/homepage', icon: Home, title: 'Homepage', desc: 'Every text and image on the landing page: hero, story, scents, categories, reviews.' },
  { href: '/admin/products', icon: Package, title: 'Products', desc: 'Add, edit or delete products, prices, photos and options.' },
  { href: '/admin/content/journal', icon: FileText, title: 'Journal (Blog)', desc: 'Write new posts, edit or delete existing ones.' },
  { href: '/admin/content/about', icon: BookOpen, title: 'About Page', desc: 'Your story, values and collections.' },
  { href: '/admin/content/gallery', icon: Images, title: 'Gallery', desc: 'Add or remove Lookbook photos.' },
  { href: '/admin/content/faq', icon: HelpCircle, title: 'FAQ', desc: 'Add, remove or reorder questions and answers.' },
  { href: '/admin/content/contact', icon: Mail, title: 'Contact Page', desc: 'Texts on the contact page.' },
  { href: '/admin/media', icon: ImageIcon, title: 'Media Library', desc: 'Upload photos to use anywhere on the site.' },
  { href: '/admin/themes', icon: Palette, title: 'Seasonal Themes', desc: 'Switch the whole site to a festival or season look.' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ products: number; categories: number } | null>(null);
  const [contact, setContact] = useState<{ email: string; phoneDisplay: string } | null>(null);
  const [newOrders, setNewOrders] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list: { category: string }[]) => setStats({ products: list.length, categories: new Set(list.map((p) => p.category)).size }))
      .catch(() => setStats(null));
    fetch('/api/admin/orders')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { orders: { status: string }[] }) => setNewOrders(d.orders.filter((o) => o.status === 'pending').length))
      .catch(() => setNewOrders(null));
    fetch('/api/admin/content/site')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setContact(d.content.contact))
      .catch(() => setContact(null));
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome back to your studio admin panel.</p>
      </div>

      <div className={styles.statsGrid}>
        <Link href="/admin/orders" className={styles.statCard} style={{ color: 'inherit', textDecoration: 'none' }}>
          <div className={styles.statIcon} style={{ background: '#E8A04B' }}><ShoppingBag size={24} /></div>
          <div>
            <h3>New Orders</h3>
            <div className={styles.statValue}>{newOrders ?? '–'}</div>
          </div>
        </Link>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Sparkles size={24} /></div>
          <div>
            <h3>Total Products</h3>
            <div className={styles.statValue}>{stats ? stats.products : '–'}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--color-accent)' }}><Tags size={24} /></div>
          <div>
            <h3>Categories</h3>
            <div className={styles.statValue}>{stats ? stats.categories : '–'}</div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2>What would you like to change?</h2>
        <p className={styles.infoText}>Everything on the website can be edited, added or removed from these pages.</p>
        <div className={styles.editorGrid}>
          {EDITORS.map(({ href, icon: Icon, title, desc }) => (
            <Link key={href} href={href} className={styles.editorTile}>
              <Icon size={20} />
              <strong>{title}</strong>
              <span>{desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2>Custom Orders Process</h2>
        <p className={styles.infoText}>
          When a customer fills out the Custom Order form, you receive an email
          {contact?.email && <> at <strong>{contact.email}</strong></>}, and they are directed to chat with you on WhatsApp
          {contact?.phoneDisplay && <> <strong>({contact.phoneDisplay})</strong></>}.
        </p>
        <p className={styles.infoText}>Keep an eye on WhatsApp for instant inquiries!</p>
        <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '16px' }}>
          <MessageCircle size={18} /> Open WhatsApp Web
        </a>
      </div>
    </div>
  );
}
