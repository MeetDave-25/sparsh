import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const id = (await params).id;
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        slug: body.slug,
        name: body.name,
        category: body.category,
        price: Number(body.price),
        priceRange: body.priceRange,
        description: body.description,
        shortDesc: body.shortDesc,
        images: body.images,
        tags: body.tags,
        customizable: Boolean(body.customizable),
        variants: body.variants ? body.variants : null,
        featured: Boolean(body.featured),
        isNew: Boolean(body.isNew),
        stock: body.stock,
      },
    });
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath(`/products/${id}`);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const id = (await params).id;
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/products');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
