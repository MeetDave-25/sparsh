import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { isRemoteImage, type FeaturedContent, type ScentsContent } from '@/lib/homeContent';
import LuxHeading from './LuxHeading';
import lux from './lux.module.css';
import styles from './MostLoved.module.css';

const WAVE = 'M0,40 C180,90 320,0 520,34 C720,68 860,8 1060,38 C1240,64 1340,24 1440,40 L1440,0 L0,0 Z';

// Built from the signature scents (the studio's own photography) rather than the
// product table, whose seed entries still carry stock photos.
export default function MostLoved({ content, scents }: { content: FeaturedContent; scents: ScentsContent }) {
  if (scents.items.length === 0) return null;
  const href = scents.ctaHref || '/products?category=candles';

  return (
    <section className={styles.section} data-nav="dark">
      <svg className={`${lux.wave} ${lux.waveTop}`} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d={WAVE} fill="var(--ivory)" />
      </svg>

      <div className={`${lux.container} ${styles.inner}`}>
        <LuxHeading eyebrow={content.eyebrow} lead="Most Loved" script="Pieces" sub={content.tagline} dark />

        <div className={styles.layout}>
          <Link href={href} className={styles.feature}>
            <span className={styles.featureFrame}>
              <span className={styles.featurePhoto}>
                <Image
                  src="/story/mocha-splash.jpg"
                  alt="SpArsh Mocha Coffee Latte soy candle in a splash of coffee and cream"
                  fill
                  sizes="(max-width: 900px) 90vw, 34vw"
                  style={{ objectFit: 'cover' }}
                />
              </span>
            </span>
            <span className={styles.featureCaption}>
              <span className={styles.featureScript}>View the</span>
              <span className={styles.featureTitle}>collection</span>
            </span>
          </Link>

          <ul className={styles.row}>
            {scents.items.map((scent) => (
              <li key={scent.name} className={styles.cardItem}>
                <Link href={href} className={styles.card}>
                  <span className={styles.cardPhoto}>
                    <Image
                      src={scent.image}
                      alt={`SpArsh ${scent.name} ${scent.note} soy candle`}
                      fill
                      sizes="(max-width: 900px) 62vw, 18vw"
                      unoptimized={isRemoteImage(scent.image)}
                      style={{ objectFit: 'cover' }}
                    />
                    <span className={styles.badge}>Customisable</span>
                  </span>
                  <span className={styles.cardBody}>
                    <span className={styles.cardCat}>Roshnai · Soy candle</span>
                    <span className={styles.cardName}>
                      {scent.name} {scent.note}
                    </span>
                    <span className={styles.cardPrice}>
                      Shop now <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footer}>
          <Link href="/products" className={lux.btnOutline}>
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <svg className={`${lux.wave} ${lux.waveBottom}`} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d={WAVE} fill="var(--ivory)" />
      </svg>
    </section>
  );
}
