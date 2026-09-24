import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/motion/Reveal';
import SplitHeading from '@/components/motion/SplitHeading';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import TiltCard from '@/components/motion/TiltCard';
import Marquee from '@/components/motion/Marquee';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'Our Story — About Sparsh Divine Art Studio',
  description: 'Learn about Sparsh Divine Art Studio — a handmade brand born from a passion for artisan crafts, candles, resin art, and jewellery. Made with love in India.',
};

const values = [
  { emoji: '🌿', title: 'Natural & Pure', desc: 'We use natural soy wax, cotton wicks, real dried botanicals, and non-toxic materials. What goes into your home should be safe for your family.' },
  { emoji: '💕', title: 'Made with Love', desc: 'Every piece is handcrafted in small batches. We never rush. We believe the love and care we put in can be felt in the final product.' },
  { emoji: '🎨', title: 'Uniquely Yours', desc: 'No two handmade pieces are exactly alike — that\'s the beauty of it. When you customize with us, you get something truly one-of-a-kind.' },
  { emoji: '🇮🇳', title: 'Proudly Indian', desc: 'Inspired by Indian florals, festivals, and traditions. Supporting local artisanship and creating livelihood through craft.' },
];

const collections = [
  { emoji: '🕯️', name: 'Handmade Candles', detail: 'Soy wax, beeswax & coconut oil blend candles — scented, decorative, pillar, and container styles. All natural, all beautiful.' },
  { emoji: '🌸', name: 'Resin Art', detail: 'Preserved flower resin trays, bookmarks, keychains, and décor. Every piece has real botanicals frozen in time.' },
  { emoji: '💎', name: 'Handmade Jewellery', detail: 'Crystal rings, pearl necklaces, charm bracelets — each piece handcrafted in gold, silver, or rose gold plate.' },
  { emoji: '✉️', name: 'Stationery & Crafts', detail: 'Handmade greeting cards with pressed flowers, bookmarks, and small craft items that make gifting extra special.' },
  { emoji: '🎁', name: 'Custom Gift Hampers', detail: 'Curated hampers combining our products with premium packaging — perfect for birthdays, anniversaries, Diwali, and weddings.' },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Our Story"
        title="Where Every Creation"
        accent="Begins with a Feeling"
        subtitle={
          <>
            <em className="hindi-phrase">&ldquo;Har cheez mein ek kahani hai&rdquo;</em> — every creation holds a story.
          </>
        }
        image="/story/scents-that-stay-2.jpg"
        imageAlt="SpArsh Divine Art Studio — scents that stay"
      />

      {/* Origin story */}
      <section className={`container ${styles.storySection}`}>
        <Reveal variant="left" className={styles.storyImageCol}>
          <TiltCard className={styles.storyImage} max={8}>
            <Image src="/products/mocha-coffee-latte-2.jpg" alt="A SpArsh candle glowing on a quiet evening" fill sizes="(max-width: 900px) 90vw, 40vw" style={{ objectFit: 'cover' }} />
          </TiltCard>
          <div className={styles.storyStamp}>
            <span>Est.</span>
            <strong>Dil Se</strong>
          </div>
        </Reveal>
        <div className={styles.storyText}>
          <Reveal variant="up">
            <p className="eyebrow">Chapter One</p>
          </Reveal>
          <SplitHeading text="How It Started" className={styles.sectionTitle} />
          <Reveal variant="up" delay={0.15}>
            <p>
              Sparsh Divine Art Studio was born from a quiet evening with a half-melted candle, dried flowers, and a heart full of ideas. What started as a personal hobby — pouring soy candles for friends and family — grew into something much bigger: a studio where every piece is made with intention.
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.3}>
            <p>
              We believe that handmade things carry energy. When something is crafted by hand with care, it holds a warmth that factory products simply cannot replicate. That belief drives every candle we pour, every resin piece we set, every piece of jewellery we wire-wrap.
            </p>
          </Reveal>
        </div>
      </section>

      <Marquee items={['Hand-poured', 'Small batch', '100% soy wax', 'Real botanicals', 'Made in India', 'Dil se banaya']} />

      {/* Values */}
      <section className={`container ${styles.valuesSection}`}>
        <div className="section-header">
          <Reveal>
            <p className="eyebrow">What We Believe</p>
          </Reveal>
          <SplitHeading text="Our Values" />
          <div className="divider" />
        </div>
        <Stagger className={styles.valuesGrid} gap={0.12}>
          {values.map((v, i) => (
            <StaggerItem key={v.title}>
              <TiltCard className={styles.valueCard}>
                <span className={styles.valueNum}>0{i + 1}</span>
                <div className={styles.valueEmoji}>{v.emoji}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* What we make */}
      <section className={`container ${styles.collectionsSection}`}>
        <div className="section-header">
          <Reveal>
            <p className="eyebrow">Collections</p>
          </Reveal>
          <SplitHeading text="What We Create" />
          <div className="divider" />
        </div>
        <Stagger className={styles.collectionsList} gap={0.1}>
          {collections.map((c, i) => (
            <StaggerItem key={c.name} variant="left" className={styles.collectionItem}>
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

      {/* CTA */}
      <section className="container">
        <Reveal variant="zoom" className={styles.ctaSection}>
          <SplitHeading text="Ready to Own Something Special?" />
          <p className="hindi-phrase">&ldquo;Aapke liye kuch khaas&rdquo; — Something special, just for you</p>
          <div className={styles.ctaBtns}>
            <Link href="/products" className="btn btn-primary btn-lg" id="about-shop-btn">Shop Our Collection</Link>
            <Link href="/customize" className="btn btn-secondary btn-lg" id="about-customize-btn">✨ Custom Order</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
