'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, Check, Crop, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { ratioValue } from '@/lib/photo-grid';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageFile?: File | null;
  /** The exact shape the photo must be cropped to, e.g. "16:9". The admin cannot change it. */
  aspectRatioPreset?: string;
  /** Plain-language hint shown to the admin, e.g. "Top slider photo". */
  purpose?: string;
  title?: string;
  onCropComplete: (result: { blob: Blob; dataUrl: string; width: number; height: number; filename: string }) => void;
}

const MAX_OUTPUT_WIDTH = 2048;
const MAX_ZOOM = 4;

/**
 * Fixed-ratio cropper. The frame shape is decided by the website (never by the admin):
 * the admin only drags the photo to choose which part shows, and zooms if needed.
 * The exported file has EXACTLY the frame's ratio, so the website shows it without zoom/cropping.
 */
export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageFile,
  aspectRatioPreset = '16:9',
  purpose,
  title = 'Crop photo',
  onCropComplete,
}) => {
  const ratioText = /^\d+:\d+$/.test(aspectRatioPreset) ? aspectRatioPreset : '16:9';
  const ratio = ratioValue(ratioText);

  const [src, setSrc] = useState('');
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [frame, setFrame] = useState({ w: 560, h: 315 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  // Source of the photo (existing URL or a file picked by the admin)
  useEffect(() => {
    setNat(null);
    setError('');
    setZoom(1);
    if (imageUrl) {
      setSrc(imageUrl);
    } else if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setSrc(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSrc('');
    }
  }, [imageUrl, imageFile]);

  // Size the frame to the screen while keeping the exact ratio
  useEffect(() => {
    if (!isOpen) return;
    const fit = () => {
      const maxW = Math.min(640, window.innerWidth - 72);
      const maxH = Math.max(180, Math.min(420, window.innerHeight - 360));
      let w = maxW;
      let h = w / ratio;
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
      setFrame({ w: Math.round(w), h: Math.round(h) });
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [isOpen, ratio]);

  const baseScale = nat ? Math.max(frame.w / nat.w, frame.h / nat.h) : 1;
  const scale = baseScale * zoom;

  const clamp = useCallback(
    (o: { x: number; y: number }, z = zoom) => {
      if (!nat) return o;
      const s = Math.max(frame.w / nat.w, frame.h / nat.h) * z;
      return {
        x: Math.min(0, Math.max(frame.w - nat.w * s, o.x)),
        y: Math.min(0, Math.max(frame.h - nat.h * s, o.y)),
      };
    },
    [nat, frame, zoom]
  );

  // Centre the photo whenever the photo or frame size changes
  useEffect(() => {
    if (!nat) return;
    const s = Math.max(frame.w / nat.w, frame.h / nat.h) * zoom;
    setOffset(clamp({ x: (frame.w - nat.w * s) / 2, y: (frame.h - nat.h * s) / 2 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nat, frame.w, frame.h]);

  const changeZoom = (next: number) => {
    const z = Math.min(MAX_ZOOM, Math.max(1, next));
    if (!nat) return setZoom(z);
    // Zoom around the centre of the frame
    const cx = (frame.w / 2 - offset.x) / scale;
    const cy = (frame.h / 2 - offset.y) / scale;
    const s = baseScale * z;
    setZoom(z);
    setOffset(clamp({ x: frame.w / 2 - cx * s, y: frame.h / 2 - cy * s }, z));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    setOffset(clamp({ x: d.ox + (e.clientX - d.px), y: d.oy + (e.clientY - d.py) }));
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  if (!isOpen || !src) return null;

  const handleApply = async () => {
    const img = imgRef.current;
    if (!img || !nat) return;
    setBusy(true);
    setError('');
    try {
      const sw = frame.w / scale;
      const sh = frame.h / scale;
      const sx = -offset.x / scale;
      const sy = -offset.y / scale;

      const outW = Math.round(Math.min(sw, MAX_OUTPUT_WIDTH));
      const outH = Math.round(outW / ratio);
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);

      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.88));
      if (!blob) throw new Error('blob');
      const baseName = (imageFile?.name || 'photo').replace(/\.[^/.]+$/, '');
      onCropComplete({
        blob,
        dataUrl: canvas.toDataURL('image/webp', 0.88),
        width: outW,
        height: outH,
        filename: `${baseName}.webp`,
      });
      onClose();
    } catch {
      setError('Could not crop this photo. Please try a different photo (JPG, PNG or WebP).');
    } finally {
      setBusy(false);
    }
  };

  const crossOrigin = src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('/') ? undefined : 'anonymous';

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="admin-modal-overlay">
      <div className="admin-modal-container" style={{ maxWidth: '720px' }}>
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Crop size={18} style={{ color: '#111827' }} />
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>{title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto' }}>
          <p style={{ margin: '0 0 0.9rem', fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>
            {purpose ? <strong>{purpose}. </strong> : null}
            This spot needs a <strong>{ratioText}</strong> shaped photo. <strong>Drag the photo</strong> to choose what shows inside the frame.
            Use the slider to zoom in if needed.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                position: 'relative',
                width: frame.w,
                height: frame.h,
                overflow: 'hidden',
                backgroundColor: '#111827',
                borderRadius: '6px',
                cursor: dragging ? 'grabbing' : 'grab',
                touchAction: 'none',
                userSelect: 'none',
                outline: '2px solid #111827',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={src}
                alt="Photo being cropped"
                crossOrigin={crossOrigin}
                draggable={false}
                onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                onError={() => setError('This photo could not be opened. Please choose a JPG, PNG or WebP file.')}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: nat ? nat.w * scale : 'auto',
                  height: nat ? nat.h * scale : 'auto',
                  maxWidth: 'none',
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                  pointerEvents: 'none',
                }}
              />
              {/* rule-of-thirds guides */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  backgroundImage:
                    'linear-gradient(to right, transparent 33.2%, rgba(255,255,255,.35) 33.3%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,.35) 66.6%, transparent 66.8%), linear-gradient(to bottom, transparent 33.2%, rgba(255,255,255,.35) 33.3%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,.35) 66.6%, transparent 66.8%)',
                }}
              />
              {!nat && !error && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8125rem' }}>
                  Loading photo…
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1rem', maxWidth: frame.w, marginLeft: 'auto', marginRight: 'auto' }}>
            <button type="button" aria-label="Zoom out" onClick={() => changeZoom(zoom - 0.25)} style={zoomBtn}>
              <ZoomOut size={16} />
            </button>
            <input
              type="range"
              min={1}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(e) => changeZoom(Number(e.target.value))}
              aria-label="Zoom"
              style={{ flex: 1 }}
            />
            <button type="button" aria-label="Zoom in" onClick={() => changeZoom(zoom + 0.25)} style={zoomBtn}>
              <ZoomIn size={16} />
            </button>
          </div>
          <p style={{ margin: '0.6rem 0 0', textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', display: 'flex', gap: '0.35rem', alignItems: 'center', justifyContent: 'center' }}>
            <Move size={13} /> Photo is saved in this exact shape, so the website shows it without stretching or zooming.
          </p>
          {error && (
            <p role="alert" style={{ margin: '0.75rem 0 0', color: '#b91c1c', fontSize: '0.8125rem', textAlign: 'center' }}>
              {error}
            </p>
          )}
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', backgroundColor: '#f9fafb' }}>
          <button type="button" onClick={onClose} style={{ padding: '0.55rem 1.25rem', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={busy || !nat}
            style={{
              padding: '0.55rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#111827',
              color: '#fff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: busy || !nat ? 'not-allowed' : 'pointer',
              opacity: busy || !nat ? 0.6 : 1,
            }}
          >
            <Check size={15} /> {busy ? 'Saving…' : 'Use this crop'}
          </button>
        </div>
      </div>
    </div>
  );
};

const zoomBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  borderRadius: 6,
  border: '1px solid #d1d5db',
  backgroundColor: '#fff',
  cursor: 'pointer',
};
