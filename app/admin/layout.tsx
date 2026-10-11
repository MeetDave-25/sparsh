'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Palette, LogOut, Package, FileText, Home, Image as ImageIcon, Settings, BookOpen, HelpCircle, Mail, Images, ShoppingBag } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin';

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

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Studio Admin</h2>
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
