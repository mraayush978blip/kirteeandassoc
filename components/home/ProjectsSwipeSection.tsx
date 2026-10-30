'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteImages } from '@/lib/useSiteImages';

interface ProjectItem {
  id: string;
  slotId: string;
  num: string;
  title: string;
  location: string;
  imageUrl: string;
  slug: string;
}

const projects: ProjectItem[] = [
  {
    id: 'proj-1',
    slotId: 'project-1',
    num: '01',
    title: 'PRIVATE RESIDENCE',
    location: 'Mumbai, India',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    slug: 'private-residence-mumbai',
  },
  {
    id: 'proj-2',
    slotId: 'project-2',
    num: '02',
    title: 'BOUTIQUE HOTEL',
    location: 'Dubai, UAE',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    slug: 'boutique-hotel-dubai',
  },
  {
    id: 'proj-3',
    slotId: 'project-3',
    num: '03',
    title: 'ARCHITECTURAL INTERIOR',
    location: 'London, UK',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    slug: 'architectural-interior-london',
  },
  {
    id: 'proj-4',
    slotId: 'project-4',
    num: '04',
    title: 'CULTURAL PAVILION',
    location: 'Milan, Italy',
    imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    slug: 'cultural-pavilion-milan',
  },
  {
    id: 'proj-5',
    slotId: 'project-5',
    num: '05',
    title: 'CIVIC GALLERIA',
    location: 'Kyoto, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    slug: 'civic-galleria-kyoto',
  },
];

export interface ProjectsSwipeSectionProps {
  initialProjects?: any[];
  settings?: { showOnWebsite?: boolean };
}

export const ProjectsSwipeSection: React.FC<ProjectsSwipeSectionProps> = ({ initialProjects, settings }) => {
  const { getImage } = useSiteImages();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showProjects, setShowProjects] = useState<boolean>(
    Boolean(settings?.showOnWebsite)
  );
  const [projectList, setProjectList] = useState<ProjectItem[]>(
    initialProjects && initialProjects.length > 0 ? initialProjects : projects
  );

  // Sync state if settings prop changes
  React.useEffect(() => {
    if (settings?.showOnWebsite !== undefined) {
      setShowProjects(Boolean(settings.showOnWebsite));
    }
  }, [settings?.showOnWebsite]);

  // Check showOnWebsite master toggle and load dynamic projects
  React.useEffect(() => {
    fetch(`/api/content?key=projects&_t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.settings && data.data.settings.showOnWebsite !== undefined) {
            setShowProjects(Boolean(data.data.settings.showOnWebsite));
          }
          if (data.data.projects && Array.isArray(data.data.projects) && data.data.projects.length > 0) {
            setProjectList(data.data.projects);
          }
        }
      })
      .catch(() => {
        // Fallback default: false per user preference
      });
  }, []);

  // Check scroll boundary
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  // If master toggle is OFF, gracefully hide section from website
  if (!showProjects) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -420 : 420;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section
      id="projects"
      style={{
        backgroundColor: '#282b32',
        color: '#ffffff',
        paddingTop: 'clamp(3.5rem, 6vw, 6.5rem)',
        paddingBottom: 'clamp(3.5rem, 6vw, 6.5rem)',
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
          {projectList.map((proj) => (
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
                    aspectRatio: '16 / 11',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    backgroundColor: '#353943',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Image
                    src={proj.imageUrl || getImage(proj.slotId, proj.imageUrl, proj.title).url}
                    alt={getImage(proj.slotId, proj.imageUrl, proj.title).alt || proj.title}
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
                      background: 'linear-gradient(180deg, transparent 60%, rgba(10, 10, 10, 0.65) 100%)',
                    }}
                  />
                </div>

                {/* Project Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
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
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                    >
                      {proj.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'rgba(255, 255, 255, 0.65)',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                    >
                      {proj.location}
                    </p>
                  </div>

                  <ArrowRight size={16} color="rgba(255, 255, 255, 0.7)" style={{ marginTop: '0.5rem', flexShrink: 0 }} />
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
