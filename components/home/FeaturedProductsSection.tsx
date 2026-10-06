import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { FeaturedProductsSectionData } from '@/types/cms';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ArrowUpRight } from 'lucide-react';

export interface FeaturedProductsSectionProps {
  data: FeaturedProductsSectionData;
  products: Product[];
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  data,
  products,
}) => {
  return (
    <section className="section-spacing" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3.5rem',
            gap: '1.5rem',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span className="eyebrow">{data.eyebrow}</span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--font-size-h2)',
                lineHeight: '1.15',
                marginBottom: '0.75rem',
              }}
            >
              {data.title}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              {data.subtitle}
            </p>
          </div>

          <Link href="/products" className="btn btn-secondary">
            <span>Explore Entire Catalogue</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} />
      </div>
    </section>
  );
};
