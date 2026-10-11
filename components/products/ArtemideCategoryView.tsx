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
      style={{
        paddingTop: 'calc(var(--header-height) + 2rem)',
        paddingBottom: '6rem',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <div className="container">
        {/* Category Switcher Tabs (Dry vs Wet Goods) */}
        <div
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '0.3rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            maxWidth: '100%',
          }}
        >
          <Link
            href="/dry-goods"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.4rem 0.85rem',
              borderRadius: '3px',
              backgroundColor: categoryType === 'dry' ? '#111111' : 'transparent',
              color: categoryType === 'dry' ? '#ffffff' : '#6b7280',
              transition: 'all 0.2s ease',
            }}
          >
            DRY GOODS (INDOOR)
          </Link>
          <Link
            href="/wet-goods"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.4rem 0.85rem',
              borderRadius: '3px',
              backgroundColor: categoryType === 'wet' ? '#111111' : 'transparent',
              color: categoryType === 'wet' ? '#ffffff' : '#6b7280',
              transition: 'all 0.2s ease',
            }}
          >
            WET GOODS (OUTDOOR)
          </Link>
        </div>

        {/* Category Header (Artemide reference from PDF Page 2) */}
        <div
          style={{
            marginBottom: '3.5rem',
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
              marginBottom: '1.5rem',
              lineHeight: 1.08,
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.9375rem, 1.8vw, 1.125rem)',
              lineHeight: 1.75,
              color: '#4b5563',
              fontWeight: 400,
              maxWidth: '820px',
            }}
          >
            {description}
          </p>
        </div>

        {/* Optional Filter Pills */}
        {subcategories.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.625rem',
              marginBottom: '3rem',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '1.25rem',
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
                padding: '0.5rem 1.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
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
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {subcat}
              </button>
            ))}
          </div>
        )}

        {/* Artemide Asymmetric Architectural Mosaic Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.5rem',
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

            const itemHeight = colSpan === 12 ? '500px' : '440px';

            return (
              <div
                key={product.id}
                style={{
                  gridColumn: `span ${colSpan}`,
                }}
                className="mosaic-col"
              >
                <Link
                  href={`/products/${product.slug}`}
                  style={{
                    display: 'block',
                    position: 'relative',
                    width: '100%',
                    height: itemHeight,
                    overflow: 'hidden',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    textDecoration: 'none',
                    transition: 'all var(--transition-base)',
                  }}
                  className="mosaic-item"
                >
                  <Image
                    src={product.heroImage.url}
                    alt={product.heroImage.alt || product.name}
                    fill
                    sizes={colSpan === 12 ? '100vw' : '(max-width: 1024px) 100vw, 50vw'}
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
                      background: 'linear-gradient(180deg, transparent 65%, rgba(0, 0, 0, 0.45) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Artemide Style Minimal Bottom Tag (↳ A.24, A.39, etc.) */}
                  <div
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
