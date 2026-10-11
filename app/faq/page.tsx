import type { Metadata } from 'next';
import { getContent, getSiteSettings } from '@/lib/siteContent';
import { whatsappLink } from '@/lib/content/docs';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'FAQ | Sparsh Divine Art Studio',
  description: 'Answers about custom orders, shipping, payments and caring for your handmade candles, resin art and jewellery.',
};

export default async function FAQPage() {
  const [content, site] = await Promise.all([getContent('faq'), getSiteSettings()]);
  return <FaqClient content={content} whatsappUrl={whatsappLink(site.contact.whatsappNumber)} />;
}
