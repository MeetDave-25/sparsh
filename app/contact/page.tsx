import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact Us | Sparsh Divine Art Studio',
  description: 'Get in touch with Sparsh Divine Art Studio for custom orders, collaborations, or general inquiries. Reach out via WhatsApp or email.',
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Get In Touch"
        title="Let’s Create"
        accent="Something Together"
        subtitle="We’d love to hear from you! Say hello, ask a question, or discuss a custom order."
        compact
      />

      <div className="container">
        <div className={styles.grid}>
          
          {/* Info Side */}
          <Reveal variant="left" className={styles.infoCol}>
             <div className={styles.infoCard}>
                <h2>Let&apos;s Connect</h2>
                <p className={styles.infoDesc}>
                   Whether you have a question about an existing order or want to collaborate, our inbox is always open.
                </p>

                <Stagger className={styles.contactMethods} gap={0.12}>
                   <StaggerItem variant="left">
                   <a href="https://wa.me/918160901481" target="_blank" rel="noopener noreferrer" className={styles.method}>
                      <div className={styles.iconWrapper}><Phone size={24} /></div>
                      <div>
                        <h3>WhatsApp</h3>
                        <p>+91 81609 01481</p>
                        <span className={styles.meta}>Fastest response (Mon-Sat, 10am-7pm)</span>
                      </div>
                   </a>

                   </StaggerItem>
                   <StaggerItem variant="left">
                   <a href="mailto:info@sparshdivineartstudio.com" className={styles.method}>
                      <div className={styles.iconWrapper}><Mail size={24} /></div>
                      <div>
                        <h3>Email</h3>
                        <p>info@sparshdivineartstudio.com</p>
                        <span className={styles.meta}>For collaborations & bulk orders</span>
                      </div>
                   </a>

                   </StaggerItem>
                   <StaggerItem variant="left">
                   <div className={styles.method}>
                      <div className={styles.iconWrapper}><MapPin size={24} /></div>
                      <div>
                        <h3>Location</h3>
                        <p>India</p>
                        <span className={styles.meta}>Online store delivering pan-India</span>
                      </div>
                   </div>
                   </StaggerItem>
                </Stagger>

                <div className={styles.social}>
                  <p>Follow our journey</p>
                  <div className={styles.socialLinks}>
                     <a href="#" target="_blank" rel="noopener noreferrer"><Globe size={20} /></a>
                     <a href="#" target="_blank" rel="noopener noreferrer"><Globe size={20} /></a>
                  </div>
                </div>
             </div>
          </Reveal>

          {/* Form Side */}
          <Reveal variant="right" delay={0.15} className={styles.formCol}>
            <div className={styles.formCard}>
               <h2>Send a Message</h2>
               <form className={styles.form}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Name</label>
                    <input type="text" id="name" className="form-input" placeholder="Your name" required />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input type="email" id="email" className="form-input" placeholder="your@email.com" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">Subject</label>
                    <input type="text" id="subject" className="form-input" placeholder="What is this regarding?" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea id="message" className="form-textarea" placeholder="How can we help you?" required />
                  </div>

                  <button type="button" className="btn btn-primary btn-lg w-full" id="contact-submit-btn">
                     Send Message
                  </button>
                  <p className={styles.formNote}>For custom orders, please use our <a href="/customize">Custom Order Form</a> instead.</p>
               </form>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
}
