'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw, Upload, Trash2, Check } from 'lucide-react';
import { BrandConfig, DEFAULT_BRAND } from '@/lib/site-settings-types';
import { BrandMark } from '@/components/layout/BrandMark';

const input: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', background: '#fff',
};
const label: React.CSSProperties = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };
const hint: React.CSSProperties = { fontSize: '0.75rem', color: '#6b7280', margin: '0.3rem 0 0' };

interface Props {
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const BrandPanel: React.FC<Props> = ({ showToast }) => {
  const [brand, setBrand] = useState<BrandConfig>(DEFAULT_BRAND);
  const [saved, setSaved] = useState<BrandConfig>(DEFAULT_BRAND);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/content?key=brand', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setBrand(d.data);
          setSaved(d.data);
        }
      })
      .catch(() => showToast('Could not load the brand settings.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = useMemo(() => JSON.stringify(brand) !== JSON.stringify(saved), [brand, saved]);
  const patch = (p: Partial<BrandConfig>) => setBrand((b) => ({ ...b, ...p }));

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('files', file);
      fd.append('quality', '92');
      fd.append('maxWidth', '800'); // logos never need to be huge
      const res = await fetch('/api/admin/compress', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success || !data.files?.[0]?.url) throw new Error(data.message || 'Upload failed');
      patch({ logoUrl: data.files[0].url });
      showToast('Logo uploaded. Press Save to publish it.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const save = async () => {
    if (!brand.brandName.trim()) return showToast('Brand name cannot be empty.', 'error');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'site_brand', value: brand }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Could not save');
      setSaved(brand);
      showToast('Brand updated. It is live on the whole website.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
        <RefreshCw className="animate-spin" size={22} style={{ margin: '0 auto 0.75rem' }} /> Loading…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px' }}>
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.14em' }}>
        IDENTITY
      </span>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: '0.25rem 0 0.5rem' }}>Brand &amp; Logo</h1>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem' }}>
        Change the business name and logo. It updates the top menu, the footer, page titles on Google and the browser tab, everywhere at once.
      </p>

      {/* Live preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.35rem' }}>PREVIEW: TOP MENU (light pages)</div>
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem 1.25rem', minHeight: '78px', display: 'flex', alignItems: 'center' }}>
            <BrandMark brand={brand} variant="header" light />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.35rem' }}>PREVIEW: TOP MENU (over dark photos)</div>
          <div style={{ background: '#111418', border: '1px solid #1f2937', borderRadius: '8px', padding: '1rem 1.25rem', minHeight: '78px', display: 'flex', alignItems: 'center' }}>
            <BrandMark brand={brand} variant="header" light={false} />
          </div>
        </div>
      </div>

      {/* Name */}
      <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem' }}>1. Business name</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={label} htmlFor="brand-name">Brand name</label>
            <input id="brand-name" style={input} value={brand.brandName} maxLength={80} onChange={(e) => patch({ brandName: e.target.value })} />
            <p style={hint}>Shown in the top menu, footer, copyright line and the browser tab / Google title.</p>
          </div>
          <div>
            <label style={label} htmlFor="brand-tagline">Small line under the name (optional)</label>
            <input id="brand-tagline" style={input} value={brand.tagline} maxLength={60} onChange={(e) => patch({ tagline: e.target.value })} placeholder="e.g. Architectural Lighting" />
            <p style={hint}>Shown under the name in the top menu. Leave empty to hide it.</p>
          </div>
        </div>
      </section>

      {/* Logo */}
      <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>2. Logo (optional)</h2>
        <p style={{ ...hint, margin: '0 0 1rem' }}>
          Without a logo, the brand name is shown as text. Best: a PNG or WebP with a transparent background, at least 400 px wide.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            hidden
            onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: uploading ? 'wait' : 'pointer' }}
          >
            {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
            {brand.logoUrl ? 'Replace logo' : 'Upload logo'}
          </button>
          {brand.logoUrl && (
            <button
              type="button"
              onClick={() => patch({ logoUrl: '', logoAlt: '', showNameWithLogo: false })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Trash2 size={14} /> Remove logo (use name only)
            </button>
          )}
        </div>

        <label style={label} htmlFor="brand-logo-url">…or paste a logo image link</label>
        <input id="brand-logo-url" style={input} value={brand.logoUrl} placeholder="https://… or /media/logo.webp" onChange={(e) => patch({ logoUrl: e.target.value })} />

        {brand.logoUrl && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={label} htmlFor="brand-logo-size">Logo size</label>
              <select id="brand-logo-size" style={input} value={brand.logoSize} onChange={(e) => patch({ logoSize: e.target.value as BrandConfig['logoSize'] })}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label style={label} htmlFor="brand-logo-alt">Describe the logo (for screen readers)</label>
              <input id="brand-logo-alt" style={input} value={brand.logoAlt} maxLength={120} onChange={(e) => patch({ logoAlt: e.target.value })} placeholder={brand.brandName} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#111827', alignSelf: 'end', paddingBottom: '0.6rem' }}>
              <input type="checkbox" checked={brand.showNameWithLogo} onChange={(e) => patch({ showNameWithLogo: e.target.checked })} />
              Also show the name next to the logo
            </label>
          </div>
        )}
      </section>

      <div style={{ position: 'sticky', bottom: 0, marginTop: '1.25rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '0.85rem 0', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.4rem', background: dirty ? '#111827' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: saving || !dirty ? 'not-allowed' : 'pointer' }}
        >
          {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : <><Check size={14} /> Save changes</>}
        </button>
        {dirty && <span style={{ fontSize: '0.8125rem', color: '#b45309' }}>You have unsaved changes</span>}
      </div>
    </div>
  );
};
