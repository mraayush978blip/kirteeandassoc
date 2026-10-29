'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { ArrowUpRight } from 'lucide-react';

export interface ArtemideCategoryViewProps {
  title: string;
  categoryType: 'dry' | 'wet';
  description: string;
  products: Product[];
}

export const ArtemideCategoryView: React.FC<ArtemideCategoryViewProps> = ({
  title,
  categoryType,
  description,
  products,
}) => {
  const [filter, setFilter] = useState<string>('all');

  // Extract distinct subcategories or tags
  const subcategories = Array.from(
    new Set(products.map((p) => p.subcategory).filter(Boolean) as string[])
  );

  const filteredProducts = products.filter((p) => {
    if (filter === 'all') return true;
    return p.subcategory === filter;
  });

  return (
    <div
      className="category-page-wrapper"
      style={{
        paddingTop: 'calc(var(--header-height) + 1.25rem)',
        paddingBottom: '5rem',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <div className="container">
        {/* Category Header */}
        <div
          style={{
            marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
            maxWidth: '920px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1.85rem, 5.5vw, 4.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#111111',
              marginBottom: '1rem',
              lineHeight: 1.08,
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.9375rem, 1.8vw, 1.125rem)',
              lineHeight: 1.7,
              color: '#4b5563',
              fontWeight: 400,
              maxWidth: '820px',
            }}
          >
            {description}
          </p>
        </div>

        {/* Sleek Horizontal Filter Pills Bar */}
        {subcategories.length > 0 && (
          <div
            className="category-filter-pills-row no-scrollbar"
            style={{
              display: 'flex',
              overflowX: 'auto',
              flexWrap: 'nowrap',
              gap: '0.5rem',
              marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '0.875rem',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
          >
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="btn-pill"
              style={{
                background: filter === 'all' ? '#111111' : '#f3f4f6',
                color: filter === 'all' ? '#ffffff' : '#374151',
                border: 'none',
                padding: '0.45rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all var(--transition-fast)',
              }}
            >
              All {title}
            </button>
            {subcategories.map((subcat) => (
              <button
                key={subcat}
                type="button"
                onClick={() => setFilter(subcat)}
                className="btn-pill"
                style={{
                  background: filter === subcat ? '#111111' : '#f3f4f6',
                  color: filter === subcat ? '#ffffff' : '#374151',
                  border: 'none',
                  padding: '0.45rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {subcat}
              </button>
            ))}
          </div>
        )}

        {/* Artemide Asymmetric Architectural Mosaic Grid (2 per row on mobile) */}
        <div
          className="catalog-products-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(0.625rem, 1.5vw, 1.5rem)',
          }}
        >
          {filteredProducts.map((product, index) => {
            // Determine asymmetric layout span: alternating pattern (6, 6, 12, 6, 6)
            let colSpan = 6;
            if (product.mosaicSpan) {
              colSpan = product.mosaicSpan;
            } else if (index % 5 === 2) {
              colSpan = 12; // Large panoramic hero card
            }

            const isPanoramic = colSpan === 12;

            return (
              <div
                key={product.id}
                className={`${isPanoramic ? 'col-span-12 md:col-span-12' : 'col-span-6 md:col-span-6'} catalog-product-card`}
              >
                <Link
                  href={`/products/${product.slug}`}
                  style={{
                    display: 'block',
                    position: 'relative',
                    width: '100%',
                    aspectRatio: isPanoramic ? '21 / 9' : '16 / 10',
                    maxHeight: isPanoramic ? '540px' : '460px',
                    overflow: 'hidden',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    textDecoration: 'none',
                    transition: 'all var(--transition-base)',
                  }}
                  className="mosaic-item group"
                >
                  <Image
                    src={product.heroImage.url}
                    alt={product.heroImage.alt || product.name}
                    fill
                    sizes={colSpan === 12 ? '100vw' : '(max-width: 1024px) 50vw, 50vw'}
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="mosaic-img"
                  />

                  {/* Dark subtle gradient at bottom for legibility */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 55%, rgba(0, 0, 0, 0.6) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Artemide Style Minimal Bottom Tag */}
                  <div
                    className="catalog-card-tag-container"
                    style={{
                      position: 'absolute',
                      bottom: '1.25rem',
                      left: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                    }}
                  >
                    <span
                      className="catalog-card-tag-name"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(8px)',
                        padding: '0.4rem 0.875rem',
                        borderRadius: '2px',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: '#111111',
                        textTransform: 'uppercase',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      {product.codeLabel || product.name}
                    </span>

                    {product.designer && (
                      <span
                        className="catalog-card-tag-designer"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.75)',
                          backdropFilter: 'blur(8px)',
                          padding: '0.4rem 0.875rem',
                          borderRadius: '2px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#ffffff',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {product.designer}
                      </span>
                    )}
                  </div>

                  {/* Hover Arrow Indicator */}
                  <div
                    className="catalog-card-arrow"
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: '1.25rem',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#111111',
                      opacity: 0.9,
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
