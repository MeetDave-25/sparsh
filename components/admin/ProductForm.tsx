'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import ImagePicker from './content/ImagePicker';
import styles from './ProductForm.module.css';

type ProductFormData = {
  name: string;
  category: string;
  price: number;
  priceRange: string;
  description: string;
  shortDesc: string;
  images: { url: string }[];
  tags: { name: string }[];
  customizable: boolean;
  featured: boolean;
  isNew: boolean;
  stock: string;
  variants: { name: string; values: string }[];
};

export default function ProductForm({ initialData, productId }: { initialData?: any, productId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<ProductFormData>({
    defaultValues: initialData ? {
      ...initialData,
      images: initialData.images?.map((url: string) => ({ url })) || [],
      tags: initialData.tags?.map((name: string) => ({ name })) || [],
      variants: initialData.variants ? Object.entries(initialData.variants).map(([name, values]: any) => ({ name, values: values.join(', ') })) : [{ name: '', values: '' }]
    } : {
      images: [{ url: '' }],
      tags: [{ name: '' }],
      variants: [{ name: '', values: '' }],
      customizable: false,
      featured: false,
      isNew: false,
      stock: 'available'
    }
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: 'images' });
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: 'tags' });
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({ control, name: 'variants' });
  const isCustomizable = watch('customizable');

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    setError('');
    
    const variantsObj: Record<string, string[]> = {};
    if (data.customizable) {
      data.variants.forEach(v => {
        if (v.name && v.values) {
          variantsObj[v.name.trim()] = v.values.split(',').map(s => s.trim()).filter(Boolean);
        }
      });
    }

    // Transform arrays back to strings
    const payload = {
      ...data,
      images: data.images.map(img => img.url).filter(Boolean),
      tags: data.tags.map(tag => tag.name).filter(Boolean),
      variants: data.customizable && Object.keys(variantsObj).length > 0 ? variantsObj : null,
    };

    try {
      const url = productId ? `/api/products/${productId}` : '/api/products';
      const method = productId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save product');
      
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Name</label>
          <input {...register('name', { required: true })} className={styles.input} />
        </div>
        
        <div className={styles.field}>
          <label>Category</label>
          <input {...register('category', { required: true })} className={styles.input} />
        </div>
        
        <div className={styles.field}>
          <label>Price</label>
          <input type="number" step="0.01" {...register('price', { required: true })} className={styles.input} />
        </div>
        
        <div className={styles.field}>
          <label>Price Range (e.g. ₹999 - ₹1,499)</label>
          <input {...register('priceRange', { required: true })} className={styles.input} />
        </div>
      </div>

      <div className={styles.field}>
        <label>Short Description</label>
        <textarea {...register('shortDesc', { required: true })} className={styles.textarea} rows={2} />
      </div>

      <div className={styles.field}>
        <label>Full Description</label>
        <textarea {...register('description', { required: true })} className={styles.textarea} rows={5} />
      </div>

      <div className={styles.fieldArray}>
        <label>Images (the first one is the main photo)</label>
        {imageFields.map((field, index) => (
          <div key={field.id} className={styles.arrayRow}>
            <div style={{ flex: 1 }}>
              <Controller
                control={control}
                name={`images.${index}.url` as const}
                render={({ field: f }) => (
                  <ImagePicker label={`Image ${index + 1}`} value={f.value || ''} onChange={f.onChange} />
                )}
              />
            </div>
            <button type="button" onClick={() => removeImage(index)} className={styles.btnDanger} style={{ alignSelf: 'flex-start' }}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendImage({ url: '' })} className={styles.btnSecondary}>Add Image</button>
      </div>

      <div className={styles.fieldArray}>
        <label>Tags</label>
        {tagFields.map((field, index) => (
          <div key={field.id} className={styles.arrayRow}>
            <input {...register(`tags.${index}.name` as const)} className={styles.input} placeholder="Tag" />
            <button type="button" onClick={() => removeTag(index)} className={styles.btnDanger}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendTag({ name: '' })} className={styles.btnSecondary}>Add Tag</button>
      </div>

      <div className={styles.checkboxGrid}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" {...register('customizable')} />
          Customizable
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" {...register('featured')} />
          Featured
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" {...register('isNew')} />
          Is New
        </label>
      </div>

      {isCustomizable && (
        <div className={styles.fieldArray} style={{ padding: '16px', background: 'var(--bg-alt)', borderRadius: '8px', marginBottom: '24px' }}>
          <label>Custom Options (Variants)</label>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '12px' }}>
            Define the options a user can select when ordering. E.g. Name: "Size", Values: "Small, Medium, Large"
          </p>
          {variantFields.map((field, index) => (
            <div key={field.id} className={styles.arrayRow}>
              <input {...register(`variants.${index}.name` as const)} className={styles.input} placeholder="Option Name (e.g. Size)" style={{ flex: '1' }} />
              <input {...register(`variants.${index}.values` as const)} className={styles.input} placeholder="Values (comma separated)" style={{ flex: '2' }} />
              <button type="button" onClick={() => removeVariant(index)} className={styles.btnDanger}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => appendVariant({ name: '', values: '' })} className={styles.btnSecondary}>Add Custom Option</button>
        </div>
      )}

      <div className={styles.field}>
        <label>Stock Status</label>
        <select {...register('stock')} className={styles.select}>
          <option value="available">Available</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="made_to_order">Made to Order</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className={styles.btnPrimary}>
        {loading ? 'Saving...' : 'Save Product'}
      </button>
    </form>
  );
}
