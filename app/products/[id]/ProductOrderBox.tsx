'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './product.module.css';

type Product = {
  name: string;
  category: string;
  customizable: boolean;
  variants: any;
};

export default function ProductOrderBox({ product }: { product: Product }) {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleSelect = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const getCustomizationsText = () => {
    if (!product.customizable) return '';
    const lines = Object.entries(selections).map(([k, v]) => `- ${k}: ${v}`);
    return lines.join('\n');
  };

  const customizations = getCustomizationsText();
  const textMessage = `Hi, I would like to order the ${product.name}` + (customizations ? `\n\nMy selected options:\n${customizations}` : '');
  const orderUrl = `https://wa.me/918160901481?text=${encodeURIComponent(textMessage)}`;

  return (
    <>
      {product.customizable ? (
        <div className={styles.customBox}>
          <h3>✨ Make it yours</h3>
          <p style={{ marginBottom: '16px' }}>Personalize your order by selecting options below:</p>
          
          {product.variants && Object.entries(product.variants as Record<string, string[]>).map(([key, options]) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '6px', color: 'var(--text-main)' }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <select 
                className="form-select" 
                onChange={(e) => handleSelect(key, e.target.value)}
                value={selections[key] || ''}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
              >
                <option value="">Select {key}...</option>
                {options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          <a 
            href={orderUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className={`btn btn-primary w-full ${styles.customBtn}`} 
            id="product-customize-btn"
          >
            Customize & Order
          </a>
          <div className={styles.customNote}>
            <CheckCircle2 size={14} /> You pay only after we confirm your custom design.
          </div>
        </div>
      ) : (
        <a 
          href={orderUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary w-full"
          style={{ marginTop: '24px' }}
          id="product-whatsapp-btn"
        >
          Order via WhatsApp
        </a>
      )}
    </>
  );
}
