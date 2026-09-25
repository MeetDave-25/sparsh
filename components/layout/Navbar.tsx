'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, ShoppingBag } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/customize', label: '✨ Customize' },
  { href: '/about', label: 'Our Story' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode, activeTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollY > 60);
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className={styles.scrollProgress} style={{ width: `${scrollProgress}%` }} />

      {/* Announcement Banner */}
      <div className={styles.banner}>
        <p>{activeTheme.bannerText}</p>
      </div>

      {/* Navbar */}
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Main navigation">
        <div className={`container ${styles.navInner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Sparsh Divine Art Studio - Home">
            <Image
              src="/brand/sparsh-wordmark.png"
              alt="Sparsh Divine Art Studio"
              width={892}
              height={452}
              priority
              className={styles.logoImg}
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className={styles.navLinks} role="list">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              onClick={toggleDarkMode}
              className={styles.iconBtn}
              aria-label={`Switch to ${darkMode === 'light' ? 'dark' : 'light'} mode`}
              id="dark-mode-toggle"
            >
              {darkMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link href="/customize" className="btn btn-primary btn-sm" id="nav-customize-btn">
              Custom Order
            </Link>

            {/* Mobile menu button */}
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              id="mobile-menu-btn"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        <div className={styles.mobileMenuHeader}>
          <Image src="/brand/sparsh-wordmark.png" alt="Sparsh Divine Art Studio" width={892} height={452} className={styles.logoImgMobileMenu} />
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className={styles.iconBtn}>
            <X size={22} />
          </button>
        </div>
        <ul className={styles.mobileNavLinks}>
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.mobileActions}>
          <Link href="/customize" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)} id="mobile-customize-btn">
            ✨ Request Custom Order
          </Link>
          <button onClick={toggleDarkMode} className="btn btn-secondary w-full" id="mobile-dark-toggle">
            {darkMode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>
    </>
  );
}
