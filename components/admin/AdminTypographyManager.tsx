'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, RefreshCw, Undo2, Sparkles } from 'lucide-react';
import { TypographyConfig, DEFAULT_TYPOGRAPHY } from '@/lib/site-settings-types';

// Plain-language font list: name + how it looks
const FONTS: { value: string; label: string }[] = [
  { value: 'Cinzel', label: 'Cinzel — classic Roman serif' },
  { value: 'Playfair Display', label: 'Playfair Display — elegant serif' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond — refined editorial serif' },
  { value: 'Bodoni Moda', label: 'Bodoni Moda — luxury fashion serif' },
  { value: 'Inter', label: 'Inter — clean modern sans' },
  { value: 'Manrope', label: 'Manrope — balanced modern sans' },
  { value: 'DM Sans', label: 'DM Sans — soft modern sans' },
  { value: 'Outfit', label: 'Outfit — rounded geometric sans' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans — friendly geometric sans' },
  { value: 'Montserrat', label: 'Montserrat — classic geometric sans' },
  { value: 'Syne', label: 'Syne — bold, fashion style' },
  { value: 'Space Grotesk', label: 'Space Grotesk — technical sans' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono — technical monospace' },
  { value: 'Space Mono', label: 'Space Mono — editorial monospace' },
  { value: 'Roboto Mono', label: 'Roboto Mono — clean monospace' },
  { value: 'Custom', label: 'Other Google Font… (type its name)' },
];

const PRESETS: { name: string; description: string; config: TypographyConfig }[] = [
  {
    name: 'Classic (Default)',
    description: 'Cinzel Roman Display + Inter Body + JetBrains Mono Specs',
    config: {
      headingFont: 'Cinzel',
      headingWeight: '500',
      headingScale: 'normal',
      headingLetterSpacing: 'normal',
      headingTransform: 'none',
      subheadingFont: 'Inter',
      subheadingWeight: '600',
      subheadingLetterSpacing: 'normal',
      bodyFont: 'Inter',
      bodyBaseSize: '16px',
      bodyLineHeight: '1.5',
      brandFont: 'Inter',
      brandLetterSpacing: 'wide',
      navFont: 'Inter',
      navSize: '12px',
      navLetterSpacing: 'wide',
      accentFont: 'JetBrains Mono',
      accentLetterSpacing: 'wide',
    },
  },
  {
    name: 'Modern Geometric Minimal',
    description: 'Outfit Display + Plus Jakarta Sans Body + Space Mono',
    config: {
      headingFont: 'Outfit',
      headingWeight: '600',
      headingScale: 'large',
      headingLetterSpacing: 'tight',
      headingTransform: 'none',
      subheadingFont: 'Outfit',
      subheadingWeight: '500',
      subheadingLetterSpacing: 'normal',
      bodyFont: 'Plus Jakarta Sans',
      bodyBaseSize: '16px',
      bodyLineHeight: '1.6',
      brandFont: 'Outfit',
      brandLetterSpacing: 'wide',
      navFont: 'Plus Jakarta Sans',
      navSize: '12px',
      navLetterSpacing: 'wide',
      accentFont: 'Space Mono',
      accentLetterSpacing: 'wide',
    },
  },
  {
    name: 'Milano Luxury Editorial',
    description: 'Playfair Display + DM Sans Body + JetBrains Mono',
    config: {
      headingFont: 'Playfair Display',
      headingWeight: '600',
      headingScale: 'large',
      headingLetterSpacing: 'normal',
      headingTransform: 'none',
      subheadingFont: 'DM Sans',
      subheadingWeight: '500',
      subheadingLetterSpacing: 'normal',
      bodyFont: 'DM Sans',
      bodyBaseSize: '16px',
      bodyLineHeight: '1.6',
      brandFont: 'Playfair Display',
      brandLetterSpacing: 'normal',
      navFont: 'DM Sans',
      navSize: '12px',
      navLetterSpacing: 'wide',
      accentFont: 'JetBrains Mono',
      accentLetterSpacing: 'extra-wide',
    },
  },
  {
    name: 'Avant-Garde Architectural',
    description: 'Syne Display + Space Grotesk Body + Space Mono',
    config: {
      headingFont: 'Syne',
      headingWeight: '700',
      headingScale: 'grand',
      headingLetterSpacing: 'tight',
      headingTransform: 'uppercase',
      subheadingFont: 'Space Grotesk',
      subheadingWeight: '600',
      subheadingLetterSpacing: 'normal',
      bodyFont: 'Space Grotesk',
      bodyBaseSize: '16px',
      bodyLineHeight: '1.5',
      brandFont: 'Syne',
      brandLetterSpacing: 'wide',
      navFont: 'Space Grotesk',
      navSize: '12px',
      navLetterSpacing: 'wide',
      accentFont: 'Space Mono',
      accentLetterSpacing: 'extra-wide',
    },
  },
  {
    name: 'Pure Swiss Monolithic',
    description: 'Inter Everywhere + JetBrains Mono technical accents',
    config: {
      headingFont: 'Inter',
      headingWeight: '600',
      headingScale: 'normal',
      headingLetterSpacing: 'tight',
      headingTransform: 'none',
      subheadingFont: 'Inter',
      subheadingWeight: '600',
      subheadingLetterSpacing: 'normal',
      bodyFont: 'Inter',
      bodyBaseSize: '15px',
      bodyLineHeight: '1.5',
      brandFont: 'Inter',
      brandLetterSpacing: 'wide',
      navFont: 'Inter',
      navSize: '12px',
      navLetterSpacing: 'wide',
      accentFont: 'JetBrains Mono',
      accentLetterSpacing: 'wide',
    },
  },
];


type Opt = { value: string; label: string };
type Extra = { key: keyof TypographyConfig; label: string; options: Opt[] };

const WEIGHTS: Opt[] = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi-bold' },
  { value: '700', label: 'Bold' },
];
const SPACING4: Opt[] = [
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
  { value: 'ultra-wide', label: 'Extra wide' },
];
const SPACING3: Opt[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
  { value: 'extra-wide', label: 'Extra wide' },
];

interface SectionDef {
  title: string;
  where: string;
  fontKey: keyof TypographyConfig;
  customKey: keyof TypographyConfig;
  extras: Extra[];
}

// One entry per part of the website: what it is, where it appears, and which options it has.
const SECTIONS: SectionDef[] = [
  {
    title: 'Main headlines',
    where: "The big titles: the home page banner (\"LIGHT, REFINED.\") and page titles like \"DRY GOODS\" or \"Contact us\".",
    fontKey: 'headingFont', customKey: 'headingCustomFont',
    extras: [
      { key: 'headingWeight', label: 'Boldness', options: WEIGHTS },
      { key: 'headingScale', label: 'Size', options: [
        { value: 'compact', label: 'Smaller' }, { value: 'normal', label: 'Normal' },
        { value: 'large', label: 'Larger' }, { value: 'grand', label: 'Extra large' } ] },
      { key: 'headingLetterSpacing', label: 'Letter spacing', options: SPACING4 },
      { key: 'headingTransform', label: 'Capitals', options: [
        { value: 'none', label: 'As typed' }, { value: 'uppercase', label: 'ALL CAPITALS' }, { value: 'capitalize', label: 'Each Word Capitalised' } ] },
    ],
  },
  {
    title: 'Sub-headings & product names',
    where: 'Product names on cards, section sub-titles and smaller headings.',
    fontKey: 'subheadingFont', customKey: 'subheadingCustomFont',
    extras: [
      { key: 'subheadingWeight', label: 'Boldness', options: WEIGHTS.filter((w) => w.value !== '300') },
      { key: 'subheadingLetterSpacing', label: 'Letter spacing', options: SPACING4.filter((o) => o.value !== 'ultra-wide') },
    ],
  },
  {
    title: 'Paragraph text',
    where: 'Descriptions, product details, the contact form: all normal reading text.',
    fontKey: 'bodyFont', customKey: 'bodyCustomFont',
    extras: [
      { key: 'bodyBaseSize', label: 'Text size', options: [
        { value: '14px', label: 'Small' }, { value: '15px', label: 'Compact' }, { value: '16px', label: 'Normal' },
        { value: '17px', label: 'Large' }, { value: '18px', label: 'Extra large' } ] },
      { key: 'bodyLineHeight', label: 'Line spacing', options: [
        { value: '1.4', label: 'Tight' }, { value: '1.5', label: 'Normal' }, { value: '1.6', label: 'Relaxed' }, { value: '1.7', label: 'Airy' } ] },
    ],
  },
  {
    title: 'Logo / brand name',
    where: 'The "KIRTEE & ASSOCIATES" name in the top bar and the footer.',
    fontKey: 'brandFont', customKey: 'brandCustomFont',
    extras: [{ key: 'brandLetterSpacing', label: 'Letter spacing', options: SPACING3 }],
  },
  {
    title: 'Menu links',
    where: 'The links in the top menu (Products, Contact and so on).',
    fontKey: 'navFont', customKey: 'navCustomFont',
    extras: [
      { key: 'navSize', label: 'Text size', options: [
        { value: '11px', label: 'Small' }, { value: '12px', label: 'Normal' }, { value: '13px', label: 'Large' }, { value: '14px', label: 'Extra large' } ] },
      { key: 'navLetterSpacing', label: 'Letter spacing', options: SPACING3 },
    ],
  },
  {
    title: 'Small labels & specs',
    where: 'Tiny uppercase labels above headings (e.g. "ARCHITECTURAL LIGHTING SYSTEMS") and technical details.',
    fontKey: 'accentFont', customKey: 'accentCustomFont',
    extras: [{ key: 'accentLetterSpacing', label: 'Letter spacing', options: SPACING3 }],
  },
];

const EM: Record<string, string> = {
  tight: '-0.025em', normal: '0em', wide: '0.06em', 'ultra-wide': '0.14em', 'extra-wide': '0.22em',
};
const SCALE: Record<string, number> = { compact: 0.9, normal: 1, large: 1.12, grand: 1.25 };

const effective = (font: string, custom?: string) => (font === 'Custom' && custom?.trim() ? custom.trim() : font || 'Inter');

// Live sample in the chosen style, so the admin sees exactly what the setting changes
function sampleStyle(title: string, c: TypographyConfig): { text: string; style: React.CSSProperties } {
  const fam = (f: string, cu?: string) => `"${effective(f, cu)}", Georgia, serif`;
  switch (title) {
    case 'Main headlines':
      return { text: 'Light, Refined.', style: {
        fontFamily: fam(c.headingFont, c.headingCustomFont), fontWeight: Number(c.headingWeight),
        fontSize: `${1.9 * (SCALE[c.headingScale] || 1)}rem`, letterSpacing: EM[c.headingLetterSpacing],
        textTransform: c.headingTransform } };
    case 'Sub-headings & product names':
      return { text: 'Calipso Honeycomb System', style: {
        fontFamily: fam(c.subheadingFont, c.subheadingCustomFont), fontWeight: Number(c.subheadingWeight),
        fontSize: '1.2rem', letterSpacing: EM[c.subheadingLetterSpacing] } };
    case 'Paragraph text':
      return { text: 'Bespoke architectural lighting systems engineered for exceptional spaces, crafted with precision.', style: {
        fontFamily: fam(c.bodyFont, c.bodyCustomFont), fontSize: c.bodyBaseSize, lineHeight: c.bodyLineHeight } };
    case 'Logo / brand name':
      return { text: 'KIRTEE & ASSOCIATES', style: {
        fontFamily: fam(c.brandFont, c.brandCustomFont), fontWeight: 600, fontSize: '1.1rem', letterSpacing: EM[c.brandLetterSpacing] } };
    case 'Menu links':
      return { text: 'PRODUCTS   DRY GOODS   WET GOODS   CONTACT', style: {
        fontFamily: fam(c.navFont, c.navCustomFont), fontSize: c.navSize, letterSpacing: EM[c.navLetterSpacing], fontWeight: 500 } };
    default:
      return { text: 'ARCHITECTURAL LIGHTING SYSTEMS  ·  2,884 lm  ·  IP68', style: {
        fontFamily: fam(c.accentFont, c.accentCustomFont), fontSize: '0.75rem', letterSpacing: EM[c.accentLetterSpacing] } };
  }
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '0.55rem 0.65rem', border: '1px solid #d1d5db', borderRadius: '6px',
  fontSize: '0.875rem', backgroundColor: '#fff', color: '#111827',
};

export const AdminTypographyManager: React.FC = () => {
  const [config, setConfig] = useState<TypographyConfig>(DEFAULT_TYPOGRAPHY);
  const [saved, setSaved] = useState<TypographyConfig>(DEFAULT_TYPOGRAPHY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/content?key=site_typography')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          const cfg = { ...DEFAULT_TYPOGRAPHY, ...d.data };
          setConfig(cfg);
          setSaved(cfg);
        }
      })
      .catch(() => setMessage({ ok: false, text: 'Could not load the current typography.' }))
      .finally(() => setIsLoading(false));
  }, []);

  // Load the chosen Google Fonts so the samples render in the real font
  useEffect(() => {
    const fonts = new Set(SECTIONS.map((s) => effective(config[s.fontKey] as string, config[s.customKey] as string | undefined)));
    const query = [...fonts].map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700`).join('&');
    let link = document.getElementById('admin-preview-dynamic-fonts') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = 'admin-preview-dynamic-fonts';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`;
  }, [config]);

  const dirty = useMemo(() => JSON.stringify(config) !== JSON.stringify(saved), [config, saved]);
  const set = (key: keyof TypographyConfig, value: string) => {
    setMessage(null);
    setConfig((c) => ({ ...c, [key]: value }));
  };

  const save = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'site_typography', value: config }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(config);
        setMessage({ ok: true, text: 'Saved. The new fonts are live on the website.' });
      } else {
        setMessage({ ok: false, text: data.message || 'Could not save.' });
      }
    } catch {
      setMessage({ ok: false, text: 'Could not reach the server. Nothing was saved.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
        <RefreshCw className="animate-spin" size={22} style={{ margin: '0 auto 0.75rem' }} />
        Loading fonts…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px' }}>
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.14em' }}>
        WEBSITE FONTS
      </span>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: '0.25rem 0 0.5rem' }}>Typography &amp; Fonts</h1>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem' }}>
        Pick a font for each part of the website. The sample under each title shows how it will look.
      </p>

      {/* Quick styles */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
          <Sparkles size={16} style={{ color: '#4f46e5' }} /> Start from a ready-made style
          <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.75rem' }}>(then adjust any part below)</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              title={p.description}
              onClick={() => { setMessage(null); setConfig(p.config); }}
              style={{ padding: '0.45rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '9999px', background: '#fafafa', fontSize: '0.8125rem', fontWeight: 600, color: '#111827', cursor: 'pointer' }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* One card per part of the website */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {SECTIONS.map((sec, i) => {
          const sample = sampleStyle(sec.title, config);
          const isCustom = config[sec.fontKey] === 'Custom';
          return (
            <section key={sec.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>{i + 1}. {sec.title}</h2>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0.25rem 0 0.9rem' }}>{sec.where}</p>

              <div
                aria-label={`Preview of ${sec.title}`}
                style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '6px', padding: '1rem', marginBottom: '0.9rem', color: '#111827', overflowWrap: 'anywhere', ...sample.style }}
              >
                {sample.text}
              </div>

              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }} htmlFor={`font-${sec.fontKey}`}>
                Font
              </label>
              <select id={`font-${sec.fontKey}`} value={config[sec.fontKey] as string} onChange={(e) => set(sec.fontKey, e.target.value)} style={selectStyle}>
                {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              {isCustom && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    value={(config[sec.customKey] as string) || ''}
                    onChange={(e) => set(sec.customKey, e.target.value)}
                    placeholder="Exact name from fonts.google.com, e.g. Lora"
                    aria-label={`Custom Google font for ${sec.title}`}
                    style={selectStyle}
                  />
                </div>
              )}

              <details style={{ marginTop: '0.9rem' }}>
                <summary style={{ cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563' }}>Fine-tune (size, boldness, spacing)</summary>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                  {sec.extras.map((ex) => (
                    <div key={ex.key}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }} htmlFor={`opt-${ex.key}`}>{ex.label}</label>
                      <select id={`opt-${ex.key}`} value={config[ex.key] as string} onChange={(e) => set(ex.key, e.target.value)} style={selectStyle}>
                        {ex.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </details>
            </section>
          );
        })}
      </div>

      {/* Save bar stays visible while scrolling */}
      <div style={{ position: 'sticky', bottom: 0, marginTop: '1.25rem', background: '#fff', borderTop: '1px solid #e5e7eb', padding: '0.85rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={save}
          disabled={isSaving || !dirty}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.4rem', background: dirty ? '#111827' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: isSaving || !dirty ? 'not-allowed' : 'pointer' }}
        >
          {isSaving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : <><Check size={14} /> Save changes</>}
        </button>
        <button
          type="button"
          onClick={() => { if (confirm('Go back to the original fonts?')) { setMessage(null); setConfig(DEFAULT_TYPOGRAPHY); } }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
        >
          <Undo2 size={14} /> Reset to original
        </button>
        {dirty && !message && <span style={{ fontSize: '0.8125rem', color: '#b45309' }}>You have unsaved changes</span>}
        {message && <span role="status" style={{ fontSize: '0.8125rem', color: message.ok ? '#059669' : '#dc2626' }}>{message.text}</span>}
      </div>
    </div>
  );
};
