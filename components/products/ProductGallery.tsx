'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/product';
import { Maximize2, X } from 'lucide-react';

export interface ProductGalleryProps {
  heroImage: ProductImage;
  gallery: ProductImage[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ heroImage, gallery }) => {
  const allImages = [heroImage, ...gallery.filter((g) => g.url !== heroImage.url)];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = allImages[activeImageIndex] || heroImage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Main Feature Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/11',
          backgroundColor: '#353943',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xs)',
          overflow: 'hidden',
        }}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          style={{ objectFit: 'cover' }}
        />

        {/* Lightbox Trigger Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Enlarge luminaire image"
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(10, 11, 13, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          <Maximize2 size={14} />
          <span>Inspect</span>
        </button>

        {activeImage.caption && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(10, 11, 13, 0.8)',
              backdropFilter: 'blur(4px)',
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            {activeImage.caption}
          </div>
        )}
      </div>

      {/* Thumbnails row */}
      {allImages.length > 1 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(allImages.length, 5)}, 1fr)`,
            gap: '0.75rem',
          }}
        >
          {allImages.map((img, idx) => {
            const isSelected = idx === activeImageIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
                style={{
                  position: 'relative',
                  aspectRatio: '16/10',
                  backgroundColor: '#353943',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0,
                  opacity: isSelected ? 1 : 0.65,
                  transition: 'opacity var(--transition-fast), border-color var(--transition-fast)',
                }}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged Luminaire Image View"
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(5, 6, 8, 0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close enlarged view"
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '0.625rem',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '1200px',
              width: '100%',
              maxHeight: '85vh',
              aspectRatio: '16/10',
            }}
          >
            <Image
              src={activeImage.url}
              alt={activeImage.alt}
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
};
