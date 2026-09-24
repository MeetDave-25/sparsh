import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import ArtOfCraft from '@/components/home/ArtOfCraft';
import ScentJourney from '@/components/home/ScentJourney';
import ScentCarousel3D from '@/components/home/ScentCarousel3D';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Testimonials from '@/components/home/Testimonials';
import CustomOrderCTA from '@/components/home/CustomOrderCTA';
import { getHomeContent } from '@/lib/siteContent';

export const metadata: Metadata = {
  title: 'Sparsh Divine Art Studio — Handmade Candles, Resin Art & Jewellery',
  description:
    'Discover handcrafted candles, resin art, jewellery, stationery & custom gift hampers made with love in India. Custom orders welcome.',
};

export default async function HomePage() {
  const content = await getHomeContent();

  return (
    <>
      <Hero content={content.hero} />
      <ArtOfCraft content={content.craft} />
      <ScentJourney content={content.journey} />
      <ScentCarousel3D content={content.scents} />
      <CategoryGrid content={content.categories} />
      <FeaturedProducts content={content.featured} />
      <CustomOrderCTA content={content.customOrder} />
      <Testimonials content={content.testimonials} />
    </>
  );
}
