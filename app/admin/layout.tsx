'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Palette, LogOut, Package, FileText, Home, Image as ImageIcon, Settings, BookOpen, HelpCircle, Mail, Images, ShoppingBag, Menu, X, ExternalLink } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin';

  // Close the phone menu whenever the page changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (isLoginPage) return;
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((s) => {
        if (s.authenticated) setAuth(true);
        else router.push('/admin');
      })
      .catch(() => router.push('/admin'));
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  // Login page renders without the sidebar or session check
  if (isLoginPage) return <>{children}</>;

  if (!auth) return null; // Prevent flash of content

  const links = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/admin/content/site', icon: Settings, label: 'Site Settings' },
    { href: '/admin/homepage', icon: Home, label: 'Homepage' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/content/journal', icon: FileText, label: 'Journal (Blog)' },
    { href: '/admin/content/about', icon: BookOpen, label: 'About Page' },
    { href: '/admin/content/gallery', icon: Images, label: 'Gallery' },
    { href: '/admin/content/faq', icon: HelpCircle, label: 'FAQ' },
    { href: '/admin/content/contact', icon: Mail, label: 'Contact Page' },
    { href: '/admin/media', icon: ImageIcon, label: 'Media Library' },
    { href: '/admin/themes', icon: Palette, label: 'Seasonal Themes' },
  ];

  const current = links.find((l) => pathname.startsWith(l.href));

  return (
    <div className={styles.adminLayout}>
      {/* Phone top bar */}
      <header className={styles.topBar}>
        <button type="button" className={styles.topBarBtn} onClick={() => setMenuOpen(true)} aria-label="Open admin menu" aria-expanded={menuOpen}>
          <Menu size={22} />
        </button>
        <span className={styles.topBarTitle}>{current?.label ?? 'Studio Admin'}</span>
        <a href="/" target="_blank" rel="noopener noreferrer" className={styles.topBarBtn} aria-label="View website">
          <ExternalLink size={18} />
        </a>
      </header>

      {menuOpen && <div className={styles.sidebarOverlay} onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Studio Admin</h2>
          <button type="button" className={styles.sidebarClose} onClick={() => setMenuOpen(false)} aria-label="Close admin menu">
            <X size={20} />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          {links.map(link => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`${styles.navLink} ${active ? styles.active : ''}`}>
                <Icon size={18} />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
