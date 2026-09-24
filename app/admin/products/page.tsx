import Link from 'next/link';
import Image from 'next/image';
import { isRemoteImage } from '@/lib/homeContent';
import { prisma } from '@/lib/prisma';
import styles from './ProductsAdmin.module.css';
import { Edit, Trash, Plus } from 'lucide-react';

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
            {products.map((product: any) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.imgWrapper}>
                    {product.images[0] ? (
                      <Image 
                        src={product.images[0]} 
                        unoptimized={isRemoteImage(product.images[0])}
                        alt={product.name} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                      />
                    ) : (
                      <div className={styles.noImg}>No Img</div>
                    )}
                  </div>
                </td>
                <td className={styles.fw600}>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>
                  <span className={`${styles.badge} ${styles['badge-' + product.stock.replace(/_/g, '-')]}`}>
                    {product.stock.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/products/${product.id}/edit`} className={styles.actionBtn}>
                      <Edit size={16} />
                    </Link>
                    {/* Note: In a real app we would have a delete confirmation modal */}
                    <button className={`${styles.actionBtn} ${styles.danger}`}>
                      <Trash size={16} />
                    </button>
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
