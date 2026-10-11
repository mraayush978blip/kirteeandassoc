'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface BespokeStep {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

// Using curated architectural photography matching Kirtee & Associates homepage aesthetic
const bespokeSteps: BespokeStep[] = [
  {
    number: '.01',
    title: 'Design Thinking',
    description:
      'From concept or sketch, all the way to the final installation, the process is collaborative to ensure your vision is fully realized.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Architectural lighting design concept',
  },
  {
    number: '.02',
    title: 'Prototyping',
    description:
      'Merging technology and emotion, we integrate light into architecture and nature, bringing a sophisticated poetic sensibility to our designs and creations.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Precision linear optical prototype',
  },
  {
    number: '.03',
    title: 'Realization',
    description:
      'Form, function, and performance drive each and every Flos creation, aided by the most advanced technologies and processes.',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Master artisanal luminaire realization',
  },
  {
    number: '.04',
    title: 'Installation',
    description:
      'As a full-service business, Flos believes in providing support and specialized assistance from inception to installation.',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Monolithic gallery architectural lighting installation',
  },
];

export const FlosBespokeProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="bespoke-process"
      aria-label="Flos Bespoke Process"
      style={{
        backgroundColor: '#ffffff',
        color: '#111111',
        paddingTop: 'clamp(5rem, 8vw, 8rem)',
        paddingBottom: 'clamp(5rem, 8vw, 8rem)',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div className="bespoke-grid">
          {/* Left Column: Image corresponding to active step */}
          <div className="bespoke-image-container">
            {bespokeSteps.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <div
                  key={step.number}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'scale(1)' : 'scale(1.03)',
                    transition:
                      'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'none',
                  }}
                >
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive Process Accordion List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Overline header */}
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: '#111111',
                display: 'block',
                marginBottom: 'clamp(1.75rem, 3vw, 2.5rem)',
              }}
            >
              FLOS BESPOKE PROCESS
            </span>

            {/* Accordion Steps List */}
            <div
              role="tablist"
              aria-label="Bespoke Process Steps"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(1.25rem, 2.5vw, 1.85rem)',
              }}
            >
              {bespokeSteps.map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                  <div
                    key={step.number}
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={0}
                    onClick={() => setActiveStep(idx)}
                    onMouseEnter={() => setActiveStep(idx)}
                    onFocus={() => setActiveStep(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveStep(idx);
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      outline: 'none',
                    }}
                    className="bespoke-step-item"
                  >
                    {/* Step number (.01, .02, ...) */}
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        color: isActive ? '#111111' : '#a8a8a8',
                        display: 'block',
                        marginBottom: '0.25rem',
                        transition: 'color 0.3s ease',
                      }}
                      className="bespoke-num"
                    >
                      {step.number}
                    </span>

                    {/* Step Title (Design Thinking, Prototyping, ...) */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(1.85rem, 3.2vw, 2.65rem)',
                        fontWeight: 400,
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        color: isActive ? '#111111' : '#a8a8a8',
                        margin: 0,
                        transition: 'color 0.3s ease',
                      }}
                      className="bespoke-title"
                    >
                      {step.title}
                    </h3>

                    {/* Step Description (smooth expand when active) */}
                    <div
                      style={{
                        maxHeight: isActive ? '180px' : '0px',
                        opacity: isActive ? 1 : 0,
                        overflow: 'hidden',
                        transition:
                          'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, margin-top 0.4s ease',
                        marginTop: isActive ? '0.85rem' : '0px',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.9375rem',
                          lineHeight: 1.65,
                          color: '#4b5563',
                          maxWidth: '440px',
                          margin: 0,
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optional CTA to start consultation */}
            <div style={{ marginTop: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              <Link
                href="/contact?topic=Bespoke%20Consultation"
                style={{
                  fontFamily: 'var(--font-sans)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  padding: '0.875rem 2rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#111111';
                }}
              >
                <span>START A BESPOKE PROJECT</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
