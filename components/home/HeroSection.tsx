import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSectionData } from '@/types/cms';
import { ArrowUpRight } from 'lucide-react';

export interface HeroSectionProps {
  data: HeroSectionData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'calc(var(--header-height) + 2rem)',
        paddingBottom: '5rem',
        backgroundColor: 'var(--color-bg-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Background Media with Architectural Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src={data.mediaUrl}
          alt="Architectural luminaire illumination against monolithic surface"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            opacity: 0.38,
          }}
        />
        {/* Multistage atmospheric gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10, 11, 13, 0.7) 0%, rgba(10, 11, 13, 0.6) 40%, rgba(10, 11, 13, 0.95) 85%, var(--color-bg-primary) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 75% 30%, rgba(197, 168, 128, 0.12) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '840px' }}>
          <span className="eyebrow" style={{ marginBottom: '1.25rem' }}>
            {data.eyebrow}
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-size-h1)',
              lineHeight: '1.08',
              letterSpacing: '-0.01em',
              marginBottom: '1.75rem',
              color: 'var(--color-text-primary)',
            }}
          >
            {data.heading}
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.0625rem, 1.8vw, 1.25rem)',
              lineHeight: '1.7',
              color: 'var(--color-text-secondary)',
              marginBottom: '2.5rem',
              maxWidth: '680px',
              fontWeight: 300,
            }}
          >
            {data.subheading}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem',
              alignItems: 'center',
            }}
          >
            <Link href={data.primaryCta.href} className="btn btn-primary">
              <span>{data.primaryCta.label}</span>
              <ArrowUpRight size={16} />
            </Link>

            {data.secondaryCta && (
              <Link href={data.secondaryCta.href} className="btn btn-secondary">
                <span>{data.secondaryCta.label}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
