'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductSpecification } from '@/types/product';
import { ChevronLeft, ChevronRight, Download, X, Maximize2 } from 'lucide-react';
import { FacebookIcon, XTwitterIcon, LinkedinIcon, InstagramIcon } from '@/components/ui/Icons';

export interface ArtemideProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export const ArtemideProductDetail: React.FC<ArtemideProductDetailProps> = ({
  product,
  relatedProducts,
}) => {
  const allImages = (product.heroCarouselImages && product.heroCarouselImages.length > 0)
    ? product.heroCarouselImages
    : [product.heroImage, ...(product.gallery || [])].filter(Boolean);
  const pinnedIndex = allImages.findIndex(
    (img) => img.isPrimary || (product.heroImage && img.url === product.heroImage.url)
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(pinnedIndex >= 0 ? pinnedIndex : 0);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    alt: string;
    tag: string;
    caption: string;
  } | null>(null);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${product.name} by Kirtee & Associates Architectural Collection`);

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadBrochure = () => {
    const download = product.downloads?.[0];
    if (download && download.fileUrl && download.fileUrl !== '#') {
      window.open(download.fileUrl, '_blank');
    } else {
      alert(`Downloading ${product.name} Technical Specification Brochure & Photometric Package (PDF)...`);
    }
  };

  const scrollToSpecs = () => {
    const el = document.getElementById('technical-specifications');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Curated pool of high-res architectural lighting perspectives
  const architecturalPool = [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      alt: `${product.name} spatial interior installation view`,
      tag: '01 / ARCHITECTURAL SPACE',
      caption: 'Seamless architectural integration delivering balanced horizontal and vertical illumination.',
    },
    {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
      alt: `${product.name} wall grazing light pattern`,
      tag: '02 / OPTICAL DIFFUSER',
      caption: 'Micro-engineered fractal apertures delivering zero-glare, high visual comfort emission.',
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      alt: `${product.name} contemporary architectural pavilion`,
      tag: '03 / GRAZING EMISSION',
      caption: 'High-uniformity beam distribution accentuating monolithic masonry and textures.',
    },
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      alt: `${product.name} twilight ambient atmosphere`,
      tag: '04 / AMBIENT WARMTH',
      caption: 'Warm spectral balance creating emotionally resonant transitions between interior and exterior.',
    },
    {
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
      alt: `${product.name} refined material craftsmanship and finish`,
      tag: '05 / TACTILE CRAFTSMANSHIP',
      caption: 'Concealed mechanical junction and pure material finishing with microscopic tolerances.',
    },
  ];

  // Guarantee 5 distinct, deduplicated images
  const usedUrls = new Set<string>();
  const productPhotos: { url: string; alt: string; tag: string; caption: string }[] = [];

  const rawProductImgs = [
    product.heroImage,
    ...(product.heroCarouselImages || []),
    ...(product.gallery || []),
  ].filter(Boolean);
  for (const img of rawProductImgs) {
    if (img && img.url && !usedUrls.has(img.url) && productPhotos.length < 5) {
      usedUrls.add(img.url);
      const tagIndex = productPhotos.length;
      productPhotos.push({
        url: img.url,
        alt: img.alt || `${product.name} architectural view ${tagIndex + 1}`,
        tag: architecturalPool[tagIndex]?.tag || `0${tagIndex + 1} / DETAIL PERSPECTIVE`,
        caption: img.caption || architecturalPool[tagIndex]?.caption || 'Precision architectural luminaire optical performance.',
      });
    }
  }

  for (const poolItem of architecturalPool) {
    if (productPhotos.length >= 5) break;
    if (!usedUrls.has(poolItem.url)) {
      usedUrls.add(poolItem.url);
      const tagIndex = productPhotos.length;
      productPhotos.push({
        url: poolItem.url,
        alt: poolItem.alt,
        tag: `0${tagIndex + 1} / ${poolItem.tag.split('/ ')[1] || 'PERSPECTIVE'}`,
        caption: poolItem.caption,
      });
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ========================================================= */}
      {/* 1. TOP HERO LUMINAIRE CAROUSEL SLIDER */}
      {/* ========================================================= */}
      <section
        aria-label={`${product.name} Gallery Showcase`}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(460px, 66vh, 720px)',
          background: 'linear-gradient(135deg, #dcdcdc 0%, #ebebeb 45%, #f6f6f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {allImages.length > 0 && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={allImages[currentImageIndex].url}
              alt={allImages[currentImageIndex].alt || product.name}
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'center 42%',
                transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        )}

        {/* Floating Minimalist Left Arrow */}
        {allImages.length > 1 && (
          <button
            type="button"
            onClick={prevImage}
            aria-label="Previous luminaire view"
            style={{
              position: 'absolute',
              left: 'clamp(1rem, 3.5vw, 3rem)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              opacity: 0.9,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </button>
        )}

        {/* Floating Minimalist Right Arrow */}
        {allImages.length > 1 && (
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next luminaire view"
            style={{
              position: 'absolute',
              right: 'clamp(1rem, 3.5vw, 3rem)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              opacity: 0.9,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={32} strokeWidth={1.5} />
          </button>
        )}

        {/* Bottom Pagination Dots */}
        {allImages.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '1.75rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              zIndex: 10,
            }}
          >
            {allImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setCurrentImageIndex(idx)}
                style={{
                  width: idx === currentImageIndex ? '8px' : '6px',
                  height: idx === currentImageIndex ? '8px' : '6px',
                  borderRadius: '50%',
                  backgroundColor: idx === currentImageIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s ease',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 2. TITLE & EDITORIAL STORY */}
      {/* ========================================================= */}
      <section
        style={{
          paddingTop: 'clamp(3rem, 5.5vw, 5rem)',
          paddingBottom: 'clamp(3rem, 5vw, 4.5rem)',
          backgroundColor: '#ffffff',
          color: '#111827',
        }}
      >
        <div className="container" style={{ maxWidth: '1440px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 'clamp(2rem, 5vw, 4.5rem)',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Big Product Title */}
            <div className="col-span-12 lg:col-span-4">
              <h1
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(2.75rem, 5vw, 4.25rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  color: '#111827',
                  margin: 0,
                  lineHeight: 1.05,
                }}
              >
                {product.name}
              </h1>

              {product.designer && (
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginTop: '0.85rem',
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                  }}
                >
                  Design by {product.designer}
                </span>
              )}
            </div>

            {/* Right Column: Actions Row + Narrative */}
            <div className="col-span-12 lg:col-span-8">
              {/* Top Row: Download Brochure Pill & Social Icons (Only show if at least one link is configured) */}
              {(() => {
                const brochureUrl = product.downloads?.[0]?.fileUrl?.trim();
                const hasBrochure = Boolean(brochureUrl && brochureUrl !== '#' && brochureUrl !== '');

                const fbUrl = product.socialLinks?.facebook?.trim();
                const twitterUrl = product.socialLinks?.twitter?.trim();
                const linkedinUrl = product.socialLinks?.linkedin?.trim();
                const instaUrl = product.socialLinks?.instagram?.trim();

                const hasFb = Boolean(fbUrl && fbUrl !== '');
                const hasTwitter = Boolean(twitterUrl && twitterUrl !== '');
                const hasLinkedin = Boolean(linkedinUrl && linkedinUrl !== '');
                const hasInsta = Boolean(instaUrl && instaUrl !== '');
                const hasSocial = hasFb || hasTwitter || hasLinkedin || hasInsta;

                if (!hasBrochure && !hasSocial) return null;

                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '1rem',
                      marginBottom: '2rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Download Brochure Pill Button */}
                    {hasBrochure && (
                      <a
                        href={brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.55rem 1.35rem',
                          borderRadius: '9999px',
                          border: '1px solid #111827',
                          backgroundColor: 'transparent',
                          color: '#111827',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#111827';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#111827';
                        }}
                      >
                        <span>{product.brochureButtonText || product.downloads?.[0]?.title || 'Download Brochure'}</span>
                        <Download size={13} strokeWidth={2} />
                      </a>
                    )}

                    {/* Social Share Round Icons (Only configured platforms) */}
                    {hasSocial && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        {hasFb && (
                          <a
                            href={fbUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook Profile"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: '1px solid #d1d5db',
                              background: 'none',
                              color: '#4b5563',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              transition: 'border-color 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#111827';
                              e.currentTarget.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#d1d5db';
                              e.currentTarget.style.color = '#4b5563';
                            }}
                          >
                            <FacebookIcon size={14} />
                          </a>
                        )}

                        {hasTwitter && (
                          <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X (Twitter) Profile"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: '1px solid #d1d5db',
                              background: 'none',
                              color: '#4b5563',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              transition: 'border-color 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#111827';
                              e.currentTarget.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#d1d5db';
                              e.currentTarget.style.color = '#4b5563';
                            }}
                          >
                            <XTwitterIcon size={13} />
                          </a>
                        )}

                        {hasLinkedin && (
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn Profile"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: '1px solid #d1d5db',
                              background: 'none',
                              color: '#4b5563',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              transition: 'border-color 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#111827';
                              e.currentTarget.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#d1d5db';
                              e.currentTarget.style.color = '#4b5563';
                            }}
                          >
                            <LinkedinIcon size={13} />
                          </a>
                        )}

                        {hasInsta && (
                          <a
                            href={instaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram Profile"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: '1px solid #d1d5db',
                              background: 'none',
                              color: '#4b5563',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              transition: 'border-color 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#111827';
                              e.currentTarget.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#d1d5db';
                              e.currentTarget.style.color = '#4b5563';
                            }}
                          >
                            <InstagramIcon size={14} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Editorial Narrative Text */}
              <div style={{ position: 'relative', paddingBottom: '2rem' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(0.9375rem, 1.15vw, 1.0625rem)',
                    lineHeight: 1.8,
                    color: '#374151',
                    fontWeight: 400,
                    margin: 0,
                    textAlign: 'justify',
                  }}
                >
                  {product.editorialStory || product.fullDescription}
                </p>

                {/* Bottom Right Corner: Spec Sheet Quick Link [ ⊠ ] */}
                <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <button
                    type="button"
                    onClick={scrollToSpecs}
                    title="Jump to Technical Specifications"
                    aria-label="View Technical Specifications"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '2px',
                      border: '1px solid #9ca3af',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#111827';
                      e.currentTarget.style.color = '#111827';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#9ca3af';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        border: '1.5px solid currentColor',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '1px',
                          backgroundColor: 'currentColor',
                          transform: 'rotate(45deg)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '1px',
                          backgroundColor: 'currentColor',
                          transform: 'rotate(-45deg)',
                        }}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. TECHNICAL SPECIFICATIONS MATRIX */}
          {/* ========================================================= */}
          {product.specifications && product.specifications.length > 0 && (
            <div
              id="technical-specifications"
              style={{
                marginTop: '4rem',
                paddingTop: '3.5rem',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <div style={{ marginBottom: '2.5rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                  }}
                >
                  {product.specsEyebrow || 'ENGINEERING & PHOTOMETRIC MATRIX'}
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: '#111827',
                    margin: 0,
                  }}
                >
                  {product.specsHeading || 'Technical Specifications'}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9375rem',
                    color: '#4b5563',
                    marginTop: '0.5rem',
                    maxWidth: '720px',
                    lineHeight: 1.6,
                  }}
                >
                  {product.specsDescription || 'Precision photometric data, electrical ratings, and mechanical dimensions measured in accordance with laboratory standards.'}
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                {product.specifications.map((spec: ProductSpecification) => (
                  <div
                    key={spec.id}
                    style={{
                      padding: '1.25rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#fafafa',
                      borderRadius: '4px',
                      transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#111827';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = '#fafafa';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: '#6b7280',
                        letterSpacing: '0.08em',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {spec.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#111827',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {spec.value} {spec.unit && spec.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. UNIQUE PRODUCT PERSPECTIVES PHOTO GRID (FRAMED WITH BALANCED RATIOS) */}
      {/* ========================================================= */}
      <section
        id="product-gallery-grid"
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem',
          paddingLeft: 'clamp(1.5rem, 4vw, 3.75rem)',
          paddingRight: 'clamp(1.5rem, 4vw, 3.75rem)',
          boxSizing: 'border-box',
        }}
      >
        {/* Gallery Section Header Container - aligns with the photos */}
        <div style={{ maxWidth: '1440px', marginBottom: '2.25rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#6b7280',
              marginBottom: '0.5rem',
            }}
          >
            {product.galleryEyebrow || 'VISUAL PERSPECTIVES & CRAFT'}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#111827',
              margin: 0,
            }}
          >
            {product.galleryHeading || 'Architectural Installation & Detail Gallery'}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9375rem',
              color: '#4b5563',
              marginTop: '0.5rem',
              maxWidth: '720px',
              lineHeight: 1.6,
            }}
          >
            {product.galleryDescription || `Photographic portfolio capturing ${product.name}'s optical precision, tactile surface craft, and luminous dialogue within architectural spaces.`}
          </p>
        </div>

        {/* ELEGANT MODULAR ZERO-GAP PHOTO GRID WITH BALANCED RATIOS */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 0,
            margin: 0,
            padding: 0,
            backgroundColor: '#0A0A09',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {/* Photo 1: Panel 1 (Span 6 - 50% width) */}
          <div
            className="photo-grid-half group"
            onClick={() => setSelectedPhoto(productPhotos[0])}
            style={{
              gridColumn: 'span 6',
              position: 'relative',
              height: '460px',
              overflow: 'hidden',
              borderRadius: 0,
              border: 'none',
              backgroundColor: '#151514',
              cursor: 'pointer',
            }}
          >
            <Image
              src={productPhotos[0].url}
              alt={productPhotos[0].alt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="group-hover:scale-105"
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(10, 10, 9, 0.82) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.75rem',
                left: '2rem',
                right: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '0.3rem 0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#111827',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    borderRadius: '2px',
                  }}
                >
                  {productPhotos[0].tag}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: '#ffffff',
                    margin: 0,
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    maxWidth: '480px',
                  }}
                >
                  {productPhotos[0].caption}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <Maximize2 size={16} />
              </div>
            </div>
          </div>

          {/* Photo 2: Panel 2 (Span 6 - 50% width) */}
          <div
            className="photo-grid-half group"
            onClick={() => setSelectedPhoto(productPhotos[1])}
            style={{
              gridColumn: 'span 6',
              position: 'relative',
              height: '460px',
              overflow: 'hidden',
              borderRadius: 0,
              border: 'none',
              backgroundColor: '#151514',
              cursor: 'pointer',
            }}
          >
            <Image
              src={productPhotos[1].url}
              alt={productPhotos[1].alt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="group-hover:scale-105"
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(10, 10, 9, 0.82) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.75rem',
                left: '2rem',
                right: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '0.3rem 0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#111827',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    borderRadius: '2px',
                  }}
                >
                  {productPhotos[1].tag}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: '#ffffff',
                    margin: 0,
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    maxWidth: '480px',
                  }}
                >
                  {productPhotos[1].caption}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <Maximize2 size={16} />
              </div>
            </div>
          </div>

          {/* Photo 3: Panel 3 (Span 4 - 33.3% width) */}
          <div
            className="photo-grid-third group"
            onClick={() => setSelectedPhoto(productPhotos[2])}
            style={{
              gridColumn: 'span 4',
              position: 'relative',
              height: '360px',
              overflow: 'hidden',
              borderRadius: 0,
              border: 'none',
              backgroundColor: '#151514',
              cursor: 'pointer',
            }}
          >
            <Image
              src={productPhotos[2].url}
              alt={productPhotos[2].alt}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="group-hover:scale-105"
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 45%, rgba(10, 10, 9, 0.78) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.75rem',
                right: '1.75rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '0.25rem 0.55rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#111827',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                  borderRadius: '2px',
                }}
              >
                {productPhotos[2].tag}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                {productPhotos[2].caption}
              </p>
            </div>
          </div>

          {/* Photo 4: Panel 4 (Span 4 - 33.3% width) */}
          <div
            className="photo-grid-third group"
            onClick={() => setSelectedPhoto(productPhotos[3])}
            style={{
              gridColumn: 'span 4',
              position: 'relative',
              height: '360px',
              overflow: 'hidden',
              borderRadius: 0,
              border: 'none',
              backgroundColor: '#151514',
              cursor: 'pointer',
            }}
          >
            <Image
              src={productPhotos[3].url}
              alt={productPhotos[3].alt}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="group-hover:scale-105"
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 45%, rgba(10, 10, 9, 0.78) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.75rem',
                right: '1.75rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '0.25rem 0.55rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#111827',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                  borderRadius: '2px',
                }}
              >
                {productPhotos[3].tag}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                {productPhotos[3].caption}
              </p>
            </div>
          </div>

          {/* Photo 5: Panel 5 (Span 4 - 33.3% width) */}
          <div
            className="photo-grid-third group"
            onClick={() => setSelectedPhoto(productPhotos[4])}
            style={{
              gridColumn: 'span 4',
              position: 'relative',
              height: '360px',
              overflow: 'hidden',
              borderRadius: 0,
              border: 'none',
              backgroundColor: '#151514',
              cursor: 'pointer',
            }}
          >
            <Image
              src={productPhotos[4].url}
              alt={productPhotos[4].alt}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="group-hover:scale-105"
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 45%, rgba(10, 10, 9, 0.78) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.75rem',
                right: '1.75rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '0.25rem 0.55rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#111827',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                  borderRadius: '2px',
                }}
              >
                {productPhotos[4].tag}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                {productPhotos[4].caption}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FAMILIAR PRODUCTS (Related Luminaire Families) */}
      {/* ========================================================= */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '2.75rem',
            paddingBottom: '2.5rem',
            paddingLeft: 'clamp(1.5rem, 4vw, 3.75rem)',
            paddingRight: 'clamp(1.5rem, 4vw, 3.75rem)',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: '100%' }}>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                fontWeight: 600,
                color: '#111111',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {product.relatedHeading || 'Related Luminaire Families'}
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '1.25rem',
              }}
            >
              {relatedProducts.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  style={{
                    gridColumn: 'span 4',
                  }}
                  className="related-col"
                >
                  <Link
                    href={`/products/${rel.slug}`}
                    style={{
                      display: 'block',
                      position: 'relative',
                      height: '450px',
                      overflow: 'hidden',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                      textDecoration: 'none',
                    }}
                    className="mosaic-item group"
                  >
                    <Image
                      src={rel.heroImage.url}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="group-hover:scale-105"
                    />

                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.45) 100%)',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1.25rem',
                        left: '1.25rem',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.94)',
                          backdropFilter: 'blur(8px)',
                          padding: '0.4rem 0.85rem',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#111111',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          borderRadius: '2px',
                        }}
                      >
                        {rel.codeLabel || rel.name}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 6. LIGHTBOX MODAL FOR UNIQUE PRODUCT PHOTO PREVIEW */}
      {/* ========================================================= */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(10, 10, 9, 0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 3vw, 2.5rem)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '1200px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#151514',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
              border: '1px solid #302F2B',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '70vh',
                backgroundColor: '#0A0A09',
              }}
            >
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.alt}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>

            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderTop: '1px solid #302F2B',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#22211E',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: '#C8C2B7',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.25rem',
                  }}
                >
                  {selectedPhoto.tag}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9375rem',
                    color: '#E9E6DE',
                    margin: 0,
                  }}
                >
                  {selectedPhoto.caption}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginLeft: '1.5rem',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
