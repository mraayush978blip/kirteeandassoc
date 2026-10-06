import React from 'react';
import { BrandIntroSectionData } from '@/types/cms';

export interface BrandIntroSectionProps {
  data: BrandIntroSectionData;
}

export const BrandIntroSection: React.FC<BrandIntroSectionProps> = ({ data }) => {
  return (
    <section
      id="overview"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container-editorial">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="eyebrow">{data.eyebrow}</span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-size-h2)',
              marginBottom: '1.5rem',
              maxWidth: '900px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.2',
            }}
          >
            {data.title}
          </h2>
          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              marginBottom: '1.5rem',
            }}
          >
            &ldquo;{data.statement}&rdquo;
          </p>
          <p
            style={{
              fontSize: '1.0625rem',
              lineHeight: '1.8',
              maxWidth: '780px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {data.details}
          </p>
        </div>

        {/* Stats Matrix */}
        {data.stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            {data.stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: 'center',
                  padding: '1.25rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: 'var(--color-accent)',
                    marginBottom: '0.35rem',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
