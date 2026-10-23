'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductSpecification } from '@/types/product';
import { ChevronLeft, ChevronRight, Download, Share2, Check, SlidersHorizontal, X } from 'lucide-react';
import { FacebookIcon, XTwitterIcon, LinkedinIcon } from '@/components/ui/Icons';

export interface ArtemideProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export const ArtemideProductDetail: React.FC<ArtemideProductDetailProps> = ({
  product,
  relatedProducts,
}) => {
  const allImages = [product.heroImage, ...(product.gallery || [])].filter(Boolean);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isSpecsDrawerOpen, setIsSpecsDrawerOpen] = useState(false);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${product.name} by ZENVORA Architectural Collection`);

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

  // Curated Mosaic Luminaires matching Image 1 mockup
  const mosaicItems = [
    {
      id: 'a24',
      title: '↳ A.24',
      slug: 'a-24-system',
      category: 'DRY GOODS',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
      alt: 'A.24 continuous linear profile grazing architectural wall and ceiling',
    },
    {
      id: 'a39',
      title: 'A.39',
      slug: 'a-39-system',
      category: 'DRY GOODS',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      alt: 'A.39 continuous linear architectural luminaire profile',
    },
    {
      id: 'curved',
      title: 'A.24 Curvilinear',
      slug: 'a-24-system',
      category: 'DRY GOODS',
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85',
      alt: 'Curvilinear organic architectural light ribbon',
    },
    {
      id: 'ale01',
      title: 'ALE.01',
      slug: 'ale-01',
      category: 'DRY GOODS',
      image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85',
      alt: 'ALE.01 suspended sound-absorbing luminaire shell',
    },
    {
      id: 'honeycomb',
      title: 'Calipso Vertical',
      slug: 'calipso',
      category: 'DRY GOODS',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85',
      alt: 'Calipso honeycomb acoustic architectural pendant',
    },
  ];

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
      {/* 2. TITLE & EDITORIAL STORY (Exact Layout from Mockup) */}
      {/* ========================================================= */}
      <section
        style={{
          paddingTop: 'clamp(3rem, 5.5vw, 5rem)',
          paddingBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
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
            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-4">
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

            {/* Right Column: Actions Row + Narrative + Spec Toggle */}
            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-8">
              {/* Top Row: Download Brochure Pill & Social Icons */}
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
                <button
                  type="button"
                  onClick={handleDownloadBrochure}
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
                  <span>Download Brochure</span>
                  <Download size={13} strokeWidth={2} />
                </button>

                {/* Social Share Round Icons: Facebook, X, LinkedIn */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <button
                    type="button"
                    onClick={() => handleShare('facebook')}
                    aria-label="Share on Facebook"
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
                      cursor: 'pointer',
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
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare('twitter')}
                    aria-label="Share on X"
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
                      cursor: 'pointer',
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
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare('linkedin')}
                    aria-label="Share on LinkedIn"
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
                      cursor: 'pointer',
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
                  </button>
                </div>
              </div>

              {/* Editorial Narrative Text */}
              <div style={{ position: 'relative', paddingBottom: '3.5rem' }}>
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

                {/* Bottom Right Corner: Spec Sheet Toggle [ ⊠ ] */}
                <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <button
                    type="button"
                    onClick={() => setIsSpecsDrawerOpen((prev) => !prev)}
                    title="Toggle Technical Specifications & Photometric Data"
                    aria-label="Technical Specifications"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '2px',
                      border: '1px solid #9ca3af',
                      backgroundColor: isSpecsDrawerOpen ? '#111827' : '#ffffff',
                      color: isSpecsDrawerOpen ? '#ffffff' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSpecsDrawerOpen) {
                        e.currentTarget.style.borderColor = '#111827';
                        e.currentTarget.style.color = '#111827';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSpecsDrawerOpen) {
                        e.currentTarget.style.borderColor = '#9ca3af';
                        e.currentTarget.style.color = '#374151';
                      }
                    }}
                  >
                    {isSpecsDrawerOpen ? (
                      <X size={16} />
                    ) : (
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
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Sheet (Expanded on [ ⊠ ] Click) */}
          {isSpecsDrawerOpen && product.specifications && product.specifications.length > 0 && (
            <div
              style={{
                marginTop: '3rem',
                paddingTop: '2.5rem',
                borderTop: '1px solid #302F2B',
                backgroundColor: '#151514',
                color: '#E9E6DE',
                borderRadius: '4px',
                padding: '2rem',
                boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                border: '1px solid #302F2B',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#C8C2B7', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    ENGINEERING &amp; PHOTOMETRIC MATRIX
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.35rem', fontWeight: 600, color: '#E9E6DE', margin: '0.25rem 0 0 0' }}>
                    Technical Specifications
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSpecsDrawerOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#96938C', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1rem',
                }}
              >
                {product.specifications.map((spec: ProductSpecification) => (
                  <div
                    key={spec.id}
                    style={{
                      padding: '1.15rem',
                      border: '1px solid #302F2B',
                      backgroundColor: '#22211E',
                      borderRadius: '3px',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: '#96938C',
                        letterSpacing: '0.08em',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {spec.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#E9E6DE',
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
      {/* 3. ARCHITECTURAL MOSAIC GRID (Exact Layout from Mockup) */}
      {/* ========================================================= */}
      <section
        id="related-mosaic"
        aria-label="Related Architectural Luminaires"
        style={{
          backgroundColor: '#0A0A09',
          borderTop: '1px solid #302F2B',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2px',
            backgroundColor: '#302F2B',
          }}
        >
          {/* Card 1: Left Tall Column (↳ A.24) */}
          <Link
            href="/products/a-24-system"
            style={{
              gridColumn: 'span 12',
              position: 'relative',
              minHeight: 'clamp(460px, 60vh, 620px)',
              overflow: 'hidden',
              backgroundColor: '#151514',
              textDecoration: 'none',
              display: 'block',
            }}
            className="lg:col-span-6 group"
          >
            <Image
              src={mosaicItems[0].image}
              alt={mosaicItems[0].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="group-hover:scale-105"
            />
            {/* Subtle Vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 60%, rgba(10, 10, 9, 0.85) 100%)',
              }}
            />
            {/* Bottom Left Label: ↳ A.24 */}
            <div
              style={{
                position: 'absolute',
                bottom: 'clamp(1.5rem, 3vw, 2.5rem)',
                left: 'clamp(1.5rem, 3vw, 2.5rem)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#E9E6DE',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span>{mosaicItems[0].title}</span>
            </div>
          </Link>

          {/* Column 2: Center Stacked Cards (DRY GOODS, A.39, Curvilinear) */}
          <div
            style={{
              gridColumn: 'span 12',
              display: 'grid',
              gridTemplateRows: 'auto 1fr 1fr',
              gap: '2px',
              backgroundColor: '#302F2B',
            }}
            className="lg:col-span-3"
          >
            {/* Top Bar: DRY GOODS overline badge */}
            <div
              style={{
                backgroundColor: '#151514',
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Link
                href="/dry-goods"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#96938C',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E9E6DE')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#96938C')}
              >
                DRY GOODS
              </Link>
            </div>

            {/* Middle Card: A.39 linear luminaire */}
            <Link
              href="/products/a-39-system"
              style={{
                position: 'relative',
                minHeight: '260px',
                overflow: 'hidden',
                backgroundColor: '#151514',
                textDecoration: 'none',
                display: 'block',
              }}
              className="group"
            >
              <Image
                src={mosaicItems[1].image}
                alt={mosaicItems[1].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group-hover:scale-105"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(10, 10, 9, 0.75) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  color: '#E9E6DE',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {mosaicItems[1].title}
              </div>
            </Link>

            {/* Bottom Card: Curvilinear light sculpture */}
            <Link
              href="/products/a-24-system"
              style={{
                position: 'relative',
                minHeight: '260px',
                overflow: 'hidden',
                backgroundColor: '#151514',
                textDecoration: 'none',
                display: 'block',
              }}
              className="group"
            >
              <Image
                src={mosaicItems[2].image}
                alt={mosaicItems[2].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Column 3: Right Stacked Cards (ALE.01, Honeycomb vertical) */}
          <div
            style={{
              gridColumn: 'span 12',
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
              gap: '2px',
              backgroundColor: '#302F2B',
            }}
            className="lg:col-span-3"
          >
            {/* Top Card: ALE.01 */}
            <Link
              href="/products/ale-01"
              style={{
                position: 'relative',
                minHeight: '280px',
                overflow: 'hidden',
                backgroundColor: '#151514',
                textDecoration: 'none',
                display: 'block',
              }}
              className="group"
            >
              <Image
                src={mosaicItems[3].image}
                alt={mosaicItems[3].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group-hover:scale-105"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(10, 10, 9, 0.75) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  color: '#E9E6DE',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {mosaicItems[3].title}
              </div>
            </Link>

            {/* Bottom Card: Honeycomb Vertical Fixture */}
            <Link
              href="/products/calipso"
              style={{
                position: 'relative',
                minHeight: '280px',
                overflow: 'hidden',
                backgroundColor: '#151514',
                textDecoration: 'none',
                display: 'block',
              }}
              className="group"
            >
              <Image
                src={mosaicItems[4].image}
                alt={mosaicItems[4].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group-hover:scale-105"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
