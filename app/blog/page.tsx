import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import TiltCard from '@/components/motion/TiltCard';
import { getContent } from '@/lib/siteContent';
import { isRemoteImage } from '@/lib/homeContent';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Journal | Sparsh Divine Art Studio',
  description: 'Read our latest thoughts on handcrafted goods, care tips for candles and jewelry, and stories behind our creations.',
};

export default async function BlogPage() {
  const { hero, posts } = await getContent('journal');
  const [lead, ...rest] = posts.items;

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        accent={hero.accent}
        subtitle={hero.subtitle}
        compact
      />

      <div className="container">
        {!lead && <p style={{ textAlign: 'center', padding: '80px 0', opacity: 0.7 }}>New stories are on their way.</p>}
        {lead && (
          <Reveal variant="zoom">
            <Link href={`/blog/${lead.slug}`} className={styles.featured}>
              <TiltCard className={styles.featuredImage} max={6}>
                {lead.image && <Image src={lead.image} alt={lead.title} fill sizes="(max-width: 900px) 100vw, 55vw" style={{ objectFit: 'cover' }} priority unoptimized={isRemoteImage(lead.image)} />}
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
            <StaggerItem key={post.slug}>
              <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                <TiltCard className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {post.image && <Image src={post.image} alt={post.title} fill sizes="(max-width: 700px) 100vw, 50vw" style={{ objectFit: 'cover' }} unoptimized={isRemoteImage(post.image)} />}
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
