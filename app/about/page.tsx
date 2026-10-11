import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/motion/Reveal';
import SplitHeading from '@/components/motion/SplitHeading';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import TiltCard from '@/components/motion/TiltCard';
import Marquee from '@/components/motion/Marquee';
import { getContent } from '@/lib/siteContent';
import { isRemoteImage } from '@/lib/homeContent';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'Our Story — About Sparsh Divine Art Studio',
  description: 'Learn about Sparsh Divine Art Studio — a handmade brand born from a passion for artisan crafts, candles, resin art, and jewellery. Made with love in India.',
};

export default async function AboutPage() {
  const { hero, story, marquee, values, collections, cta } = await getContent('about');

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        accent={hero.accent}
        subtitle={
          <>
            {hero.quote && <em className="hindi-phrase">&ldquo;{hero.quote}&rdquo;</em>} {hero.subtitle}
          </>
        }
        image={hero.image || undefined}
        imageAlt={hero.imageAlt}
      />

      {/* Origin story */}
      <section className={`container ${styles.storySection}`}>
        <Reveal variant="left" className={styles.storyImageCol}>
          <TiltCard className={styles.storyImage} max={8}>
            {story.image && (
              <Image src={story.image} alt={story.imageAlt} fill sizes="(max-width: 900px) 90vw, 40vw" style={{ objectFit: 'cover' }} unoptimized={isRemoteImage(story.image)} />
            )}
          </TiltCard>
          {(story.stampTop || story.stampBottom) && (
            <div className={styles.storyStamp}>
              <span>{story.stampTop}</span>
              <strong>{story.stampBottom}</strong>
            </div>
          )}
        </Reveal>
        <div className={styles.storyText}>
          <Reveal variant="up">
            <p className="eyebrow">{story.eyebrow}</p>
          </Reveal>
          <SplitHeading text={story.heading} className={styles.sectionTitle} />
          {story.paragraphs.map((para, i) => (
            <Reveal key={i} variant="up" delay={0.15 * (i + 1)}>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {marquee.words.length > 0 && <Marquee items={marquee.words} />}

      {/* Values */}
      {values.items.length > 0 && (
      <section className={`container ${styles.valuesSection}`}>
        <div className="section-header">
          <Reveal>
            <p className="eyebrow">{values.eyebrow}</p>
          </Reveal>
          <SplitHeading text={values.heading} />
          <div className="divider" />
        </div>
        <Stagger className={styles.valuesGrid} gap={0.12}>
          {values.items.map((v, i) => (
            <StaggerItem key={`${v.title}-${i}`}>
              <TiltCard className={styles.valueCard}>
                <span className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.valueEmoji}>{v.emoji}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      )}

      {/* What we make */}
      {collections.items.length > 0 && (
      <section className={`container ${styles.collectionsSection}`}>
        <div className="section-header">
          <Reveal>
            <p className="eyebrow">{collections.eyebrow}</p>
          </Reveal>
          <SplitHeading text={collections.heading} />
          <div className="divider" />
        </div>
        <Stagger className={styles.collectionsList} gap={0.1}>
          {collections.items.map((c, i) => (
            <StaggerItem key={`${c.name}-${i}`} variant="left" className={styles.collectionItem}>
              <span className={styles.collNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.collEmoji}>{c.emoji}</span>
              <div>
                <h4>{c.name}</h4>
                <p>{c.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      )}

      {/* CTA */}
      <section className="container">
        <Reveal variant="zoom" className={styles.ctaSection}>
          <SplitHeading text={cta.heading} />
          {cta.tagline && <p className="hindi-phrase">{cta.tagline}</p>}
          <div className={styles.ctaBtns}>
            {cta.primaryLabel && <Link href={cta.primaryHref || '/products'} className="btn btn-primary btn-lg" id="about-shop-btn">{cta.primaryLabel}</Link>}
            {cta.secondaryLabel && <Link href={cta.secondaryHref || '/customize'} className="btn btn-secondary btn-lg" id="about-customize-btn">{cta.secondaryLabel}</Link>}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
