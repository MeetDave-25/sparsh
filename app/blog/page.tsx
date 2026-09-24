import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import blogData from '@/data/blog.json';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import TiltCard from '@/components/motion/TiltCard';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Journal | Sparsh Divine Art Studio',
  description: 'Read our latest thoughts on handcrafted goods, care tips for candles and jewelry, and stories behind our creations.',
};

export default function BlogPage() {
  const [lead, ...rest] = blogData;

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Journal"
        title="Stories &"
        accent="Inspiration"
        subtitle="Care tips, behind the scenes, and our creative journey."
        compact
      />

      <div className="container">
        {lead && (
          <Reveal variant="zoom">
            <Link href={`/blog/${lead.slug}`} className={styles.featured}>
              <TiltCard className={styles.featuredImage} max={6}>
                <Image src={lead.image} alt={lead.title} fill sizes="(max-width: 900px) 100vw, 55vw" style={{ objectFit: 'cover' }} priority />
                <span className={styles.categoryBadge}>{lead.category}</span>
              </TiltCard>
              <div className={styles.featuredBody}>
                <span className={styles.featuredLabel}>Featured story</span>
                <h2 className={styles.featuredTitle}>{lead.title}</h2>
                <p className={styles.excerpt}>{lead.excerpt}</p>
                <div className={styles.meta}>
                  <span>{lead.date}</span>
                  <span>·</span>
                  <span>{lead.readTime}</span>
                </div>
                <span className={styles.readMore}>
                  Read article <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        <Stagger className={styles.grid} gap={0.14}>
          {rest.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                <TiltCard className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <Image src={post.image} alt={post.title} fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                    <span className={styles.categoryBadge}>{post.category}</span>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.meta}>
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.excerpt}>{post.excerpt}</p>
                    <span className={styles.readMore}>
                      Read article <ArrowUpRight size={16} />
                    </span>
                  </div>
                </TiltCard>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
