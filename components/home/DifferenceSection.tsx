import React from 'react';

export const DifferenceSection: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'EXPERTISE',
      description: 'Specification-led engineering for complex architectural and commercial requirements.',
    },
    {
      num: '02',
      title: 'GLOBAL REACH',
      description: 'An established specification network spanning architects, designers and premier manufacturers.',
    },
    {
      num: '03',
      title: 'PRECISION',
      description: 'Technical photometrics, low glare (UGR < 10), and certified engineering without compromising aesthetic purity.',
    },
    {
      num: '04',
      title: 'EXPERIENCE',
      description: 'Extensive portfolio of bespoke luminaire solutions specified across prestigious architecture worldwide.',
    },
  ];

  return (
    <section
      id="philosophy"
      style={{
        backgroundColor: '#ffffff',
        color: '#2d333e',
        paddingTop: 'clamp(5rem, 8vw, 8rem)',
        paddingBottom: 'clamp(5rem, 8vw, 8rem)',
      }}
    >
      <div className="container">
        {/* Top Split: Title & Narrative */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
            marginBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
          }}
        >
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-7">
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#6b7280',
                display: 'block',
                marginBottom: '1.25rem',
              }}
            >
              OUR ARCHITECTURAL PHILOSOPHY
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#2d333e',
              }}
            >
              WE DON&apos;T JUST LIGHT SPACES. WE DEFINE THEM.
            </h2>
          </div>

          <div
            style={{
              gridColumn: 'span 12',
              display: 'flex',
              alignItems: 'flex-end',
            }}
            className="lg:col-span-5"
          >
            <p
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.75,
                color: '#5b6370',
                maxWidth: '460px',
              }}
            >
              From architectural specifications to bespoke luminaire adaptations, Kirtee &amp; Associates engineers
              lighting systems designed seamlessly around the architecture they inhabit.
            </p>
          </div>
        </div>

        {/* 4 Pillars Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '3.5rem',
          }}
        >
          {pillars.map((item) => (
            <div key={item.num} style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: '#9ca3af',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem',
                  display: 'block',
                }}
              >
                {item.num}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  color: '#2d333e',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#6b7280',
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
