'use client';

import React, { useRef, useState } from 'react';
import { Plus, Trash2, Check, X, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import { ImageCropperModal } from './ImageCropperModal';
import {
  MAX_GRID_PHOTOS,
  MIN_GRID_PHOTOS,
  clampGridCount,
  gridLayout,
  ratioCss,
} from '@/lib/photo-grid';

export interface GridPhotoItem {
  id: string;
  url: string;
  alt: string;
  tag: string;
  caption: string;
}

interface ProductGridBuilderProps {
  initialPhotos?: GridPhotoItem[];
  productName?: string;
  onSave: (photos: GridPhotoItem[]) => void;
  onCancel: () => void;
}

/** A slot remembers the shape its photo was cropped to, so we know when a layout change makes it invalid. */
interface Slot {
  id: string;
  url: string;
  alt: string;
  caption: string;
  ratio: string;
}

const newId = () => `grid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/** Small picture of a layout, drawn from the same data the website uses. */
const MiniGrid: React.FC<{ count: number; active: boolean }> = ({ count, active }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', backgroundColor: '#fff', border: active ? '1px solid #111827' : '1px solid #d1d5db' }}>
    {gridLayout(count).map((s, i) => (
      <div
        key={i}
        style={{
          width: `${(s.span / 12) * 100}%`,
          aspectRatio: ratioCss(s.ratio),
          backgroundColor: active ? '#111827' : '#9ca3af',
          border: '1px solid #fff',
          boxSizing: 'border-box',
        }}
      />
    ))}
  </div>
);

export const ProductGridBuilder: React.FC<ProductGridBuilderProps> = ({
  initialPhotos = [],
  productName = 'Product',
  onSave,
  onCancel,
}) => {
  const initialCount = clampGridCount(initialPhotos.length > 0 ? initialPhotos.length : 5);

  const [count, setCount] = useState(initialCount);
  const [slots, setSlots] = useState<Slot[]>(() => {
    const layout = gridLayout(initialCount);
    return Array.from({ length: initialCount }, (_, i) => ({
      id: initialPhotos[i]?.id || newId(),
      url: initialPhotos[i]?.url || '',
      alt: initialPhotos[i]?.alt || '',
      caption: initialPhotos[i]?.caption || '',
      ratio: layout[i].ratio,
    }));
  });

  const [notice, setNotice] = useState<{ tone: 'info' | 'error'; text: string } | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState<{ index: number; file: File } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const pickIndex = useRef<number>(0);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const layout = gridLayout(count);
  const filled = slots.filter((s) => s.url);
  const missing = slots.map((s, i) => (s.url ? -1 : i)).filter((i) => i >= 0);

  /** Build the slots for a new photo count; photos whose slot shape changed must be re-added. */
  const buildSlotsFor = (source: Slot[], newCount: number): { next: Slot[]; lost: number } => {
    const newLayout = gridLayout(newCount);
    let lost = 0;
    const next = Array.from({ length: newCount }, (_, i) => {
      const old = source[i];
      if (old && old.url && old.ratio === newLayout[i].ratio) return old;
      if (old && old.url) lost += 1;
      return { id: old?.id || newId(), url: '', alt: '', caption: '', ratio: newLayout[i].ratio };
    });
    return { next, lost };
  };

  const lostIfChangedTo = (newCount: number) => buildSlotsFor(slots, newCount).lost;

  const applyCount = (newCount: number, base: Slot[] = slots) => {
    const { next, lost } = buildSlotsFor(base, newCount);
    setSlots(next);
    setCount(newCount);
    setPendingCount(null);
    setShowIncomplete(false);
    setNotice({
      tone: 'info',
      text:
        lost > 0
          ? `Grid changed to ${newCount} photos. ${lost} photo${lost > 1 ? 's' : ''} had a different shape, so ${lost > 1 ? 'they were' : 'it was'} removed. Please add ${lost > 1 ? 'them' : 'it'} again.`
          : `Grid changed to ${newCount} photos.`,
    });
  };

  const requestCount = (newCount: number) => {
    if (newCount === count) return;
    if (lostIfChangedTo(newCount) > 0) setPendingCount(newCount);
    else applyCount(newCount);
  };

  const pickFile = (index: number) => {
    pickIndex.current = index;
    fileInput.current?.click();
  };

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNotice({ tone: 'error', text: 'Please choose an image file (JPG, PNG or WebP).' });
      return;
    }
    setNotice(null);
    setCrop({ index: pickIndex.current, file });
  };

  const onCropped = async (index: number, result: { blob: Blob; filename: string }) => {
    setUploadingIndex(index);
    try {
      const fd = new FormData();
      fd.append('files', new File([result.blob], result.filename, { type: 'image/webp' }));
      fd.append('quality', '85');
      fd.append('maxWidth', '2048');
      const res = await fetch('/api/admin/compress', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      const url = data?.files?.[0]?.url;
      if (!res.ok || !data?.success || !url) {
        throw new Error(data?.message || data?.error || 'Upload failed.');
      }
      setSlots((prev) =>
        prev.map((s, i) =>
          i === index ? { ...s, url, ratio: layout[index].ratio, alt: s.alt || `${productName} view ${index + 1}` } : s
        )
      );
      setNotice(null);
    } catch (err) {
      setNotice({ tone: 'error', text: err instanceof Error ? err.message : 'Upload failed. Please try again.' });
    } finally {
      setUploadingIndex(null);
    }
  };

  const clearSlot = (index: number) =>
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, url: '', alt: '', caption: '' } : s)));

  const patchSlot = (index: number, patch: Partial<Slot>) =>
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const finish = (list: Slot[]) =>
    onSave(
      list
        .filter((s) => s.url)
        .map((s, i) => ({
          id: s.id,
          url: s.url,
          alt: s.alt || `${productName} view ${i + 1}`,
          tag: `0${i + 1} / PERSPECTIVE`,
          caption: s.caption,
        }))
    );

  const handleSave = () => {
    if (missing.length > 0 && filled.length > 0) {
      setShowIncomplete(true);
      return;
    }
    finish(slots);
  };

  /** "Use a smaller grid": switch to the number of photos actually added. */
  const useSmallerGrid = () => {
    const target = clampGridCount(filled.length);
    const compact = slots.filter((s) => s.url);
    applyCount(target, compact);
  };

  const addMissing = () => {
    setShowIncomplete(false);
    const first = missing[0];
    slotRefs.current[first]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setNotice({
      tone: 'info',
      text: `Add ${missing.length} more photo${missing.length > 1 ? 's' : ''} in the empty box${missing.length > 1 ? 'es' : ''} marked “Add photo”.`,
    });
  };

  const btn = (primary = false): React.CSSProperties => ({
    padding: '0.55rem 1.1rem',
    borderRadius: 6,
    border: primary ? 'none' : '1px solid #d1d5db',
    backgroundColor: primary ? '#111827' : '#fff',
    color: primary ? '#fff' : '#374151',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  });

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fafafa', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', color: '#6b7280', textTransform: 'uppercase' }}>Product page photos</span>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#111827' }}>Photo grid for {productName}</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={onCancel} style={btn()}>
            <X size={15} /> Cancel
          </button>
          <button type="button" onClick={handleSave} style={btn(true)}>
            <Check size={15} /> Save photos
          </button>
        </div>
      </div>

      <div style={{ padding: 'clamp(1rem, 2.5vw, 1.75rem)' }}>
        {/* Step 1: how many photos */}
        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', color: '#111827' }}>1. How many photos do you want to show?</h4>
        <p style={{ margin: '0 0 0.9rem', fontSize: '0.8125rem', color: '#6b7280' }}>
          Pick a number. The layout below is exactly how it will look on the website.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {Array.from({ length: MAX_GRID_PHOTOS - MIN_GRID_PHOTOS + 1 }, (_, i) => i + MIN_GRID_PHOTOS).map((n) => {
            const active = n === count;
            return (
              <button
                key={n}
                type="button"
                onClick={() => requestCount(n)}
                aria-pressed={active}
                style={{
                  padding: '0.6rem',
                  borderRadius: 8,
                  border: active ? '2px solid #111827' : '1px solid #e5e7eb',
                  backgroundColor: active ? '#f9fafb' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <MiniGrid count={n} active={active} />
                <span style={{ display: 'block', marginTop: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                  {n} photo{n > 1 ? 's' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {pendingCount !== null && (
          <div role="alertdialog" style={{ border: '1px solid #fcd34d', backgroundColor: '#fffbeb', borderRadius: 8, padding: '1rem', marginBottom: '1.25rem' }}>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: '#78350f', lineHeight: 1.5 }}>
              <AlertTriangle size={15} style={{ verticalAlign: '-2px', marginRight: 6 }} />
              Changing to a <strong>{pendingCount}-photo grid</strong> changes the shape of some boxes. {lostIfChangedTo(pendingCount)} photo(s) you already
              added will be removed, and you will need to add them again in the new shape.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button type="button" style={btn(true)} onClick={() => applyCount(pendingCount)}>
                Yes, change to {pendingCount} photos
              </button>
              <button type="button" style={btn()} onClick={() => setPendingCount(null)}>
                Keep my {count}-photo grid
              </button>
            </div>
          </div>
        )}

        {/* Step 2: the grid */}
        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', color: '#111827' }}>2. Add a photo in each box</h4>
        <p style={{ margin: '0 0 0.9rem', fontSize: '0.8125rem', color: '#6b7280' }}>
          Each box has its own fixed shape (shown on the box). When you add a photo you will crop it to that exact shape, so it never looks stretched or zoomed.
        </p>

        {notice && (
          <div
            role={notice.tone === 'error' ? 'alert' : 'status'}
            style={{
              marginBottom: '0.9rem',
              padding: '0.7rem 0.9rem',
              borderRadius: 6,
              fontSize: '0.8125rem',
              backgroundColor: notice.tone === 'error' ? '#fef2f2' : '#eff6ff',
              border: `1px solid ${notice.tone === 'error' ? '#fecaca' : '#bfdbfe'}`,
              color: notice.tone === 'error' ? '#991b1b' : '#1e3a8a',
            }}
          >
            {notice.text}
          </div>
        )}

        <input ref={fileInput} type="file" accept="image/*" onChange={onFilePicked} style={{ display: 'none' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', backgroundColor: '#0A0A09', borderRadius: 4, overflow: 'hidden' }}>
          {slots.map((slot, i) => {
            const spec = layout[i];
            const uploading = uploadingIndex === i;
            return (
              <div
                key={slot.id}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                className="grid-builder-slot"
                style={{
                  gridColumn: `span ${spec.span}`,
                  aspectRatio: ratioCss(spec.ratio),
                  position: 'relative',
                  backgroundColor: slot.url ? '#151514' : '#f3f4f6',
                  border: slot.url ? 'none' : '1px dashed #9ca3af',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                {slot.url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slot.url} alt={slot.alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', left: 8, top: 8, backgroundColor: 'rgba(0,0,0,.65)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 3 }}>
                      Photo {i + 1}
                    </div>
                    <div style={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 6 }}>
                      <button type="button" onClick={() => pickFile(i)} aria-label={`Replace photo ${i + 1}`} style={{ ...btn(), padding: '0.35rem 0.6rem', fontSize: 12 }}>
                        <RefreshCw size={13} /> Replace
                      </button>
                      <button type="button" onClick={() => clearSlot(i)} aria-label={`Remove photo ${i + 1}`} style={{ ...btn(), padding: '0.35rem 0.6rem', fontSize: 12, color: '#b91c1c' }}>
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => pickFile(i)}
                    disabled={uploading}
                    aria-label={`Add photo ${i + 1}`}
                    style={{ position: 'absolute', inset: 0, width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                  >
                    {uploading ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={24} />}
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{uploading ? 'Uploading…' : 'Add photo'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Box {i + 1} · shape {spec.ratio}</span>
                  </button>
                )}
                {uploading && slot.url && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Uploading…</div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8125rem', color: '#4b5563' }}>
          {filled.length} of {count} photos added.
          {missing.length > 0 ? ` ${missing.length} box${missing.length > 1 ? 'es are' : ' is'} still empty.` : ' Grid is complete.'}
        </p>

        {/* Step 3: optional text */}
        {filled.length > 0 && (
          <div style={{ marginTop: '1.75rem' }}>
            <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', color: '#111827' }}>3. Photo text (optional)</h4>
            <p style={{ margin: '0 0 0.9rem', fontSize: '0.8125rem', color: '#6b7280' }}>
              The caption shows on the photo. The description helps Google and people using screen readers.
            </p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {slots.map((s, i) =>
                s.url ? (
                  <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '0.75rem', alignItems: 'start', padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: 6 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.url} alt="" style={{ width: 64, aspectRatio: ratioCss(s.ratio), objectFit: 'cover', borderRadius: 3 }} />
                    <div style={{ display: 'grid', gap: '0.4rem' }}>
                      <input
                        value={s.caption}
                        onChange={(e) => patchSlot(i, { caption: e.target.value })}
                        placeholder={`Photo ${i + 1} caption (shown on the photo)`}
                        maxLength={160}
                        aria-label={`Caption for photo ${i + 1}`}
                        style={{ padding: '0.45rem 0.6rem', border: '1px solid #d1d5db', borderRadius: 4, fontSize: '0.8125rem' }}
                      />
                      <input
                        value={s.alt}
                        onChange={(e) => patchSlot(i, { alt: e.target.value })}
                        placeholder="Short description of the photo"
                        maxLength={160}
                        aria-label={`Description for photo ${i + 1}`}
                        style={{ padding: '0.45rem 0.6rem', border: '1px solid #d1d5db', borderRadius: 4, fontSize: '0.8125rem' }}
                      />
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>

      {/* "You picked N but added fewer" dialog */}
      {showIncomplete && (
        <div role="alertdialog" aria-modal="true" className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: 520 }}>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.6rem', fontSize: '1.1rem', color: '#111827' }}>
                <AlertTriangle size={18} style={{ verticalAlign: '-3px', marginRight: 6, color: '#d97706' }} />
                Your grid is not complete
              </h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#374151', lineHeight: 1.6 }}>
                You selected a grid of <strong>{count} photos</strong> but added only <strong>{filled.length}</strong>. We will not fill the empty
                {missing.length > 1 ? ' boxes' : ' box'} with random pictures. What would you like to do?
              </p>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                <button type="button" onClick={addMissing} style={{ ...btn(true), justifyContent: 'center' }}>
                  Add the missing {missing.length} photo{missing.length > 1 ? 's' : ''}
                </button>
                <button type="button" onClick={useSmallerGrid} style={{ ...btn(), justifyContent: 'center' }}>
                  Use a {filled.length}-photo grid instead
                </button>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>
                  A {filled.length}-photo grid has different box shapes, so photos that no longer fit will be removed and you will add them again.
                </p>
                <button type="button" onClick={() => setShowIncomplete(false)} style={{ ...btn(), justifyContent: 'center', border: 'none', color: '#6b7280' }}>
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed-ratio cropper for the chosen box */}
      {crop && (
        <ImageCropperModal
          isOpen
          imageUrl={null}
          imageFile={crop.file}
          aspectRatioPreset={layout[crop.index].ratio}
          purpose={`Photo ${crop.index + 1} of ${count} in the grid`}
          title="Crop photo to fit the box"
          onClose={() => setCrop(null)}
          onCropComplete={(r) => onCropped(crop.index, r)}
        />
      )}
    </div>
  );
};
