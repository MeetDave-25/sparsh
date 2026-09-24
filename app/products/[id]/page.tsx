import type { Metadata } from 'next';
import Image from 'next/image';
import { isRemoteImage } from '@/lib/homeContent';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import styles from './product.module.css';
import ProductOrderBox from './ProductOrderBox';
import ProductGallery from './ProductGallery';
import Reveal from '@/components/motion/Reveal';
import SplitHeading from '@/components/motion/SplitHeading';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import TiltCard from '@/components/motion/TiltCard';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `${product.name} | Sparsh Divine Art Studio`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const id = (await params).id;
  const product = await prisma.product.findUnique({ where: { id } });
  
  if (!product) {
    notFound();
  }

  // Related products (same category)
  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 4
  });

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/products" className={styles.backBtn}>
          <ArrowLeft size={16} />
          Back to Shop
        </Link>

        <div className={styles.productGrid}>
          {/* Images */}
          <ProductGallery
            images={product.images}
            name={product.name}
            badges={
              (product.isNew || product.tags.includes('bestseller')) && (
                <>
                  {product.isNew && <span className="badge badge-new">New</span>}
                  {product.tags.includes('bestseller') && <span className="badge badge-bestseller">Bestseller</span>}
                </>
              )
            }
          />

          {/* Details */}
          <div className={styles.productInfo}>
            <Reveal variant="right">
              <div className={styles.category}>{product.category}</div>
            </Reveal>
            <SplitHeading as="h1" text={product.name} className={styles.title} onMount delay={0.2} />
            <Reveal variant="right" delay={0.35}>
              <div className={styles.price}>{product.priceRange}</div>
              <p className={styles.description}>{product.description}</p>
            </Reveal>

            <Reveal variant="up" delay={0.45}>
              <ProductOrderBox product={product} />
            </Reveal>

            <Stagger className={styles.features} gap={0.12}>
              {[
                { icon: '🖐️', label: '100% Handmade' },
                { icon: '✨', label: 'Premium Quality' },
                { icon: '🇮🇳', label: 'Made in India' },
              ].map((f) => (
                <StaggerItem key={f.label} className={styles.feature}>
                  <span>{f.icon}</span>
                  <p>{f.label}</p>
                </StaggerItem>
              ))}
            </Stagger>

            <div className={styles.tags}>
              {product.tags.map((tag: string) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className={styles.relatedSection}>
            <SplitHeading text="You might also like" className={styles.relatedTitle} />
            <Stagger className={styles.relatedGrid} gap={0.1}>
              {related.map((p) => (
                <StaggerItem key={p.id}>
                  <Link href={`/products/${p.id}`}>
                    <TiltCard className={styles.relatedCard}>
                      <div className={styles.relatedImage}>
                        {p.images[0] && (
                          <Image src={p.images[0]} unoptimized={isRemoteImage(p.images[0])} alt={p.name} fill sizes="(max-width: 900px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                        )}
                      </div>
                      <h3>{p.name}</h3>
                      <p>{p.priceRange}</p>
                    </TiltCard>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
      </div>
    </div>
  );
}
