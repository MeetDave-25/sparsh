import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import lux from './lux.module.css';
import styles from './BigType.module.css';

export default function BigType() {
  return (
    <section className={styles.section}>
      <div className={`${lux.container} ${styles.grid}`}>
        <div className={styles.type}>
          <p className={styles.kicker}>The SpArsh signature</p>
          <h2 className={styles.giant}>
            <span>Hand</span>
            <span>Poured</span>
          </h2>
          <p className={styles.script}>bilkul aapke liye</p>
          <Link href="/products?category=candles" className={lux.btnGlow}>
            Explore the collection
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.photoFrame}>
          <div className={styles.photo}>
            <Image
              src="/products/glow-summer-breeze.jpg"
              alt="SpArsh Glow Summer Breeze soy candle with frangipani"
              fill
              sizes="(max-width: 900px) 90vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <span className={styles.tag}>Glow · Summer Breeze</span>
        </div>
      </div>
    </section>
  );
}
