'use client';

import React from 'react';
import { ProductCategory } from '@/types/product';
import { Search, X } from 'lucide-react';

export interface ProductFilterBarProps {
  categories: ProductCategory[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalCount,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginBottom: '3rem',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-xs)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Search input with icon */}
        <div
          style={{
            position: 'relative',
            flexGrow: 1,
            maxWidth: '420px',
            minWidth: '240px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search luminaire by name, SKU (e.g. Ingraze, DALI), or optic..."
            aria-label="Search architectural luminaires"
            className="form-input"
            style={{
              paddingLeft: '2.5rem',
              paddingRight: searchQuery ? '2.5rem' : '1rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              fontSize: '0.875rem',
              height: '42px',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Total count badge */}
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          Showing <strong style={{ color: 'var(--color-text-primary)' }}>{totalCount}</strong> instruments
        </span>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '1rem',
        }}
        role="tablist"
        aria-label="Filter products by architectural category"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={() => onSelectCategory('all')}
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid',
            borderColor: selectedCategory === 'all' ? 'var(--color-accent)' : 'var(--color-border)',
            backgroundColor: selectedCategory === 'all' ? 'var(--color-accent-subtle)' : 'transparent',
            color: selectedCategory === 'all' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          All Luminaires
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(cat.slug)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'transparent',
                color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
