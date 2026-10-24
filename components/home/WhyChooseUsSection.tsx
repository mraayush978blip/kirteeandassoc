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
        backgroundColor: '#fafafa',
        color: '#111827',
        paddingTop: 'clamp(4.5rem, 7vw, 7rem)',
        paddingBottom: 'clamp(4.5rem, 7vw, 7rem)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #f0f0f2',
        borderBottom: '1px solid #f0f0f2',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Editorial Section Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(1.5rem, 4vw, 3rem)',
            alignItems: 'flex-end',
            marginBottom: 'clamp(2.5rem, 4.5vw, 4rem)',
          }}
        >
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-8">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#6b7280',
                display: 'block',
                marginBottom: '0.85rem',
              }}
            >
              WHY SPECIFY ZENVORA
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#111827',
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
                lineHeight: 1.65,
                color: '#4b5563',
                margin: 0,
              }}
            >
              Precision photometrics, noble metallurgy, and dimensional agility designed to integrate seamlessly into
              the architectural fabric.
            </p>
          </div>
        </div>

        {/* 4 Minimalist & Clean Architectural Cards */}
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
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: isHovered ? '1px solid #111827' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered
                    ? '0 16px 32px rgba(0, 0, 0, 0.08)'
                    : '0 1px 3px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                className="lg:col-span-3 sm:col-span-6 group"
              >
                {/* Image Container */}
                <div
                  style={{
                    position: 'relative',
                    height: '220px',
                    width: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#f3f4f6',
                  }}
                >
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="group-hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      right: '1rem',
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
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: '#111827',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      {pillar.tag}
                    </span>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '0.3rem 0.55rem',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: '#6b7280',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      {pillar.num}
                    </span>
                  </div>
                </div>

                {/* Card Content (Clean & Minimal) */}
                <div
                  style={{
                    padding: '1.5rem 1.25rem',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Metric Tag */}
                    <div
                      style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: '#374151',
                        backgroundColor: '#f3f4f6',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '3px',
                        marginBottom: '0.75rem',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {pillar.metric}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: '#111827',
                        margin: '0 0 0.45rem 0',
                        lineHeight: 1.35,
                      }}
                    >
                      {pillar.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8125rem',
                        lineHeight: 1.6,
                        color: '#6b7280',
                        margin: 0,
                      }}
                    >
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimalist Engineering Consultation Strip */}
        <div
          style={{
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.15)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                color: '#4b5563',
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
              gap: '0.45rem',
              color: '#111827',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: '1px solid #111827',
              paddingBottom: '0.2rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#2563eb';
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#111827';
              e.currentTarget.style.borderColor = '#111827';
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
