import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import GalleryClient, { type GalleryImage } from './GalleryClient';
import { prisma } from '@/lib/prisma';
import { BUILTIN_IMAGES } from '@/lib/builtinImages';
import { getContent } from '@/lib/siteContent';
import type { GalleryContent } from '@/lib/content/docs';
import styles from './gallery.module.css';

export const metadata: Metadata = {
  title: 'Gallery & Lookbook | Sparsh Divine Art Studio',
  description: 'Explore our gallery of handmade candles, resin art, and jewelry. Get inspired for your next custom order.',
};

// Picks up new product photos without a redeploy
export const revalidate = 300;

async function getGalleryImages(photos: GalleryContent['photos']): Promise<GalleryImage[]> {
  const own: GalleryImage[] = photos.items
    .filter((p) => p.image)
    .map((p) => ({ url: p.image, caption: p.caption, group: p.group || 'Studio' }));

  const brand: GalleryImage[] = !photos.includeBrand ? [] : BUILTIN_IMAGES.map((b) => ({
    url: b.url,
    caption: b.label,
    group: b.url.startsWith('/story/') ? 'Stories' : 'Candles',
  }));

  let products: GalleryImage[] = [];
  if (photos.includeProducts) {
    try {
      const rows = await prisma.product.findMany({ select: { name: true, category: true, images: true }, orderBy: { createdAt: 'desc' } });
      products = rows.flatMap((p) =>
        p.images.filter(Boolean).map((url) => ({
          url,
          caption: p.name,
          group: p.category.charAt(0).toUpperCase() + p.category.slice(1),
        }))
      );
    } catch (error) {
      console.error('Gallery: could not load product images', error);
    }
  }

  const seen = new Set<string>();
  const unique = [...own, ...brand, ...products].filter((img) => (seen.has(img.url) ? false : (seen.add(img.url), true)));

  // Old product records point at external photos that have since been deleted; skip those
  const alive = await Promise.all(unique.map((img) => (img.url.startsWith('/') ? true : isReachable(img.url))));
  return unique.filter((_, i) => alive[i]);
}

async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(4000) });
    return res.ok && (res.headers.get('content-type') ?? '').startsWith('image/');
  } catch {
    return false;
  }
}

export default async function GalleryPage() {
  const { hero, photos } = await getContent('gallery');
  const images = await getGalleryImages(photos);

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
        <GalleryClient images={images} />
      </div>
    </div>
  );
}
