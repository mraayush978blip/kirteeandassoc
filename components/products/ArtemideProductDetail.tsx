'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, ProductSpecification } from '@/types/product';
import { ChevronLeft, ChevronRight, Download, X, Share2, Check } from 'lucide-react';
import { FacebookIcon, XTwitterIcon, LinkedinIcon } from '@/components/ui/Icons';

export interface ArtemideProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export const ArtemideProductDetail: React.FC<ArtemideProductDetailProps> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter();
  const allImages = [product.heroImage, ...(product.gallery || [])].filter(Boolean);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${product.name} by ZENVORA Architectural Collection`);

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleDownloadBrochure = () => {
    const download = product.downloads?.[0];
    if (download && download.fileUrl && download.fileUrl !== '#') {
      window.open(download.fileUrl, '_blank');
    } else {
      // Create a virtual spec sheet download or alert
      alert(`Downloading ${product.name} Technical Brochure & Photometric Package...`);
    }
  };

  const parentCategoryRoute = product.catalogType === 'wet' ? '/wet-goods' : '/dry-goods';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        paddingTop: 'calc(var(--header-height) + 1.5rem)',
        paddingBottom: '6rem',
      }}
    >
      <div className="container">
        {/* Close / Return Button (Page 3 top right: "X") */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => router.push(parentCategoryRoute)}
            aria-label="Back to collection"
            style={{
              background: 'none',
              border: '1px solid #e5e7eb',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#111111',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#111111';
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Hero Luminaire Image Carousel (Artemide Product Inner Page) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(420px, 65vh, 680px)',
            backgroundColor: '#0a0a0a',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '3rem',
          }}
        >
          {allImages.length > 0 && (
            <Image
              src={allImages[currentImageIndex].url}
              alt={allImages[currentImageIndex].alt || product.name}
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: 'cover',
                transition: 'opacity 0.4s ease',
              }}
            />
          )}

          {/* Carousel Left Arrow */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                left: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                color: '#111111',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)')}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Carousel Right Arrow */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              style={{
                position: 'absolute',
                right: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                color: '#111111',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)')}
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Pagination Indicators */}
          {allImages.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{
                    width: idx === currentImageIndex ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    backgroundColor: idx === currentImageIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title, Actions Row & Socials (Page 3 Artemide Reference) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '1.75rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#111111',
                lineHeight: 1.1,
              }}
            >
              {product.name}
            </h1>
            {product.designer && (
              <p
                style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  marginTop: '0.25rem',
                  fontWeight: 400,
                }}
              >
                Design by {product.designer}
              </p>
            )}
          </div>

          {/* Action Row: Download Brochure & Social Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDownloadBrochure}
              className="btn btn-pill"
              style={{
                backgroundColor: 'transparent',
                color: '#111111',
                border: '1px solid #111111',
                padding: '0.625rem 1.5rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#111111';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#111111';
              }}
            >
              <span>Download Brochure</span>
              <Download size={15} />
            </button>

            {/* Social Share Icons: Facebook, X, LinkedIn */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleShare('facebook')}
                aria-label="Share on Facebook"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #e5e7eb',
                  background: 'none',
                  color: '#111111',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#111111')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <FacebookIcon size={16} />
              </button>

              <button
                type="button"
                onClick={() => handleShare('twitter')}
                aria-label="Share on X"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #e5e7eb',
                  background: 'none',
                  color: '#111111',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#111111')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <XTwitterIcon size={15} />
              </button>

              <button
                type="button"
                onClick={() => handleShare('linkedin')}
                aria-label="Share on LinkedIn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #e5e7eb',
                  background: 'none',
                  color: '#111111',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#111111')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <LinkedinIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Story / Narrative (Exact layout & copy from PDF Page 3) */}
        <div style={{ maxWidth: '880px', marginBottom: '4.5rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.0625rem',
              lineHeight: 1.85,
              color: '#374151',
              fontWeight: 400,
            }}
          >
            {product.editorialStory || product.fullDescription}
          </p>
        </div>

        {/* Technical Specifications Matrix */}
        {product.specifications && product.specifications.length > 0 && (
          <div
            style={{
              marginBottom: '5rem',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '3rem',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: '#111111',
                marginBottom: '1.75rem',
              }}
            >
              Technical Specifications
            </h2>

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
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#fafafa',
                    borderRadius: '4px',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: '#6b7280',
                      letterSpacing: '0.06em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {spec.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#111111',
                    }}
                  >
                    {spec.value} {spec.unit && spec.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Mosaic Section (Page 3 Bottom Reference: A.39, ALE.01, A.24) */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div
            style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '4rem',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#111111',
                marginBottom: '2rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Related Luminaire Families
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '1.5rem',
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
                      height: '320px',
                      overflow: 'hidden',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      textDecoration: 'none',
                    }}
                    className="mosaic-item"
                  >
                    <Image
                      src={rel.heroImage.url}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                      className="mosaic-img"
                    />

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(8px)',
                          padding: '0.35rem 0.75rem',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#111111',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
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
        )}
      </div>
    </div>
  );
};
