import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import LuxHeading from './LuxHeading';
import lux from './lux.module.css';
import styles from './GiftBundles.module.css';

// Tier prices and contents are placeholders within the real ₹1,499–₹3,499
// hamper range until the studio confirms them.
const BUNDLES = [
  {
    name: 'Chhota Tohfa',
    price: '₹1,499',
    image: '/products/blossom-2.jpg',
    items: ['1 signature soy candle', 'Handwritten note', 'Hand-tied gift wrap'],
    featured: false,
  },
  {
    name: 'Dil Se Hamper',
    price: '₹2,499',
    image: '/story/blossom-ad-card.jpg',
    items: ['2 signature soy candles', 'Resin bookmark or keychain', 'Handwritten note', 'Keepsake gift box'],
    featured: true,
  },
  {
    name: 'Grand Tohfa',
    price: '₹3,499',
    image: '/products/mocha-coffee-latte-2.jpg',
    items: ['3 signature soy candles', 'Handmade resin tray', 'Personalised card', 'Premium keepsake box'],
    featured: false,
  },
];

export default function GiftBundles() {
  return (
    <section className={`${lux.section} ${styles.section}`}>
      <div className={lux.container}>
        <LuxHeading
          eyebrow="Tohfa · Gift hampers"
          lead="Gifts, wrapped"
          script="Dil Se"
          sub="Curated hampers for birthdays, weddings and Diwali — every one packed by hand. Want something different? We’ll build it for you."
          center
        />

        <ul className={styles.grid}>
          {BUNDLES.map((b) => (
            <li key={b.name} className={`${styles.card} ${b.featured ? styles.featured : ''}`}>
              {b.featured && <span className={styles.badge}>Most loved</span>}
              <div className={styles.photo}>
                <Image src={b.image} alt={`${b.name} gift hamper`} fill sizes="(max-width: 900px) 90vw, 30vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{b.name}</h3>
                <p className={styles.price}>
                  <span>from</span> {b.price}
                </p>
                <ul className={styles.items}>
                  {b.items.map((item) => (
                    <li key={item}>
                      <Check size={15} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/products?category=hampers" className={b.featured ? lux.btnGlow : lux.btnOutline}>
                  Choose hamper
                  <ArrowRight size={16} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
