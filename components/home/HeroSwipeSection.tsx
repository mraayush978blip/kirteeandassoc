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

export interface HeroSwipeSectionProps {
  initialSlides?: HeroSlide[];
}

export const HeroSwipeSection: React.FC<HeroSwipeSectionProps> = ({ initialSlides }) => {
  const { getImage } = useSiteImages();
  const [slides, setSlides] = useState<HeroSlide[]>(
    initialSlides && initialSlides.length > 0 ? initialSlides : heroSlides
  );

  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides);
    }
  }, [initialSlides]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic hero slides from site settings / DB with resilient static fallback
  useEffect(() => {
    fetch('/api/content?key=hero_slides', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSlides(data.data);
        }
      })
      .catch(() => {
        // Fallback to static slides in case server is slow or offline
      });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance slides every 5.5 seconds (gives user comfortable reading time)
  useEffect(() => {
    if (isDragging) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

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

  // Touch Swipe Handlers with Direction Detection (Prevents vertical scroll lag & zoom jump)
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;

    // Detect gesture direction before committing to horizontal drag
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 8) {
        // Vertical scroll: do not interfere with browser scroll, leave isDragging false
        isHorizontalSwipeRef.current = false;
        return;
      } else if (Math.abs(diffX) > 12) {
        // Horizontal swipe: activate drag
        isHorizontalSwipeRef.current = true;
        setIsDragging(true);
      }
    }

    if (isHorizontalSwipeRef.current) {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipeRef.current) {
      if (dragOffset < -50) {
        nextSlide();
      } else if (dragOffset > 50) {
        prevSlide();
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    isHorizontalSwipeRef.current = null;
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

  const active = slides[currentSlide] || slides[0] || heroSlides[0];

  return (
    <section
      ref={containerRef}
      aria-label="Zenvora Architectural Lighting Systems"
      style={{
        position: 'relative',
        height: 'clamp(540px, 86vh, 800px)',
        minHeight: '520px',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '1rem',
        userSelect: 'none',
        touchAction: 'pan-y',
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
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const resolved = { url: slide.imageUrl || getImage(slide.slotId, slide.imageUrl, slide.imageAlt).url, alt: slide.imageAlt || getImage(slide.slotId, slide.imageUrl, slide.imageAlt).alt };
          return (
            <div
              key={slide.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transform: `translateX(${
                  isActive ? `${dragOffset * 0.4}px` : index < currentSlide ? '-100%' : '100%'
                })`,
                transition: isDragging && isActive ? 'none' : 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
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
              {/* Subtle Natural Contrast Overlay for Text Readability (No Greyish Blur or Fog) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 70%)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Center Left & Right Navigation Arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        className="hero-nav-arrow hero-nav-arrow-left"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        style={{
          position: 'absolute',
          left: 'clamp(0.75rem, 2vw, 2.5rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 25,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(10, 10, 10, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.borderColor = '#ffffff';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.45)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        aria-label="Next slide"
        className="hero-nav-arrow hero-nav-arrow-right"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        style={{
          position: 'absolute',
          right: 'clamp(0.75rem, 2vw, 2.5rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 25,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(10, 10, 10, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.borderColor = '#ffffff';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.45)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronRight size={22} />
      </button>

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
          paddingTop: '1rem',
          paddingBottom: '1rem',
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
              color: 'rgba(255, 255, 255, 0.85)',
              display: 'block',
              marginBottom: 'clamp(0.75rem, 1.8vh, 1.25rem)',
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.6)',
            }}
          >
            {active.eyebrow}
          </span>

          {/* Heading: LIGHT, REFINED. */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.25rem, 5.5vw, 5rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              fontWeight: 500,
              color: '#ffffff',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
              whiteSpace: 'pre-line',
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.65)',
            }}
          >
            {active.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.875rem, 1.3vw, 1.0625rem)',
              lineHeight: 1.55,
              color: '#ffffff',
              fontWeight: 300,
              maxWidth: '480px',
              marginBottom: 'clamp(1rem, 2vh, 1.75rem)',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.65)',
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
          paddingBottom: 'clamp(1rem, 2vh, 1.75rem)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 'clamp(0.75rem, 1.5vh, 1.25rem)',
        }}
      >
        {/* Scroll indicator */}
        <div className="hero-scroll-indicator" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '1px',
              height: '24px',
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
        <div className="hero-bottom-controls" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Slide Indicator Number */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.1em',
            }}
          >
            0{currentSlide + 1} / 0{slides.length}
          </span>

          {/* Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {slides.map((slide, index) => (
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
          <div className="hero-bottom-nav-arrows" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
