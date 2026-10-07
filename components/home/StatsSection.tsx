import React from 'react';
import Image from 'next/image';

export const StatsSection: React.FC = () => {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Curved Architectural Corridor Photography */}
        <div
          style={{
            gridColumn: 'span 12',
            position: 'relative',
            height: 'clamp(320px, 45vw, 480px)',
            backgroundColor: '#0a0b0d',
          }}
          className="lg:col-span-5"
        >
          <Image
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85"
            alt="Curved architectural illuminated gallery corridor"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Right Column: 3 Architectural Statistics */}
        <div
          style={{
            gridColumn: 'span 12',
            padding: 'clamp(3rem, 6vw, 5rem)',
          }}
          className="lg:col-span-7"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'start',
            }}
          >
            {/* Stat 1 */}
            <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '1.75rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.75rem, 4.5vw, 4rem)',
                  fontWeight: 500,
                  lineHeight: 1,
                  color: '#111111',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                15+
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  lineHeight: 1.4,
                  display: 'block',
                }}
              >
                YEARS OF EXPERIENCE
              </span>
            </div>

            {/* Stat 2 */}
            <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '1.75rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.75rem, 4.5vw, 4rem)',
                  fontWeight: 500,
                  lineHeight: 1,
                  color: '#111111',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                5,000+
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  lineHeight: 1.4,
                  display: 'block',
                }}
              >
                BESPOKE SOLUTIONS
              </span>
            </div>

            {/* Stat 3 */}
            <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '1.75rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.75rem, 4.5vw, 4rem)',
                  fontWeight: 500,
                  lineHeight: 1,
                  color: '#111111',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                30+
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  lineHeight: 1.4,
                  display: 'block',
                }}
              >
                GLOBAL MARKETS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
