'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xs)',
        overflow: 'hidden',
        transition: 'transform var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base)',
      }}
      className="product-card group"
    >
      {/* Image container */}
      <Link
        href={`/products/${product.slug}`}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          backgroundColor: '#050607',
          overflow: 'hidden',
          display: 'block',
        }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={product.heroImage.url}
          alt={product.heroImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            transition: 'transform var(--transition-smooth)',
          }}
          className="product-image"
        />
        {/* Optical Spec Overlay Badge */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <Badge variant="accent">{product.category.name}</Badge>
        </div>
      </Link>

      {/* Card Content */}
      <div
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            SKU: {product.sku}
          </span>
          {product.isFeatured && (
            <span style={{ fontSize: '0.625rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Master Family
            </span>
          )}
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.04em',
            marginBottom: '0.75rem',
            lineHeight: '1.3',
          }}
        >
          <Link
            href={`/products/${product.slug}`}
            style={{
              color: 'var(--color-text-primary)',
              transition: 'color var(--transition-fast)',
            }}
          >
            {product.name}
          </Link>
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6',
            marginBottom: '1.25rem',
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.shortDescription}
        </p>

        {/* Technical Highlights */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.375rem',
            marginBottom: '1.5rem',
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '0.875rem',
          }}
        >
          {product.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.6875rem',
                color: 'var(--color-text-muted)',
                background: 'rgba(255,255,255,0.03)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Link */}
        <Link
          href={`/products/${product.slug}`}
          className="btn-link"
          style={{ marginTop: 'auto' }}
        >
          <span>Explore Specifications</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
};
