import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-xl)', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
        Add New Product
      </h1>
      <ProductForm />
    </div>
  );
}
