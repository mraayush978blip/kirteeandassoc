import React from 'react';
import { ProductSpecification } from '@/types/product';

export interface ProductSpecsTableProps {
  specifications: ProductSpecification[];
}

export const ProductSpecsTable: React.FC<ProductSpecsTableProps> = ({ specifications }) => {
  // Group specifications by group category
  const groups = specifications.reduce<Record<string, ProductSpecification[]>>((acc, spec) => {
    const groupName = spec.group || 'General Specifications';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(spec);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {Object.entries(groups).map(([groupName, items]) => (
        <div key={groupName}>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-accent)',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '0.625rem',
              marginBottom: '1rem',
            }}
          >
            {groupName}
          </h4>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
              backgroundColor: 'var(--color-bg-surface)',
            }}
          >
            {items.map((spec, index) => (
              <div
                key={spec.id || index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(180px, 1fr) 2fr',
                  padding: '0.875rem 1.25rem',
                  borderBottom: index < items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                }}
              >
                <span
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontWeight: 400,
                    fontSize: '0.8125rem',
                  }}
                >
                  {spec.label}
                </span>
                <span
                  style={{
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                  }}
                >
                  {spec.value}
                  {spec.unit && (
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.25rem', fontSize: '0.8125rem' }}>
                      {spec.unit}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
