'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import type { FaqContent } from '@/lib/content/docs';
import styles from './faq.module.css';

export default function FaqClient({ content, whatsappUrl }: { content: FaqContent; whatsappUrl: string }) {
  const { hero, groups, help } = content;
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        accent={hero.accent}
        subtitle={hero.subtitle}
        compact
      />

      <div className="container-sm">
        <div className={styles.faqWrapper}>
          {groups.items.map((section, sIdx) => (
            <div key={`${section.category}-${sIdx}`} className={styles.faqSection}>
              <Reveal variant="left">
                <h2 className={styles.categoryTitle}>{section.category}</h2>
              </Reveal>
              <Stagger className={styles.accordion} gap={0.08}>
                {section.questions.map((item, iIdx) => {
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
           <h3>{help.heading}</h3>
           <p>{help.text}</p>
           <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" id="faq-whatsapp-btn">
             {help.buttonLabel}
           </a>
        </Reveal>
      </div>
    </div>
  );
}
