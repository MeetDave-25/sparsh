import type { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';

import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Shop All Products — Handmade Candles, Resin Art & Jewellery',
  description:
    'Browse our full collection of handmade candles, resin art, jewellery, stationery, and custom gift hampers. All products can be customised to order.',
};

export const revalidate = 0; // Disable static caching so it always gets latest from DB

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  // Convert complex data types to JSON-serializable for Client component
  const serializedProducts = products.map((p: any) => ({
    ...p,
    variants: p.variants ? JSON.parse(JSON.stringify(p.variants)) : null
  }));

  return <ProductsPageClient initialProducts={serializedProducts} />;
}
