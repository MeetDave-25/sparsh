import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import ParallaxImage from '@/components/motion/ParallaxImage';
import Reveal from '@/components/motion/Reveal';
import { getContent } from '@/lib/siteContent';
import styles from './post.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

async function findPost(slug: string) {
  const { posts } = await getContent('journal');
  return posts.items.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await findPost((await params).slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Sparsh Divine Art Studio`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await findPost((await params).slug);
  if (!post) notFound();

  // Paragraphs are separated by an empty line in the admin editor.
  const paragraphs = post.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const meta = [post.author && `By ${post.author}`, post.date, post.readTime].filter(Boolean).join(' · ');

  return (
    <article className={styles.article}>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        subtitle={meta ? <span className={styles.heroMeta}>{meta}</span> : undefined}
        compact
      />

      <div className="container-sm">
        <Link href="/blog" className={styles.backBtn}>
          <ArrowLeft size={16} />
          Back to Journal
        </Link>

        {post.image && (
          <ParallaxImage src={post.image} alt={post.title} className={styles.imageWrapper} priority sizes="(max-width: 800px) 100vw, 800px" />
        )}

        <div className={styles.content}>
          {post.excerpt && (
            <Reveal>
              <p className={styles.lead}>{post.excerpt}</p>
            </Reveal>
          )}
          {paragraphs.map((para, i) => (
            <Reveal key={i} delay={i === 0 ? 0.1 : 0}>
              <p style={{ whiteSpace: 'pre-line' }}>{para}</p>
            </Reveal>
          ))}
        </div>

        <Reveal variant="zoom" className={styles.footer}>
          <p className="hindi-phrase text-center">Dil se banaya, aapke liye.</p>
        </Reveal>
      </div>
    </article>
  );
}
