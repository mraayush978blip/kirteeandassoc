'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft } from 'lucide-react';

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

import { ProjectCtaConfig, DEFAULT_PROJECT_CTA } from '@/lib/site-settings-types';

interface ProjectCtaSectionProps {
  config?: ProjectCtaConfig;
}

export const ProjectCtaSection: React.FC<ProjectCtaSectionProps> = ({ config }) => {
  const data = config || DEFAULT_PROJECT_CTA;
  const activeImages = data.imageUrl
    ? [{ url: data.imageUrl, alt: data.imageAlt || data.headline || 'Project Consultation' }]
    : ctaImages;

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const toggleImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % activeImages.length);
  };

  return (
    <section
      style={{
        backgroundColor: '#0a0a09',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'stretch',
          minHeight: 'clamp(460px, 45vw, 640px)',
          width: '100%',
        }}
      >
        {/* Left Column: Call to Action */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: 'clamp(4rem, 6vw, 6.5rem)',
            paddingBottom: 'clamp(4rem, 6vw, 6.5rem)',
            paddingLeft: 'clamp(1.5rem, 4.5vw, 6rem)',
            paddingRight: 'clamp(1.5rem, 3.5vw, 4.5rem)',
          }}
          className="lg:col-span-6"
        >
          <div style={{ maxWidth: '520px', width: '100%' }}>
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
              {data.eyebrow || "LET'S WORK TOGETHER"}
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
              {data.headline || 'HAVE A PROJECT IN MIND?'}
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
              {data.description || 'Our specification team is here to help you bring your vision to life.'}
            </p>

            <Link
              href={data.buttonHref || '/contact'}
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
              <span>{data.buttonText || 'DISCUSS YOUR SPECIFICATION'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right Column: Full-Bleed Right Edge Image */}
        <div
          style={{
            gridColumn: 'span 12',
            position: 'relative',
            minHeight: 'clamp(380px, 40vw, 640px)',
            width: '100%',
            backgroundColor: '#0a0a09',
            marginRight: 0,
            paddingRight: 0,
          }}
          className="lg:col-span-6"
        >
          {activeImages.map((img, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: idx === activeImageIdx ? 1 : 0,
                transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: idx === activeImageIdx ? 'auto' : 'none',
              }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
          ))}

          {/* Toggle Arrow Button (shown when multiple images exist) */}
          {activeImages.length > 1 && (
            <button
              type="button"
              onClick={toggleImage}
              aria-label="Toggle next project image"
              style={{
                position: 'absolute',
                left: '1.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 10, 9, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(10, 10, 9, 0.75)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
