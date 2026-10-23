'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck, Cpu, Sliders, Sparkles, Award } from 'lucide-react';

interface ValuePillar {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  metric?: string;
  metricLabel?: string;
}

const pillars: ValuePillar[] = [
  {
    id: 'p1',
    num: '01',
    title: 'BESPOKE TAILORING',
    subtitle: 'Dimensional & Optical Freedom',
    description:
      'We adapt luminaires to your exact spatial blueprint—modifying lengths, mounting details, custom RAL finishes, and optical beam distributions to integrate into architectural envelope.',
    icon: Sliders,
    metric: '100%',
    metricLabel: 'Customizable Architecture',
  },
  {
    id: 'p2',
    num: '02',
    title: 'OPTICAL PRECISION',
    subtitle: 'Zero-Glare Visual Comfort',
    description:
      'Micro-engineered reflectors and prismatic diffusers achieving UGR < 10 with ultra-high CRI 90+ (R9 > 50) spectral purity for pristine color rendering and occupant well-being.',
    icon: Compass,
    metric: 'UGR < 10',
    metricLabel: 'Certified Glare Elimination',
  },
  {
    id: 'p3',
    num: '03',
    title: 'NOBLE MATERIALS',
    subtitle: 'Aerospace Aluminium & Turned Brass',
    description:
      'Engineered exclusively from architectural-grade 6063-T6 extruded aluminium, CNC-milled solid brass, and tempered borosilicate glass designed to withstand rigorous environmental stressors.',
    icon: Sparkles,
    metric: '6063-T6',
    metricLabel: 'Structural Grade Alloy',
  },
  {
    id: 'p4',
    num: '04',
    title: 'RIGOROUS CERTIFICATION',
    subtitle: 'LM-79, LM-80 & IP68 Sealed',
    description:
      'Tested to international standards with certified thermal dissipation arrays ensuring 50,000+ hour L90B10 operational lifespan and IP67/IP68 wet-zone ingress protection.',
    icon: ShieldCheck,
    metric: '50,000h',
    metricLabel: 'L90B10 Lifespan',
  },
  {
    id: 'p5',
    num: '05',
    title: 'SPECIFICATION SUPPORT',
    subtitle: 'Direct Engineering Consultation',
    description:
      'Complete photometric documentation, IES/LDT lighting simulation packages, custom CAD/BIM models, and physical mock-up luminaires delivered directly to your studio.',
    icon: Cpu,
    metric: '24-48h',
    metricLabel: 'Photometric Turnaround',
  },
  {
    id: 'p6',
    num: '06',
    title: 'ARCHITECTURAL PEDIGREE',
    subtitle: 'Global Project Recognition',
    description:
      'Trusted by premier architectural firms and lighting designers for bespoke installations in luxury hospitality, private residences, art galleries, and corporate headquarters.',
    icon: Award,
    metric: '500+',
    metricLabel: 'Landmark Installations',
  },
];

export const WhyChooseUsSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section
      id="why-choose-us"
      style={{
        backgroundColor: '#f5f2eb',
        color: '#1e2229',
        paddingTop: 'clamp(5rem, 8vw, 7.5rem)',
        paddingBottom: 'clamp(5rem, 8vw, 7.5rem)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #e2ddd5',
        borderBottom: '1px solid #e2ddd5',
      }}
    >
      {/* Subtle Background Architectural Gridlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header Block */}
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
                color: '#6b7280',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              WHY CHOOSE ZENVORA
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#1a1d24',
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
                color: '#4b5563',
                margin: 0,
              }}
            >
              We bridge the gap between pure architectural intent and precision luminaire engineering, delivering
              custom lighting instruments that elevate spaces with lasting distinction.
            </p>
          </div>
        </div>

        {/* 6 Value Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.25rem',
          }}
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isHovered = hoveredCard === pillar.id;

            return (
              <div
                key={pillar.id}
                onMouseEnter={() => setHoveredCard(pillar.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  gridColumn: 'span 12',
                  backgroundColor: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.72)',
                  backdropFilter: 'blur(10px)',
                  border: isHovered ? '1px solid #1a1d24' : '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '4px',
                  padding: '2rem 2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '280px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered
                    ? '0 16px 36px rgba(0, 0, 0, 0.08)'
                    : '0 2px 8px rgba(0, 0, 0, 0.02)',
                  cursor: 'default',
                }}
                className="lg:col-span-4"
              >
                {/* Top Row: Numeral & Icon */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: isHovered ? '#1a1d24' : '#9ca3af',
                        letterSpacing: '0.1em',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {pillar.num}
                    </span>

                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: isHovered ? '#1a1d24' : '#ebe7df',
                        color: isHovered ? '#ffffff' : '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#1a1d24',
                      margin: '0 0 0.35rem 0',
                    }}
                  >
                    {pillar.title}
                  </h3>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: '#6b7280',
                      letterSpacing: '0.06em',
                      display: 'block',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    {pillar.subtitle}
                  </span>

                  {/* Narrative Body */}
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.875rem',
                      lineHeight: 1.65,
                      color: '#4b5563',
                      margin: 0,
                    }}
                  >
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Metric Pill */}
                {pillar.metric && (
                  <div
                    style={{
                      marginTop: '1.75rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: '#1a1d24',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {pillar.metric}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.6875rem',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {pillar.metricLabel}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Bar */}
        <div
          style={{
            marginTop: '3.5rem',
            padding: '1.75rem 2.5rem',
            backgroundColor: '#1a1d24',
            color: '#ffffff',
            borderRadius: '4px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.0625rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                margin: '0 0 0.25rem 0',
                color: '#ffffff',
              }}
            >
              Have a Custom Architectural Specification?
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                color: '#9ca3af',
                margin: 0,
              }}
            >
              Consult directly with our photometric engineers for custom luminaire designs, IES data, and physical mock-ups.
            </p>
          </div>

          <Link
            href="/contact?topic=Specification%20Inquiry"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              backgroundColor: '#ffffff',
              color: '#1a1d24',
              padding: '0.75rem 1.75rem',
              borderRadius: '2px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span>Consult With Engineering</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
