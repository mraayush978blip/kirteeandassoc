import React from 'react';
import { PhilosophyConfig, DEFAULT_PHILOSOPHY } from '@/lib/site-settings-types';

interface DifferenceSectionProps {
  config?: PhilosophyConfig;
}

export const DifferenceSection: React.FC<DifferenceSectionProps> = ({ config }) => {
  const data = config || DEFAULT_PHILOSOPHY;
  const pillars = data.pillars || DEFAULT_PHILOSOPHY.pillars;

  return (
    <section
      id="philosophy"
      style={{
        backgroundColor: '#ffffff',
        color: '#2d333e',
        paddingTop: 'clamp(3.5rem, 6vw, 6.5rem)',
        paddingBottom: 'clamp(3.5rem, 6vw, 6.5rem)',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        {/* Top Split: Title & Narrative */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(1.75rem, 4vw, 4.5rem)',
            marginBottom: 'clamp(2.5rem, 5vw, 4.5rem)',
          }}
        >
          <div className="col-span-12 lg:col-span-7" style={{ minWidth: 0 }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#6b7280',
                display: 'block',
                marginBottom: '1rem',
                overflowWrap: 'break-word',
              }}
            >
              {data.eyebrow || 'OUR ARCHITECTURAL PHILOSOPHY'}
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#2d333e',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {data.headline || "WE DON'T JUST LIGHT SPACES. WE DEFINE THEM."}
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-5 flex items-end" style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
                lineHeight: 1.7,
                color: '#5b6370',
                maxWidth: '460px',
                overflowWrap: 'break-word',
              }}
            >
              {data.narrative ||
                'From architectural specifications to bespoke luminaire adaptations, Kirtee & Associates engineers lighting systems designed seamlessly around the architecture they inhabit.'}
            </p>
          </div>
        </div>

        {/* 4 Pillars Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'clamp(1.75rem, 3.5vw, 3rem)',
            borderTop: '1px solid #e5e7eb',
            paddingTop: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          {pillars.map((item) => (
            <div key={item.num} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: '#9ca3af',
                  letterSpacing: '0.1em',
                  marginBottom: '0.85rem',
                  display: 'block',
                }}
              >
                {item.num}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.65rem',
                  color: '#2d333e',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: '#6b7280',
                  overflowWrap: 'break-word',
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
