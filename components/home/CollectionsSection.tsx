'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useSiteImages } from '@/lib/useSiteImages';

export const CollectionsSection: React.FC = () => {
  const { getImage } = useSiteImages();
  const dryImage = getImage(
    'collection-dry',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1400&q=80',
    'Dry Goods architectural interior luminaire'
  );
  const wetImage = getImage(
    'collection-wet',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=80',
    'Wet Goods waterproof architectural luminaire'
  );
  return (
    <section
      id="collections"
      style={{
        backgroundColor: '#282b32',
        color: '#ffffff',
        paddingTop: 'clamp(5rem, 8vw, 8rem)',
        paddingBottom: 'clamp(5rem, 8vw, 8rem)',
      }}
    >
      <div className="container">
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '2rem',
            marginBottom: 'clamp(3rem, 5vw, 4.5rem)',
          }}
        >
          <div style={{ maxWidth: '580px' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.65)',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              OUR COLLECTIONS
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '1rem',
              }}
            >
              EXPLORE THE COLLECTION
            </h2>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              Thoughtfully designed ranges for architectural, commercial and hospitality spaces.
            </p>
          </div>

          <Link
            href="/products"
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
            <span>VIEW ALL COLLECTIONS</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* 2 Wide Collection Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          {/* Card 1: DRY GOODS */}
          <Link
            href="/dry-goods"
            style={{
              display: 'block',
              textDecoration: 'none',
              borderRadius: '2px',
              overflow: 'hidden',
              backgroundColor: '#353943',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'border-color 0.3s ease, transform 0.3s ease',
            }}
            className="group"
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '380px',
                overflow: 'hidden',
                backgroundColor: '#30343e',
              }}
            >
              <Image
                src={dryImage.url}
                alt={dryImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="collection-img"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 55%, rgba(10, 10, 10, 0.75) 100%)',
                }}
              />
            </div>

            <div style={{ padding: '2rem' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                }}
              >
                DRY GOODS
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '1.5rem',
                }}
              >
                Minimal. Versatile. Timeless.
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>EXPLORE</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Card 2: WET GOODS */}
          <Link
            href="/wet-goods"
            style={{
              display: 'block',
              textDecoration: 'none',
              borderRadius: '2px',
              overflow: 'hidden',
              backgroundColor: '#353943',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'border-color 0.3s ease, transform 0.3s ease',
            }}
            className="group"
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '380px',
                overflow: 'hidden',
                backgroundColor: '#30343e',
              }}
            >
              <Image
                src={wetImage.url}
                alt={wetImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="collection-img"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 55%, rgba(10, 10, 10, 0.75) 100%)',
                }}
              />
            </div>

            <div style={{ padding: '2rem' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                }}
              >
                WET GOODS
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '1.5rem',
                }}
              >
                Engineered for challenging spaces.
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>EXPLORE</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
