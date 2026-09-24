'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import styles from './faq.module.css';

const faqs = [
  {
    category: 'Ordering & Customization',
    items: [
      { q: 'How does the custom order process work?', a: 'First, fill out our Customize form with your preferences. We will review it and reply within 24 hours via email and WhatsApp with pricing and timelines. Once you approve, you can make the payment and we begin crafting your piece!' },
      { q: 'Can I send a reference photo for a custom piece?', a: 'Yes! After you submit the form, we will connect on WhatsApp where you can share reference photos, mood boards, or sketches.' },
      { q: 'How long does a custom order take?', a: 'Typically 5-10 working days, depending on the complexity of the design and curing time (especially for resin art).' }
    ]
  },
  {
    category: 'Shipping & Delivery',
    items: [
      { q: 'Do you ship across India?', a: 'Yes, we deliver pan-India via trusted courier partners. Shipping takes 3-7 days after dispatch.' },
      { q: 'How much are the delivery charges?', a: 'Delivery is free for orders above ₹999. For orders below that, standard shipping is ₹80.' },
      { q: 'Do you offer international shipping?', a: 'Currently, we only ship within India. We hope to expand internationally soon!' }
    ]
  },
  {
    category: 'Payments & Returns',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept UPI (GPay, PhonePe, Paytm), IMPS/NEFT Bank Transfers, and Cash on Delivery (for local orders only).' },
      { q: 'Can I cancel or return a custom order?', a: 'Since custom orders are made specifically for you, we cannot accept returns or cancellations once payment is made and production has started. If an item arrives damaged, please contact us within 24 hours with a video.' }
    ]
  },
  {
    category: 'Product Care',
    items: [
      { q: 'How do I care for my soy candle?', a: 'Always trim the wick to 1/4 inch before lighting. On the first burn, let the wax melt to the edges of the jar to prevent tunneling. Never leave a burning candle unattended.' },
      { q: 'Will the jewelry tarnish?', a: 'Our jewelry is plated and tarnish-resistant. However, to keep it looking new, avoid contact with perfumes, lotions, and water. Store it in the provided pouch when not in use.' }
    ]
  }
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Help Center"
        title="Questions,"
        accent="Answered with Love"
        subtitle="Everything you need to know about our products and process."
        compact
      />

      <div className="container-sm">
        <div className={styles.faqWrapper}>
          {faqs.map((section, sIdx) => (
            <div key={section.category} className={styles.faqSection}>
              <Reveal variant="left">
                <h2 className={styles.categoryTitle}>{section.category}</h2>
              </Reveal>
              <Stagger className={styles.accordion} gap={0.08}>
                {section.items.map((item, iIdx) => {
                  const id = `${sIdx}-${iIdx}`;
                  const isOpen = openItem === id;
                  return (
                    <StaggerItem key={id} className={`${styles.accordionItem} ${isOpen ? styles.open : ''}`}>
                      <button
                        className={styles.accordionHeader}
                        onClick={() => toggle(id)}
                        aria-expanded={isOpen}
                        id={`faq-btn-${id}`}
                      >
                        <span className={styles.question}>{item.q}</span>
                        <motion.span className={styles.icon} animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.35 }}>
                          <ChevronDown size={20} />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="answer"
                            className={styles.accordionContent}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <motion.div
                              className={styles.answer}
                              initial={{ y: -8, filter: 'blur(4px)' }}
                              animate={{ y: 0, filter: 'blur(0px)' }}
                              transition={{ duration: 0.4 }}
                            >
                              {item.a}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          ))}
        </div>
        
        <Reveal variant="zoom" className={styles.contactCard}>
           <h3>Still have questions?</h3>
           <p>We&apos;re here to help! Reach out to us on WhatsApp or Email.</p>
           <a href="https://wa.me/918160901481" target="_blank" rel="noopener noreferrer" className="btn btn-primary" id="faq-whatsapp-btn">
             Chat with Us
           </a>
        </Reveal>
      </div>
    </div>
  );
}
