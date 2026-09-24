import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { isRemoteImage, type FeaturedContent } from '@/lib/homeContent';
import styles from './FeaturedProducts.module.css';

export default async function FeaturedProducts({ content }: { content: FeaturedContent }) {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    take: 6,
  });
  
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.heading}</h2>
          <div className="divider" />
          <p className="hindi-phrase">{content.tagline}</p>
        </div>

        <div className={styles.grid}>
          {featured.map((product: any, i: number) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className={styles.productCard}
              id={`featured-product-${product.id}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={styles.imageWrapper}>
                {product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    unoptimized={isRemoteImage(product.images[0])}
                  />
                )}
                <div className={styles.badges}>
                  {product.isNew && <span className="badge badge-new">New</span>}
                  {product.tags?.includes('bestseller') && <span className="badge badge-bestseller">Bestseller</span>}
                  {product.customizable && <span className="badge badge-custom">✨ Customisable</span>}
                </div>
                <div className={styles.quickActions}>
                  <Link
                    href="/customize"
                    className={styles.quickBtn}
                    id={`quick-customize-${product.id}`}
                  >
                    ✨ Customise
                  </Link>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.category}>{product.category}</p>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.desc}>{product.shortDesc}</p>
                <div className={styles.footer}>
                  <span className={styles.price}>{product.priceRange}</span>
                  <span className={styles.viewBtn}>View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.viewAll}>
          <Link href="/products" className="btn btn-secondary btn-lg" id="view-all-products-btn">
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
