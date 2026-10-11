import Link from 'next/link';
import ProductImage from '@/components/product/ProductImage';
import { prisma } from '@/lib/prisma';
import styles from './ProductsAdmin.module.css';
import { Edit, Plus } from 'lucide-react';
import DeleteProductButton from './DeleteProductButton';

// Always show the latest list after adding, editing or deleting.
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className={styles.imgCell}>
                  <div className={styles.imgWrapper}>
                    <ProductImage src={product.images[0]} alt={product.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
                  </div>
                </td>
                <td className={`${styles.fw600} ${styles.nameCell}`}>{product.name}</td>
                <td className={styles.catCell}>{product.category}</td>
                <td className={styles.priceCell}>₹{product.price}</td>
                <td className={styles.statusCell}>
                  <span className={`${styles.badge} ${styles['badge-' + product.stock.replace(/_/g, '-')]}`}>
                    {product.stock.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <div className={styles.actions}>
                    <Link href={`/admin/products/${product.id}/edit`} className={styles.actionBtn} aria-label={`Edit ${product.name}`}>
                      <Edit size={16} />
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyState}>No products found. Create one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
