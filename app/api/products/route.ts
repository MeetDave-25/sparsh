import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        name: body.name,
        category: body.category,
        price: Number(body.price),
        priceRange: body.priceRange,
        description: body.description,
        shortDesc: body.shortDesc,
        images: body.images || [],
        tags: body.tags || [],
        customizable: Boolean(body.customizable),
        variants: body.variants ? body.variants : null,
        featured: Boolean(body.featured),
        isNew: Boolean(body.isNew),
        stock: body.stock || 'available',
      },
    });
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/products');
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
