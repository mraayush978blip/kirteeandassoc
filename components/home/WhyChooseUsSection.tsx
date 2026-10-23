'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface ValuePillar {
  id: string;
  num: string;
  tag: string;
  title: string;
  metric: string;
  description: string;
  image: string;
}

const pillars: ValuePillar[] = [
  {
    id: 'p1',
    num: '01',
    tag: 'BESPOKE TAILORING',
    title: 'Custom Spatial Geometry',
    metric: '100% Tailored',
    description: 'Custom lengths, mounting junctions, and RAL finishes engineered to your architectural drawings.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'p2',
    num: '02',
    tag: 'OPTICAL PRECISION',
    title: 'Zero-Glare Purity',
    metric: 'UGR < 10',
    description: 'Micro-engineered fractal apertures delivering absolute visual comfort with CRI 90+ spectral fidelity.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'p3',
    num: '03',
    tag: 'NOBLE METALLURGY',
    title: 'Architectural Alloys',
    metric: '6063-T6 & Brass',
    description: 'CNC-milled structural aluminium and hand-turned solid brass built to microscopic mechanical tolerances.',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'p4',
    num: '04',
    tag: 'CERTIFIED ENDURANCE',
    title: 'Submersible Rigor',
    metric: 'IP68 & 50,000h',
    description: 'Hermetically sealed for wet architectural environments, backed by LM-79 and LM-80 laboratory certification.',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85',
  },
];

export const WhyChooseUsSection: React.FC = () => {
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);

  return (
    <section
      id="why-choose-us"
      style={{
        backgroundColor: '#0c0e12',
        color: '#ffffff',
        paddingTop: 'clamp(5rem, 8vw, 7.5rem)',
        paddingBottom: 'clamp(5rem, 8vw, 7.5rem)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Background Architectural Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Editorial Section Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(1.5rem, 4vw, 3rem)',
            alignItems: 'flex-end',
            marginBottom: 'clamp(3rem, 5vw, 4.5rem)',
          }}
        >
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-8">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: '#9ca3af',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              WHY SPECIFY ZENVORA
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#ffffff',
                margin: 0,
              }}
            >
              ENGINEERED FOR ARCHITECTS. CRAFTED FOR VISIONARIES.
            </h2>
          </div>

          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-4">
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                color: '#9ca3af',
                margin: 0,
              }}
            >
              Precision photometrics, noble metallurgy, and dimensional agility designed to integrate seamlessly into
              the architectural fabric.
            </p>
          </div>
        </div>

        {/* 4 Luxury Architectural Photographic Tiles */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.25rem',
          }}
        >
          {pillars.map((pillar) => {
            const isHovered = hoveredPillar === pillar.id;

            return (
              <div
                key={pillar.id}
                onMouseEnter={() => setHoveredPillar(pillar.id)}
                onMouseLeave={() => setHoveredPillar(null)}
                style={{
                  gridColumn: 'span 12',
                  position: 'relative',
                  height: '480px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: isHovered ? '1px solid rgba(255, 255, 255, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: '#14171d',
                  cursor: 'pointer',
                  transition: 'border-color 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  boxShadow: isHovered
                    ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.05)'
                    : '0 4px 16px rgba(0, 0, 0, 0.3)',
                }}
                className="lg:col-span-3 sm:col-span-6 group"
              >
                {/* Background Architectural Photo with Smooth Zoom */}
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="group-hover:scale-110"
                />

                {/* Dark Luxury Vignette Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(12, 14, 18, 0.4) 0%, rgba(12, 14, 18, 0.65) 50%, rgba(12, 14, 18, 0.96) 100%)',
                    transition: 'opacity 0.4s ease',
                  }}
                />

                {/* Top Badge: Index and Category */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '1.5rem',
                    right: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 3,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '2px',
                      backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.5)',
                      color: isHovered ? '#0c0e12' : '#e5e7eb',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {pillar.tag}
                  </span>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: isHovered ? '#ffffff' : '#6b7280',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {pillar.num}
                  </span>
                </div>

                {/* Bottom Narrative Content */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.75rem',
                    left: '1.75rem',
                    right: '1.75rem',
                    zIndex: 3,
                  }}
                >
                  {/* Metric Pill */}
                  <div
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '2px',
                      marginBottom: '0.75rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {pillar.metric}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1.1875rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: '#ffffff',
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1.3,
                    }}
                  >
                    {pillar.title}
                  </h3>

                  {/* Micro-Copy Description (Concise & Impactful) */}
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8125rem',
                      lineHeight: 1.55,
                      color: '#d1d5db',
                      margin: 0,
                    }}
                  >
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimalist Engineering Consultation Strip */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                color: '#d1d5db',
              }}
            >
              Direct technical access to photometric engineers &amp; custom luminaire prototyping.
            </span>
          </div>

          <Link
            href="/contact?topic=Bespoke%20Specification"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#ffffff',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.35)',
              paddingBottom: '0.2rem',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ffffff';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            <span>Request Specification Package</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
