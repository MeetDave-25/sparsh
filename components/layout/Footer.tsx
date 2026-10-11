'use client';

import Link from 'next/link';
import Wordmark from '@/components/brand/Wordmark';
import { themeMode } from '@/lib/themes';
import { Mail, Phone, Heart, MapPin } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import { useSite } from '@/components/layout/SiteProvider';
import SocialIcon from '@/components/layout/SocialIcon';
import { FooterTrim } from '@/components/seasonal/SeasonArt';
import { whatsappLink } from '@/lib/content/docs';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const { activeTheme } = useTheme();
  const { contact, social, footer, features } = useSite();
  const wa = whatsappLink(contact.whatsappNumber);

  return (
    <footer className={styles.footer}>
      {features.seasonalDecor && <FooterTrim season={activeTheme.season} decor={activeTheme.decor} />}
      {features.whatsappButton && (
        <a
          href={wa}
          className="floating-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          id="whatsapp-float-btn"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      )}

      <div className={styles.footerTop}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.footerLogo} aria-label="Sparsh Divine Art Studio - Home">
                <Wordmark tone={themeMode(activeTheme)} size="lg" className={styles.footerLogoImg} />
              </Link>
              <p className={styles.brandDesc}>
                {footer.about} {footer.tagline && <span className="hindi-phrase">{footer.tagline}</span>}
              </p>
              {social.links.length > 0 && (
                <div className={styles.socialLinks}>
                  {social.links.map((s, i) => (
                    <a
                      key={`${s.url}-${i}`}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBtn}
                      aria-label={`Follow us on ${s.label}`}
                      title={s.label}
                    >
                      <SocialIcon label={s.label} url={s.url} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {footer.shopLinks.length > 0 && (
              <div className={styles.linksCol}>
                <h3 className={styles.colTitle}>Shop</h3>
                <ul className={styles.linkList}>
                  {footer.shopLinks.map((l, i) => (
                    <li key={`${l.href}-${i}`}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(footer.studioLinks.length > 0 || footer.showAdminLink) && (
              <div className={styles.linksCol}>
                <h3 className={styles.colTitle}>Studio</h3>
                <ul className={styles.linkList}>
                  {footer.studioLinks.map((l, i) => (
                    <li key={`${l.href}-${i}`}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                  {footer.showAdminLink && (
                    <li>
                      <Link href="/admin" className={styles.adminLink}>Studio Admin</Link>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Contact */}
            <div className={styles.contactCol}>
              <h3 className={styles.colTitle}>Get in Touch</h3>
              <div className={styles.contactList}>
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className={styles.contactItem} id="footer-email">
                    <Mail size={16} />
                    <span>{contact.email}</span>
                  </a>
                )}
                {contact.phoneDisplay && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className={styles.contactItem} id="footer-whatsapp">
                    <Phone size={16} />
                    <span>{contact.phoneDisplay}</span>
                  </a>
                )}
                {contact.location && (
                  <div className={styles.contactItem}>
                    <MapPin size={16} />
                    <span>{contact.location}</span>
                  </div>
                )}
              </div>
              {footer.payments.length > 0 && (
                <div className={styles.paymentMethods}>
                  <p className={styles.payLabel}>We accept</p>
                  <div className={styles.payIcons}>
                    {footer.payments.map((p) => (
                      <span key={p} className={styles.payBadge}>{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.footerBottomInner}>
            <p>
              © {year} {footer.copyright}. Made with <Heart size={13} className={styles.heart} /> in India.
            </p>
            <p className={styles.footerBottomRight}>
              <Link href="/faq">FAQ</Link>
              <span>·</span>
              <Link href="/contact">Contact</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
