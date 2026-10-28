'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Hotspot {
  id: string;
  label: string;
  value: string;
  top: string;
  left: string;
}

const hotspots: Hotspot[] = [
  { id: 'h1', label: 'FINISH', value: 'Matte Black', top: '35%', left: '16%' },
  { id: 'h2', label: 'MATERIAL', value: 'Aluminium', top: '36%', left: '80%' },
  { id: 'h3', label: 'OPTICS', value: 'Narrow beam', top: '60%', left: '82%' },
  { id: 'h4', label: 'DIMENSIONS', value: 'Customizable', top: '78%', left: '18%' },
];

export const BespokeInteractiveSection: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const steps = [
    { num: '01', title: 'SELECT', desc: 'a product' },
    { num: '02', title: 'ADAPT', desc: 'specifications' },
    { num: '03', title: 'ENGINEER', desc: 'technical details' },
    { num: '04', title: 'SPECIFY', desc: 'for your project' },
  ];

  return (
    <section
      id="bespoke-design"
      style={{
        backgroundColor: '#d8d4cd',
        color: '#2d333e',
        paddingTop: 'clamp(5rem, 8vw, 8rem)',
        paddingBottom: 'clamp(5rem, 8vw, 8rem)',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Narrative & Process Steps */}
          <div className="col-span-12 lg:col-span-6">
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#4b5563',
                display: 'block',
                marginBottom: '1.25rem',
              }}
            >
              BESPOKE BY DESIGN
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#2d333e',
                marginBottom: '1.5rem',
              }}
            >
              FROM CATALOGUE TO CREATION
            </h2>

            <p
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.75,
                color: '#374151',
                marginBottom: '3rem',
                maxWidth: '520px',
              }}
            >
              We adapt our existing range to your architectural vision — with custom dimensions, finishes, optics and
              technical integration.
            </p>

            {/* 4 Steps Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '3.5rem',
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                paddingTop: '2rem',
              }}
            >
              {steps.map((step) => (
                <div key={step.num}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      display: 'block',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {step.num}
                  </span>
                  <h4
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#2d333e',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {step.title}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      color: '#4b5563',
                      display: 'block',
                    }}
                  >
                    {step.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Pill CTA Button */}
            <Link
              href="/contact?topic=Bespoke%20Luminaire%20Engineering"
              className="btn btn-pill"
              style={{
                backgroundColor: 'transparent',
                color: '#2d333e',
                border: '1px solid #2d333e',
                padding: '0.875rem 2rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#2d333e';
              }}
            >
              <span>START A BESPOKE PROJECT</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right Column: Interactive Annotated Luminaire */}
          <div className="col-span-12 lg:col-span-6">
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '540px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Product Visual Centerpiece */}
              <div
                style={{
                  position: 'relative',
                  width: '320px',
                  height: '420px',
                  transform: 'rotate(-12deg)',
                  filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80"
                  alt="Customizable cylinder luminaire with precision optical reflector"
                  fill
                  sizes="400px"
                  style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </div>

              {/* Hotspot Pins and Callout Annotations */}
              {hotspots.map((spot) => {
                const isHovered = activeHotspot === spot.id;
                return (
                  <div
                    key={spot.id}
                    onMouseEnter={() => setActiveHotspot(spot.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    style={{
                      position: 'absolute',
                      top: spot.top,
                      left: spot.left,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      zIndex: 20,
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {/* Ring Pin */}
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '1.5px solid #2d333e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isHovered ? '#374151' : 'transparent',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: isHovered ? '#ffffff' : '#2d333e',
                        }}
                      />
                    </div>

                    {/* Annotation Text */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#4b5563',
                        }}
                      >
                        {spot.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#2d333e',
                        }}
                      >
                        {spot.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
