'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { isRemoteImage } from '@/lib/homeContent';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import styles from './ProductsPage.module.css';

const categories = [
  { id: 'all', label: 'All Products', emoji: '✨' },
  { id: 'candles', label: 'Candles', emoji: '🕯️' },
  { id: 'resin', label: 'Resin Art', emoji: '🌸' },
  { id: 'jewelry', label: 'Jewellery', emoji: '💎' },
  { id: 'crafts', label: 'Stationery & Crafts', emoji: '✉️' },
  { id: 'hampers', label: 'Gift Hampers', emoji: '🎁' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'new', label: 'Newest First' },
];

export default function ProductsPageClient({ initialProducts }: { initialProducts: any[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [search, setSearch] = useState('');
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    let products = [...initialProducts];

    if (activeCategory !== 'all') {
      products = products.filter(p => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') products.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') products.sort((a, b) => b.price - a.price);
    else if (sortBy === 'new') products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return products;
  }, [initialProducts, activeCategory, sortBy, search]);

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <PageHero
        eyebrow="Our Collection"
        title="Shop the"
        accent="Collection"
        subtitle="Every piece handcrafted with love. All products can be personalised."
        compact
      />

      <div className="container">
        {/* Filters Bar */}
        <div className={styles.filtersBar}>
          {/* Category Pills */}
          <div className={styles.categoryPills}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`${styles.catPill} ${activeCategory === cat.id ? styles.catPillActive : ''}`}
                id={`filter-cat-${cat.id}`}
                aria-pressed={activeCategory === cat.id}
              >
                {activeCategory === cat.id && (
                  <motion.span layoutId="shopCategory" className={styles.catPillBg} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className={styles.catPillLabel}>{cat.emoji}</span>
                <span className={styles.catPillLabel}>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Right: Search + Sort */}
          <div className={styles.rightFilters}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
                id="products-search"
                aria-label="Search products"
              />
            </div>
            <div className={styles.sortBox}>
              <SlidersHorizontal size={14} />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className={styles.sortSelect}
                id="products-sort"
                aria-label="Sort products"
              >
                {sortOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className={styles.resultsCount}>
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'all' ? ` in ${categories.find(c => c.id === activeCategory)?.label}` : ''}
        </p>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <motion.div layout className={styles.grid}>
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  style={{ transformPerspective: 1000 }}
                  initial={reduceMotion ? false : { opacity: 0, rotateX: 40, y: 50, scale: 0.94 }}
                  whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, rotateY: 20, transition: { duration: 0.25 } }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/products/${product.id}`} className={styles.cardLink} id={`product-card-${product.id}`}>
                    <TiltCard className={styles.productCard} max={8}>
                      <div className={styles.imageWrapper}>
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            unoptimized={isRemoteImage(product.images[0])}
                            alt={product.name}
                            fill
                            sizes="(max-width: 600px) 50vw, (max-width: 1024px) 50vw, 25vw"
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                        <div className={styles.imgBadges}>
                          {product.isNew && <span className="badge badge-new">New</span>}
                          {product.tags.includes('bestseller') && <span className="badge badge-bestseller">★ Best</span>}
                        </div>
                        {product.customizable && <div className={styles.customBadge}>✨ Customisable</div>}
                      </div>
                      <div className={styles.cardBody}>
                        <p className={styles.category}>{product.category}</p>
                        <h2 className={styles.name}>{product.name}</h2>
                        <p className={styles.desc}>{product.shortDesc}</p>
                        <div className={styles.footer}>
                          <span className={styles.price}>{product.priceRange}</span>
                          <span className={styles.cta}>View →</span>
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyEmoji}>🔍</div>
            <h3>No products found</h3>
            <p>Try a different search or browse all categories</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); }} className="btn btn-primary" id="reset-filters-btn">
              Reset Filters
            </button>
          </div>
        )}

        {/* Custom Order Banner */}
        <Reveal variant="zoom" className={styles.customBanner}>
          <div>
            <h3>Don&apos;t see exactly what you want?</h3>
            <p>We make everything to order. Tell us your idea and we&apos;ll create it just for you.</p>
          </div>
          <Link href="/customize" className="btn btn-primary" id="products-custom-order-btn">
            ✨ Request Custom Order
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
