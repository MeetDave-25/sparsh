import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import blogData from '@/data/blog.json';
import PageHero from '@/components/layout/PageHero';
import ParallaxImage from '@/components/motion/ParallaxImage';
import Reveal from '@/components/motion/Reveal';
import styles from './post.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogData.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogData.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Sparsh Divine Art Studio`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogData.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className={styles.article}>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        subtitle={
          <span className={styles.heroMeta}>
            By {post.author} · {post.date} · {post.readTime}
          </span>
        }
        compact
      />

      <div className="container-sm">
        <Link href="/blog" className={styles.backBtn}>
          <ArrowLeft size={16} />
          Back to Journal
        </Link>

        <ParallaxImage src={post.image} alt={post.title} className={styles.imageWrapper} priority sizes="(max-width: 800px) 100vw, 800px" />

        <div className={styles.content}>
          <Reveal>
            <p className={styles.lead}>{post.excerpt}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>{post.content}</p>
          </Reveal>
          {/* Note: In a real app, content would be rich text / MDX */}
          <div className={styles.placeholderContent}>
            <Reveal>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </Reveal>
            <Reveal>
              <h3>Handcrafted with Intention</h3>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </Reveal>
            <Reveal variant="left">
              <blockquote>&ldquo;Har cheez mein pyaar hai — aapka bhi order aisa hi hoga.&rdquo;</blockquote>
            </Reveal>
            <Reveal>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            </Reveal>
          </div>
        </div>

        <Reveal variant="zoom" className={styles.footer}>
          <p className="hindi-phrase text-center">Dil se banaya, aapke liye.</p>
        </Reveal>
      </div>
    </article>
  );
}
