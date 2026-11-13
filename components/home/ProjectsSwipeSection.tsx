'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProjectItem {
  id: string;
  slotId?: string;
  num?: string;
  title: string;
  location: string;
  category?: string;
  year?: string;
  description?: string;
  imageUrl: string;
  slug?: string;
}

export interface ProjectsSwipeSectionProps {
  initialProjects?: any[];
  settings?: { showOnWebsite?: boolean };
}

export const ProjectsSwipeSection: React.FC<ProjectsSwipeSectionProps> = ({ initialProjects, settings }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showProjects, setShowProjects] = useState<boolean>(
    Boolean(settings?.showOnWebsite)
  );
  const [projectList, setProjectList] = useState<ProjectItem[]>(
    Array.isArray(initialProjects) ? initialProjects : []
  );
  const [openProject, setOpenProject] = useState<ProjectItem | null>(null);

  // Popup: close on Escape and stop the page behind it from scrolling
  React.useEffect(() => {
    if (!openProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenProject(null);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [openProject]);

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
          if (data.data.projects && Array.isArray(data.data.projects)) {
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
  if (!showProjects || projectList.length === 0) {
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
        backgroundColor: '#ffffff',
        color: '#111827',
        borderTop: '1px solid #e5e7eb',
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
                color: '#6b7280',
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
                color: '#111827',
              }}
            >
              SPACES THAT INSPIRE
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
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
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  color: '#111827',
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
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  color: '#111827',
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
              <button
                type="button"
                onClick={() => setOpenProject(proj)}
                aria-haspopup="dialog"
                aria-label={`Read about ${proj.title}`}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
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
                    backgroundColor: '#f3f4f6',
                    marginBottom: '1.25rem',
                  }}
                >
                  {proj.imageUrl ? (
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
                  ) : null}
                </div>

                {/* Project Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#9ca3af',
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
                        color: '#111827',
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
                        color: '#4b5563',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                    >
                      {proj.location}
                    </p>
                  </div>

                  <ArrowRight size={16} color="#6b7280" style={{ marginTop: '0.5rem', flexShrink: 0 }} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {openProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openProject.title}
          onClick={() => setOpenProject(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(0.75rem, 3vw, 2rem)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '92vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              color: '#111827',
              borderRadius: '4px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            }}
          >
            <button
              type="button"
              onClick={() => setOpenProject(null)}
              aria-label="Close"
              autoFocus
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                zIndex: 2,
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.92)',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <X size={18} />
            </button>

            {openProject.imageUrl && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 11', backgroundColor: '#f3f4f6' }}>
                <Image src={openProject.imageUrl} alt={openProject.title} fill sizes="(max-width: 768px) 100vw, 720px" style={{ objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
              {(openProject.category || openProject.year) && (
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                  }}
                >
                  {[openProject.category, openProject.year].filter(Boolean).join(' · ')}
                </span>
              )}
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 500,
                  lineHeight: 1.15,
                  margin: '0 0 0.35rem 0',
                  color: '#111827',
                  overflowWrap: 'break-word',
                }}
              >
                {openProject.title}
              </h3>
              <p style={{ margin: '0 0 1.1rem 0', fontSize: '0.875rem', color: '#4b5563' }}>{openProject.location}</p>
              {openProject.description ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: '#374151',
                    whiteSpace: 'pre-line',
                    overflowWrap: 'break-word',
                  }}
                >
                  {openProject.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}

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
