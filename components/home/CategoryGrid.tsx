import Link from 'next/link';
import Image from 'next/image';
import { isRemoteImage, type CategoriesContent, type CategoryItem } from '@/lib/homeContent';
import styles from './CategoryGrid.module.css';

function CategoryCard({ cat, large }: { cat: CategoryItem; large?: boolean }) {
  return (
    <Link
      href={cat.slug ? `/products?category=${encodeURIComponent(cat.slug)}` : '/products'}
      className={`${styles.card} ${large ? styles.cardLarge : ''}`}
      id={`cat-${cat.slug}`}
    >
      <div className={styles.cardImg}>
        {cat.image && (
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            sizes={large ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
            style={{ objectFit: 'cover' }}
            unoptimized={isRemoteImage(cat.image)}
          />
        )}
      </div>
      <div className={styles.cardOverlay}>
        <div className={styles.cardEmoji}>{cat.emoji}</div>
        <div className={styles.cardHindi}>{cat.hindi}</div>
        <h3 className={styles.cardName}>{cat.name}</h3>
        <p className={styles.cardDesc}>{cat.desc}</p>
        <span className={styles.cardCTA}>Shop Now →</span>
      </div>
    </Link>
  );
}

export default function CategoryGrid({ content }: { content: CategoriesContent }) {
  const [first, ...rest] = content.items;
  if (!first) return null;

  return (
    <section className={`section ${styles.catSection}`}>
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.heading}</h2>
          <div className="divider" />
          <p>{content.subtitle}</p>
        </div>

        <div className={styles.grid}>
          <CategoryCard cat={first} large />
          {rest.length > 0 && (
            <div className={styles.rightGrid}>
              {rest.map((cat, i) => (
                <CategoryCard key={i} cat={cat} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
