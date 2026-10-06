import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

export interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage = 'No architectural luminaires match your current criteria.',
}) => {
  if (products.length === 0) {
    return (
      <div
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: 'var(--color-bg-surface)',
          margin: '2rem 0',
        }}
      >
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          {emptyMessage}
        </p>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-accent)' }}>
          Try clearing your filter or searching for another optical family.
        </span>
      </div>
    );
  }

  return (
    <div className="grid-3" style={{ width: '100%' }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
