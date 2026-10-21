'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteImages } from '@/lib/useSiteImages';

interface HeroSlide {
  id: string;
  slotId: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    slotId: 'hero-slide-1',
    eyebrow: 'ARCHITECTURAL LIGHTING SYSTEMS',
    title: 'LIGHT,\nREFINED.',
    subtitle: 'Bespoke architectural lighting systems engineered for exceptional spaces.',
    ctaText: 'EXPLORE COLLECTIONS',
    ctaHref: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    imageAlt: 'Bespoke pendant luminaire illuminating warm dining table overlooking ocean twilight',
  },
  {
    id: 'hero-2',
    slotId: 'hero-slide-2',
    eyebrow: 'PRECISION OPTICAL CRAFT',
    title: 'SPACE,\nDEFINED.',
    subtitle: 'Micro-aperture linear wall grazers and dark-light downlights for monolithic architecture.',
    ctaText: 'DISCOVER DRY GOODS',
    ctaHref: '/dry-goods',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
    imageAlt: 'Continuous linear lighting grazing architectural travertine wall',
  },
  {
    id: 'hero-3',
    slotId: 'hero-slide-3',
    eyebrow: 'IP68 SUBMERSIBLE SYSTEMS',
    title: 'FORM,\nENDURING.',
    subtitle: 'Marine-grade in-ground facade projectors crafted for extreme subterranean resilience.',
    ctaText: 'DISCOVER WET GOODS',
    ctaHref: '/wet-goods',
    imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=2000&q=85',
    imageAlt: 'Articulated architectural bronze projectors illuminating water and facade',
  },
];

export const HeroSwipeSection: React.FC = () => {
  const { getImage } = useSiteImages();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-advance slides every 3 seconds
  useEffect(() => {
    if (isDragging) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [nextSlide, isDragging, currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragOffset < -50) {
      nextSlide();
    } else if (dragOffset > 50) {
      prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset < -60) {
      nextSlide();
    } else if (dragOffset > 60) {
      prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const active = heroSlides[currentSlide];

  return (
    <section
      ref={containerRef}
      aria-label="Zenvora Architectural Lighting Systems"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#0c0d10',
        color: '#ffffff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'calc(var(--header-height) + 1.5rem)',
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Swipeable Image Slides */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          const resolved = getImage(slide.slotId, slide.imageUrl, slide.imageAlt);
          return (
            <div
              key={slide.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transform: `translateX(${
                  isActive ? `${dragOffset * 0.4}px` : index < currentSlide ? '-100%' : '100%'
                }) scale(${isActive ? 1 : 1.05})`,
                transition: isDragging && isActive ? 'none' : 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'none',
              }}
            >
              <Image
                src={resolved.url}
                alt={resolved.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 40%',
                }}
              />
              {/* Dual Vignette Overlay from Screenshot */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(12, 13, 16, 0.92) 0%, rgba(12, 13, 16, 0.75) 38%, rgba(12, 13, 16, 0.2) 70%, rgba(12, 13, 16, 0.4) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(12, 13, 16, 0.4) 0%, transparent 40%, rgba(12, 13, 16, 0.85) 90%, #0c0d10 100%)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Main Content Layout */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '2rem',
          paddingBottom: '3rem',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          {/* Eyebrow */}
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'rgba(255, 255, 255, 0.75)',
              display: 'block',
              marginBottom: '1.75rem',
            }}
          >
            {active.eyebrow}
          </span>

          {/* Heading: LIGHT, REFINED. */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.25rem, 6.5vw, 6rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              fontWeight: 500,
              color: '#ffffff',
              marginBottom: '1.5rem',
              whiteSpace: 'pre-line',
            }}
          >
            {active.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.9375rem, 1.8vw, 1.125rem)',
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 300,
              maxWidth: '480px',
              marginBottom: '2.25rem',
            }}
          >
            {active.subtitle}
          </p>

          {/* Button: EXPLORE COLLECTIONS → */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link
              href={active.ctaHref}
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
                borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
                paddingBottom: '0.4rem',
                transition: 'border-color 0.2s ease, gap 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.gap = '1rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.gap = '0.75rem';
              }}
            >
              <span>{active.ctaText}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar: SCROLL TO EXPLORE & Swipe Navigation Controls */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '2.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem',
        }}
      >
        {/* Scroll indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '1px',
              height: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            }}
          />
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.65)',
            }}
          >
            SCROLL TO EXPLORE
          </span>
        </div>

        {/* Swipe Left/Right Controls & Slide Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Slide Indicator Number */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.1em',
            }}
          >
            0{currentSlide + 1} / 0{heroSlides.length}
          </span>

          {/* Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
                style={{
                  width: index === currentSlide ? '28px' : '6px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: index === currentSlide ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Arrow Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              aria-label="Swipe previous image"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, transform 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              aria-label="Swipe next image"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, transform 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
