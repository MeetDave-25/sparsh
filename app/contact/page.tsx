import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import SocialIcon from '@/components/layout/SocialIcon';
import { getContent, getSiteSettings } from '@/lib/siteContent';
import { whatsappLink } from '@/lib/content/docs';
import ContactForm from './ContactForm';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact Us | Sparsh Divine Art Studio',
  description: 'Get in touch with Sparsh Divine Art Studio for custom orders, collaborations, or general inquiries. Reach out via WhatsApp or email.',
};

export default async function ContactPage() {
  const [{ hero, intro, form }, { contact, social }] = await Promise.all([getContent('contact'), getSiteSettings()]);
  const whatsappNote = [intro.whatsappNote, contact.hours].filter(Boolean).join(' · ');

  return (
    <div className={styles.page}>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} accent={hero.accent} subtitle={hero.subtitle} compact />

      <div className="container">
        <div className={styles.grid}>
          {/* Info Side */}
          <Reveal variant="left" className={styles.infoCol}>
            <div className={styles.infoCard}>
              <h2>{intro.heading}</h2>
              <p className={styles.infoDesc}>{intro.text}</p>

              <Stagger className={styles.contactMethods} gap={0.12}>
                {contact.phoneDisplay && (
                  <StaggerItem variant="left">
                    <a href={whatsappLink(contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className={styles.method}>
                      <div className={styles.iconWrapper}><Phone size={24} /></div>
                      <div>
                        <h3>WhatsApp</h3>
                        <p>{contact.phoneDisplay}</p>
                        {whatsappNote && <span className={styles.meta}>{whatsappNote}</span>}
                      </div>
                    </a>
                  </StaggerItem>
                )}
                {contact.email && (
                  <StaggerItem variant="left">
                    <a href={`mailto:${contact.email}`} className={styles.method}>
                      <div className={styles.iconWrapper}><Mail size={24} /></div>
                      <div>
                        <h3>Email</h3>
                        <p>{contact.email}</p>
                        {intro.emailNote && <span className={styles.meta}>{intro.emailNote}</span>}
                      </div>
                    </a>
                  </StaggerItem>
                )}
                {intro.locationTitle && (
                  <StaggerItem variant="left">
                    <div className={styles.method}>
                      <div className={styles.iconWrapper}><MapPin size={24} /></div>
                      <div>
                        <h3>Location</h3>
                        <p>{intro.locationTitle}</p>
                        {intro.locationNote && <span className={styles.meta}>{intro.locationNote}</span>}
                      </div>
                    </div>
                  </StaggerItem>
                )}
              </Stagger>

              {social.links.length > 0 && (
                <div className={styles.social}>
                  <p>{intro.socialHeading}</p>
                  <div className={styles.socialLinks}>
                    {social.links.map((s, i) => (
                      <a key={`${s.url}-${i}`} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                        <SocialIcon label={s.label} url={s.url} size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Form Side */}
          <Reveal variant="right" delay={0.15} className={styles.formCol}>
            <ContactForm email={contact.email} heading={form.heading} buttonLabel={form.buttonLabel} note={form.note} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
