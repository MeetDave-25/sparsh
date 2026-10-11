'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import { useSite } from '@/components/layout/SiteProvider';
import Wordmark from '@/components/brand/Wordmark';
import NavTrim from '@/components/seasonal/NavTrim';
import { themeMode } from '@/lib/themes';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { activeTheme } = useTheme();
  const { navigation, announcement, features } = useSite();
  const seasonal = features.seasonalDecor;
  const navLinks = navigation.links;
  const bannerText = announcement.text || activeTheme.bannerText;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [onDark, setOnDark] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const isHome = pathname === '/';
  // Which background the wordmark sits on decides its gold: deep on light, bright on dark.
  const logoTone = isHome ? (onDark ? 'dark' : 'light') : themeMode(activeTheme);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(scrollY > 60);
        setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);

        // On the homepage the bar is see-through; read what's underneath it
        // so it can switch between ivory and transparent-on-dark styling.
        const nav = navRef.current;
        if (!isHome || !nav) return;
        const rect = nav.getBoundingClientRect();
        const y = rect.top + rect.height / 2;
        const under = document
          .elementsFromPoint(window.innerWidth / 2, y)
          .find((el) => !nav.contains(el) && el.closest('[data-nav]'));
        setOnDark(under?.closest('[data-nav]')?.getAttribute('data-nav') === 'dark');
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHome]);

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

  // Admin has its own sidebar and top bar.
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className={styles.scrollProgress} style={{ width: `${scrollProgress}%` }} />

      {/* Announcement Banner */}
      {announcement.show && bannerText && (
        <div className={`${styles.banner} ${isHome ? styles.bannerLux : ''}`}>
          {isHome && announcement.badge && <span className={styles.bannerBadge}>{announcement.badge}</span>}
          <p>{bannerText}</p>
        </div>
      )}

      {/* Navbar */}
      <nav
        ref={navRef}
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${isHome ? styles.lux : ''} ${isHome && onDark ? styles.luxDark : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={`container ${styles.navInner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Sparsh Divine Art Studio - Home">
            <Wordmark tone={logoTone} className={styles.logoMark} />
          </Link>

          {/* Desktop Navigation */}
          <ul className={styles.navLinks} role="list">
            {navLinks.map((link, i) => (
              <li key={`${link.href}-${i}`}>
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
            {navigation.ctaLabel && (
              <Link href={navigation.ctaHref || '/customize'} className={`btn btn-primary btn-sm ${isHome ? styles.luxCta : ''}`} id="nav-customize-btn">
                {navigation.ctaLabel}
              </Link>
            )}

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
        {seasonal && <NavTrim season={activeTheme.season} decor={activeTheme.decor} />}
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
          <Wordmark tone={themeMode(activeTheme)} size="sm" />
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className={styles.iconBtn}>
            <X size={22} />
          </button>
        </div>
        <ul className={styles.mobileNavLinks}>
          {navLinks.map((link, i) => (
            <li key={`${link.href}-${i}`}>
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
          {navigation.ctaLabel && (
            <Link href={navigation.ctaHref || '/customize'} className="btn btn-primary w-full" onClick={() => setMenuOpen(false)} id="mobile-customize-btn">
              {navigation.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
