'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectItem {
  id: string;
  num: string;
  title: string;
  location: string;
  imageUrl: string;
  slug: string;
}

const projects: ProjectItem[] = [
  {
    id: 'proj-1',
    num: '01',
    title: 'PRIVATE RESIDENCE',
    location: 'Mumbai, India',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    slug: 'private-residence-mumbai',
  },
  {
    id: 'proj-2',
    num: '02',
    title: 'BOUTIQUE HOTEL',
    location: 'Dubai, UAE',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    slug: 'boutique-hotel-dubai',
  },
  {
    id: 'proj-3',
    num: '03',
    title: 'ARCHITECTURAL INTERIOR',
    location: 'London, UK',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    slug: 'architectural-interior-london',
  },
  {
    id: 'proj-4',
    num: '04',
    title: 'CULTURAL PAVILION',
    location: 'Milan, Italy',
    imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    slug: 'cultural-pavilion-milan',
  },
  {
    id: 'proj-5',
    num: '05',
    title: 'CIVIC GALLERIA',
    location: 'Kyoto, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    slug: 'civic-galleria-kyoto',
  },
];

export const ProjectsSwipeSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll boundary
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -420 : 420;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section
      id="projects"
      style={{
        backgroundColor: '#0c0d10',
        color: '#ffffff',
        paddingTop: 'clamp(5rem, 8vw, 8rem)',
        paddingBottom: 'clamp(5rem, 8vw, 8rem)',
        overflow: 'hidden',
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
          <div>
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
              FEATURED PROJECTS
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                color: '#ffffff',
              }}
            >
              SPACES THAT INSPIRE
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
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
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
            >
              <span>VIEW ALL PROJECTS</span>
              <ArrowRight size={15} />
            </Link>

            {/* Left/Right Swipe Navigation Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll projects left"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                  opacity: canScrollLeft ? 1 : 0.4,
                  transition: 'background-color 0.2s ease',
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll projects right"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollRight ? 'pointer' : 'not-allowed',
                  opacity: canScrollRight ? 1 : 0.4,
                  transition: 'background-color 0.2s ease',
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Swipeable Projects Row (Touch/Drag & Scroll) */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          style={{
            display: 'flex',
            gap: '1.5rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '1rem',
            cursor: 'grab',
          }}
          className="no-scrollbar"
        >
          {projects.map((proj) => (
            <div
              key={proj.id}
              style={{
                flexShrink: 0,
                width: 'clamp(280px, 22vw, 420px)',
                scrollSnapAlign: 'start',
              }}
            >
              <Link
                href="/products"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                className="group"
              >
                {/* Project Image */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 'clamp(260px, 15vw, 320px)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    backgroundColor: '#14161b',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Image
                    src={proj.imageUrl}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="project-img"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(12, 13, 16, 0.7) 100%)',
                    }}
                  />
                </div>

                {/* Project Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        display: 'block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {proj.num}
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#ffffff',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {proj.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'rgba(255, 255, 255, 0.65)',
                      }}
                    >
                      {proj.location}
                    </p>
                  </div>

                  <ArrowRight size={16} color="rgba(255, 255, 255, 0.7)" style={{ marginTop: '0.5rem' }} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .project-img:hover {
          transform: scale(1.04);
        }
      `}</style>
    </section>
  );
};
