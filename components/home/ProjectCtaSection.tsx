'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const ctaImages = [
  {
    url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1400&q=80',
    alt: 'Architectural space with marble steps and indirect lighting',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    alt: 'Linear wall grazing in minimalist executive pavilion',
  },
];

export const ProjectCtaSection: React.FC = () => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const toggleImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % ctaImages.length);
  };

  return (
    <section
      style={{
        backgroundColor: '#0c0d10',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
        {/* Left Column: Call to Action */}
        <div
          style={{
            gridColumn: 'span 12',
            padding: 'clamp(4rem, 7vw, 6.5rem) clamp(1.5rem, 4vw, 4rem)',
          }}
          className="lg:col-span-6"
        >
          <div style={{ maxWidth: '480px' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.65)',
                display: 'block',
                marginBottom: '1.25rem',
              }}
            >
              LET&apos;S WORK TOGETHER
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '1.5rem',
              }}
            >
              HAVE A PROJECT IN MIND?
            </h2>

            <p
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.75)',
                marginBottom: '2.5rem',
                fontWeight: 300,
              }}
            >
              Our specification team is here to help you bring your vision to life.
            </p>

            <Link
              href="/contact"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                paddingBottom: '0.4rem',
                transition: 'border-color 0.2s ease, gap 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.gap = '1rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.gap = '0.75rem';
              }}
            >
              <span>DISCUSS YOUR SPECIFICATION</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right Column: Swipeable/Togglable Image Showcase */}
        <div
          style={{
            gridColumn: 'span 12',
            position: 'relative',
            height: 'clamp(360px, 45vw, 520px)',
            backgroundColor: '#050608',
          }}
          className="lg:col-span-6"
        >
          {ctaImages.map((img, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: idx === activeImageIdx ? 1 : 0,
                transition: 'opacity 0.7s ease',
                pointerEvents: idx === activeImageIdx ? 'auto' : 'none',
              }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}

          {/* Toggle Arrow Button from Screenshot */}
          <button
            type="button"
            onClick={toggleImage}
            aria-label="Toggle next project image"
            style={{
              position: 'absolute',
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              backdropFilter: 'blur(8px)',
            }}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
