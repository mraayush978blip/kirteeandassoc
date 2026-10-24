'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  slug: string;
  imageUrl: string;
  buttonLabel: string;
}

const slides: SlideItem[] = [
  {
    id: 'slide-1',
    title: 'Boltons',
    subtitle: 'Herzog & de Meuron',
    description: 'A sublime exploration of transparency, crystalline refraction and master glassmaking.',
    slug: 'boltons',
    imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=2000&q=85',
    buttonLabel: 'DISCOVER MORE',
  },
  {
    id: 'slide-2',
    title: 'Calipso',
    subtitle: 'Neil Poulton',
    description: 'Organic honeycomb architectural luminaire generated from algorithmic fractal moon scans.',
    slug: 'calipso',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=2000&q=85',
    buttonLabel: 'DISCOVER MORE',
  },
  {
    id: 'slide-3',
    title: 'A.24 System',
    subtitle: 'Carlotta de Bevilacqua',
    description: 'Open, flexible architectural linear system capable of drawing continuous lines of light.',
    slug: 'a-24-system',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    buttonLabel: 'DISCOVER MORE',
  },
  {
    id: 'slide-4',
    title: 'ALE.01',
    subtitle: 'BIG - Bjarke Ingels Group',
    description: 'Sustainable biomimetic suspended luminaire constructed from recycled biocomposites.',
    slug: 'ale-01',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2000&q=85',
    buttonLabel: 'DISCOVER MORE',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const activeSlide = slides[currentIndex];

  return (
    <section
      aria-label="Artemide Featured Architectural Luminaires Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        height: '90vh',
        minHeight: '620px',
        maxHeight: '920px',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#282b32',
        paddingTop: 'var(--header-height)',
      }}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: index === currentIndex ? 'scale(1)' : 'scale(1.04)',
            zIndex: index === currentIndex ? 1 : 0,
            pointerEvents: index === currentIndex ? 'auto' : 'none',
          }}
        >
          <Image
            src={slide.imageUrl}
            alt={`${slide.title} by ${slide.subtitle}`}
            fill
            priority={index === 0}
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
          {/* Subtle gradient vignette to highlight typography */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0.1) 100%)',
            }}
          />
        </div>
      ))}

      {/* Slide Typography & Content Overlay (Artemide Style) */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingBottom: '3rem',
        }}
      >
        <div style={{ maxWidth: '640px', color: '#ffffff' }}>
          <h1
            key={`title-${currentIndex}`}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
              color: '#ffffff',
              animation: 'fadeInUp 0.6s ease forwards',
            }}
          >
            {activeSlide.title}
          </h1>

          <p
            key={`sub-${currentIndex}`}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1.125rem, 2vw, 1.625rem)',
              fontWeight: 300,
              letterSpacing: '0.02em',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '2rem',
            }}
          >
            {activeSlide.subtitle}
          </p>

          <Link
            href={`/products/${activeSlide.slug}`}
            className="btn btn-pill"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              padding: '0.875rem 2rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#282b32';
              e.currentTarget.style.borderColor = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
            }}
          >
            <span>{activeSlide.buttonLabel}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Artemide Style Pagination Controls (< o o o o >) */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            right: ' clamp(1.25rem, 4vw, 3.5rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            zIndex: 20,
            background: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(12px)',
            padding: '0.6rem 1.25rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prevSlide}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.85,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
          >
            <ChevronLeft size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: index === currentIndex ? '22px' : '7px',
                  height: '7px',
                  borderRadius: '9999px',
                  backgroundColor: index === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next slide"
            onClick={nextSlide}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.85,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
