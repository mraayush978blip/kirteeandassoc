'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Crop, RotateCw, ZoomIn, ZoomOut, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageFile?: File | null;
  aspectRatioPreset?: '16:9' | '4:3' | '1:1' | '3:2' | 'free';
  title?: string;
  onCropComplete: (result: { blob: Blob; dataUrl: string; width: number; height: number; filename: string }) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageFile,
  aspectRatioPreset = '16:9',
  title = 'Crop & Optimize Photo',
  onCropComplete,
}) => {
  const [selectedAspect, setSelectedAspect] = useState<'16:9' | '4:3' | '1:1' | '3:2' | 'free'>(aspectRatioPreset);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (imageUrl) {
      setPreviewSrc(imageUrl);
    } else if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewSrc(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageUrl, imageFile]);

  useEffect(() => {
    setSelectedAspect(aspectRatioPreset);
  }, [aspectRatioPreset]);

  if (!isOpen || !previewSrc) return null;

  const handleApply = async () => {
    if (!imgRef.current) return;
    setIsProcessing(true);

    try {
      const img = imgRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Calculate target dimensions based on selected aspect ratio
      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;

      if (selectedAspect === '16:9') {
        const aspect = 16 / 9;
        if (targetWidth / targetHeight > aspect) {
          targetWidth = targetHeight * aspect;
        } else {
          targetHeight = targetWidth / aspect;
        }
      } else if (selectedAspect === '4:3') {
        const aspect = 4 / 3;
        if (targetWidth / targetHeight > aspect) {
          targetWidth = targetHeight * aspect;
        } else {
          targetHeight = targetWidth / aspect;
        }
      } else if (selectedAspect === '1:1') {
        const min = Math.min(targetWidth, targetHeight);
        targetWidth = min;
        targetHeight = min;
      } else if (selectedAspect === '3:2') {
        const aspect = 3 / 2;
        if (targetWidth / targetHeight > aspect) {
          targetWidth = targetHeight * aspect;
        } else {
          targetHeight = targetWidth / aspect;
        }
      }

      // Max dimension cap for fast delivery and memory safety
      const maxDim = 2048;
      let outWidth = Math.min(targetWidth, maxDim);
      let outHeight = Math.min(targetHeight, maxDim);

      canvas.width = outWidth;
      canvas.height = outHeight;

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Source center crop offsets
      const sx = (img.naturalWidth - targetWidth) / 2;
      const sy = (img.naturalHeight - targetHeight) / 2;

      ctx.drawImage(img, sx, sy, targetWidth, targetHeight, 0, 0, outWidth, outHeight);
      ctx.restore();

      // Convert directly to high-fidelity WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/webp', 0.88);
            const baseName = (imageFile?.name || 'photo').replace(/\.[^/.]+$/, '');
            onCropComplete({
              blob,
              dataUrl,
              width: outWidth,
              height: outHeight,
              filename: `${baseName}.webp`,
            });
            setIsProcessing(false);
            onClose();
          }
        },
        'image/webp',
        0.88
      );
    } catch (err) {
      console.error('Crop export failed', err);
      setIsProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="admin-modal-overlay"
    >
      <div
        className="admin-modal-container"
        style={{
          maxWidth: '720px',
        }}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Crop size={18} style={{ color: '#111827' }} />
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111827',
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewport & Controls */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {/* Aspect Ratio Buttons */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#4b5563',
                marginBottom: '0.5rem',
              }}
            >
              Standard Proportions
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['16:9', '4:3', '1:1', '3:2', 'free'] as const).map((aspect) => (
                <button
                  key={aspect}
                  type="button"
                  onClick={() => setSelectedAspect(aspect)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '4px',
                    border: selectedAspect === aspect ? '1.5px solid #111827' : '1px solid #d1d5db',
                    backgroundColor: selectedAspect === aspect ? '#111827' : '#ffffff',
                    color: selectedAspect === aspect ? '#ffffff' : '#374151',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {aspect === 'free' ? 'Original Ratio' : aspect}
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview Box */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '340px',
              backgroundColor: '#111827',
              borderRadius: '6px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={previewSrc}
              alt="Crop target preview"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.1s ease',
              }}
            />

            {/* Visual Crop Guideline Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: '16px',
                border: '1.5px dashed rgba(255, 255, 255, 0.45)',
                borderRadius: '4px',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Quick Zoom & Rotation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              padding: '0.5rem 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                <ZoomOut size={14} /> Zoom -
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                <ZoomIn size={14} /> Zoom +
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.75rem' }}>
              <Sparkles size={14} />
              <span>Auto-optimizes to High-Res WebP</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isProcessing}
            style={{
              padding: '0.55rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#111827',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: isProcessing ? 'wait' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
            }}
          >
            {isProcessing ? 'Optimizing...' : (
              <>
                <Check size={15} /> Apply &amp; Optimize
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
