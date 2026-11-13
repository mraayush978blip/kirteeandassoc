'use client';

import React, { useRef, useState } from 'react';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { ImageCropperModal } from './ImageCropperModal';
import { ratioCss } from '@/lib/photo-grid';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Exact shape the website shows this photo in, e.g. "16:11". The admin crops to it. */
  ratio: string;
  hint?: string;
}

/**
 * Non-technical image picker: preview, "Upload photo" (crop to the exact shape, then stored),
 * and a collapsed "paste a link instead" option.
 */
export const ImageField: React.FC<ImageFieldProps> = ({ label, value, onChange, ratio, hint }) => {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG or WebP).');
      return;
    }
    setError('');
    setFile(f);
  };

  const upload = async (r: { blob: Blob; filename: string }) => {
    setBusy(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('files', new File([r.blob], r.filename, { type: 'image/webp' }));
      fd.append('quality', '85');
      fd.append('maxWidth', '2048');
      const res = await fetch('/api/admin/compress', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      const url = data?.files?.[0]?.url;
      if (!res.ok || !data?.success || !url) throw new Error(data?.message || data?.error || 'Upload failed.');
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const small: React.CSSProperties = {
    padding: '0.45rem 0.85rem',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    color: '#374151',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>{label}</label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div
          style={{
            width: 'min(260px, 100%)',
            aspectRatio: ratioCss(ratio),
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            backgroundColor: '#f3f4f6',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.75rem', textAlign: 'center', padding: 8 }}>
              No photo yet
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gap: '0.5rem', minWidth: 160 }}>
          <input ref={input} type="file" accept="image/*" onChange={onPick} style={{ display: 'none' }} />
          <button type="button" onClick={() => input.current?.click()} disabled={busy} style={{ ...small, backgroundColor: '#111827', color: '#fff', border: 'none' }}>
            {busy ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
            {busy ? 'Uploading…' : value ? 'Change photo' : 'Upload photo'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} style={{ ...small, color: '#b91c1c' }}>
              <Trash2 size={14} /> Remove photo
            </button>
          )}
          <span style={{ fontSize: '0.75rem', color: '#6b7280', maxWidth: 260, lineHeight: 1.4 }}>
            {hint || `Shown in a ${ratio} shape. You will crop to it after choosing a photo.`}
          </span>
        </div>
      </div>
      <details style={{ marginTop: '0.6rem' }}>
        <summary style={{ fontSize: '0.75rem', color: '#6b7280', cursor: 'pointer' }}>Or paste a photo link instead</summary>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          style={{ width: '100%', marginTop: '0.4rem', padding: '0.5rem', borderRadius: 4, border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
        />
      </details>
      {error && (
        <p role="alert" style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: '#b91c1c' }}>
          {error}
        </p>
      )}
      {file && (
        <ImageCropperModal
          isOpen
          imageUrl={null}
          imageFile={file}
          aspectRatioPreset={ratio}
          purpose={label}
          onClose={() => setFile(null)}
          onCropComplete={upload}
        />
      )}
    </div>
  );
};
