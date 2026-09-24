import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Convert dates and variants to JSON serializable objects if necessary
  const serializedProduct = {
    ...product,
    variants: product.variants ? JSON.parse(JSON.stringify(product.variants)) : null,
  };

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-xl)', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
        Edit Product: {product.name}
      </h1>
      <ProductForm initialData={serializedProduct} productId={product.id} />
    </div>
  );
}
