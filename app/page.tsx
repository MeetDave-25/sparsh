import type { Metadata } from 'next';
import IntroReveal from '@/components/intro/IntroReveal';
import ProductJourney from '@/components/home/journey/ProductJourney';
import BenefitsMarquee from '@/components/home/lux/BenefitsMarquee';
import CollectionArches from '@/components/home/lux/CollectionArches';
import MostLoved from '@/components/home/lux/MostLoved';
import MomentsStrip from '@/components/home/lux/MomentsStrip';
import MoodSlider from '@/components/home/lux/MoodSlider';
import MakeItYours from '@/components/home/lux/MakeItYours';
import GiftBundles from '@/components/home/lux/GiftBundles';
import WhatPeopleSay from '@/components/home/lux/WhatPeopleSay';
import BigType from '@/components/home/lux/BigType';
import { getHomeContent, getSiteSettings } from '@/lib/siteContent';

export const metadata: Metadata = {
  title: 'Sparsh Divine Art Studio — Handmade Candles, Resin Art & Jewellery',
  description:
    'Discover handcrafted candles, resin art, jewellery, stationery & custom gift hampers made with love in India. Custom orders welcome.',
};

export default async function HomePage() {
  const [content, site] = await Promise.all([getHomeContent(), getSiteSettings()]);
  const show = site.homeSections;

  return (
    <div className="lux" data-nav="light">
      {site.features.welcomeScreen && <IntroReveal />}
      <ProductJourney hero={content.hero} craft={content.craft} scents={content.scents} />
      {show.marquee && <BenefitsMarquee />}
      {show.collections && <CollectionArches content={content.categories} />}
      {show.mostLoved && <MostLoved content={content.featured} scents={content.scents} />}
      {show.moments && <MomentsStrip />}
      {show.moodSlider && <MoodSlider />}
      {show.makeItYours && <MakeItYours content={content.customOrder} />}
      {show.giftBundles && <GiftBundles />}
      {show.testimonials && <WhatPeopleSay content={content.testimonials} />}
      {show.bigType && <BigType />}
    </div>
  );
}
