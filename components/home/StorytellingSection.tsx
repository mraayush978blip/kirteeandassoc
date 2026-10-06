import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StorytellingSectionData } from '@/types/cms';
import { ArrowUpRight } from 'lucide-react';

export interface StorytellingSectionProps {
  data: StorytellingSectionData;
}

export const StorytellingSection: React.FC<StorytellingSectionProps> = ({ data }) => {
  return (
    <section
      id="bespoke"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Editorial Narrative */}
          <div>
            <span className="eyebrow">{data.eyebrow}</span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--font-size-h2)',
                lineHeight: '1.2',
                marginBottom: '1.5rem',
              }}
            >
              {data.title}
            </h2>
            <p
              style={{
                fontSize: '1.0625rem',
                lineHeight: '1.8',
                marginBottom: '2rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              {data.description}
            </p>

            {data.quote && (
              <blockquote
                style={{
                  borderLeft: '2px solid var(--color-accent)',
                  paddingLeft: '1.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.125rem',
                    fontStyle: 'italic',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.75rem',
                    lineHeight: '1.6',
                  }}
                >
                  &ldquo;{data.quote.text}&rdquo;
                </p>
                <footer style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  <strong style={{ color: 'var(--color-text-secondary)' }}>{data.quote.author}</strong> —{' '}
                  {data.quote.role}
                </footer>
              </blockquote>
            )}

            <Link href="/contact" className="btn btn-primary">
              <span>Commission Custom Optics</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* Architectural Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/5',
              backgroundColor: '#050608',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
            }}
          >
            <Image
              src={data.imageUrl}
              alt={data.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
