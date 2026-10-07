import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const FlosBespokeSection: React.FC = () => {
  return (
    <section
      id="bespoke"
      style={{
        backgroundColor: '#ffffff',
        color: '#111111',
        paddingTop: 'clamp(4rem, 8vw, 7.5rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7.5rem)',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <div className="container">
        {/* Main 2-column Flos Bespoke Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
            alignItems: 'start',
            marginBottom: 'clamp(4rem, 8vw, 7rem)',
          }}
        >
          {/* Left Column: Title & 4 Editorial Pillars */}
          <div
            style={{
              gridColumn: 'span 12',
            }}
            className="lg:col-span-6"
          >
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: 'clamp(2.5rem, 4vw, 4rem)',
                color: '#111111',
              }}
            >
              Why Zenvora Bespoke
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.75rem', maxWidth: '520px' }}>
              {/* Pillar 1 */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    marginBottom: '0.625rem',
                    color: '#111111',
                  }}
                >
                  Competence &amp; Know-how
                </h3>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: '#4b5563',
                  }}
                >
                  Partnerships with the best brands in Retail, Hospitality, Residential, Office/Corporate.
                </p>
              </div>

              {/* Pillar 2 */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    marginBottom: '0.625rem',
                    color: '#111111',
                  }}
                >
                  Reach &amp; Network
                </h3>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: '#4b5563',
                  }}
                >
                  With offices in all continents, Zenvora Global Network operates in more than 100 countries providing
                  full assistance, support, and tailor-made solutions.
                </p>
              </div>

              {/* Pillar 3 */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    marginBottom: '0.625rem',
                    color: '#111111',
                  }}
                >
                  Passion, Design &amp; Technology
                </h3>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: '#4b5563',
                  }}
                >
                  From traditional processes, such as glassblowing, to the most advanced technologies and component
                  customization.
                </p>
              </div>

              {/* Pillar 4 */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    marginBottom: '0.625rem',
                    color: '#111111',
                  }}
                >
                  Experience
                </h3>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: '#4b5563',
                  }}
                >
                  More than 5,000 Bespoke products developed all around the world.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Flos Bespoke Architectural Imagery Split */}
          <div
            style={{
              gridColumn: 'span 12',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
            }}
            className="lg:col-span-6"
          >
            {/* Top Image: Arched architectural rotunda dome illumination */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '360px',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundColor: '#f3f4f6',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                alt="Architectural rotunda dome illuminated by bespoke lighting"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Bottom Image: Vertical luminaire installation */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '420px',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundColor: '#0a0a0a',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Vertical architectural luminaire system"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Numbered Adaptation Section (Page 1 bottom: "01 Adaptation of catalogue") */}
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'center',
            }}
          >
            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-5">
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#9ca3af',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '1rem',
                }}
              >
                01
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                  color: '#111111',
                }}
              >
                Adaptation of catalogue
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#4b5563',
                  marginBottom: '2rem',
                }}
              >
                Modifications of our catalogue products according to specific customer requirements. From dimensional
                tailoring, custom finishes and high-efficiency optics to complex building management system protocols.
              </p>
              <Link
                href="/contact"
                className="btn btn-pill"
                style={{
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  padding: '0.75rem 1.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                }}
              >
                <span>Discuss A Project</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-7">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '420px',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=80"
                  alt="Custom catalogue luminaire adaptation in architectural museum"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
