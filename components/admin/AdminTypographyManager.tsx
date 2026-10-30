'use client';

import React, { useState, useEffect } from 'react';
import { Type, Sparkles, Check, RefreshCw, Undo2, Sliders, ExternalLink } from 'lucide-react';
import { TypographyConfig, DEFAULT_TYPOGRAPHY } from '@/lib/site-settings-types';

const CURATED_FONTS = [
  { value: 'Cinzel', label: 'Cinzel (Classical Architectural Inscription, Roman Serif)' },
  { value: 'Inter', label: 'Inter (Modern Swiss Grotesque, Ultra Clean Sans)' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Warm Geometric Architectural)' },
  { value: 'Outfit', label: 'Outfit (Refined Geometric Sans)' },
  { value: 'DM Sans', label: 'DM Sans (Contemporary Low-Contrast Sans)' },
  { value: 'Syne', label: 'Syne (Avant-Garde High-Fashion Architectural)' },
  { value: 'Playfair Display', label: 'Playfair Display (Luxury Editorial High-Contrast Serif)' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Haute Couture Museum-Grade Serif)' },
  { value: 'Space Grotesk', label: 'Space Grotesk (Technical Brutalist Sans)' },
  { value: 'Montserrat', label: 'Montserrat (Classic Geometric Architectural Sans)' },
  { value: 'Bodoni Moda', label: 'Bodoni Moda (Ultra Luxury Vogue / Architectural Digest)' },
  { value: 'Manrope', label: 'Manrope (Modern Balanced Geometric)' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono (Engineered High-Precision Monospace)' },
  { value: 'Space Mono', label: 'Space Mono (Editorial Technical Monospace)' },
  { value: 'Roboto Mono', label: 'Roboto Mono (Clean Technical Monospace)' },
  { value: 'Custom', label: 'Custom Google Font (Enter any font name)' },
];

const PRESETS: { name: string; description: string; config: TypographyConfig }[] = [
  {
    name: 'Bespoke Classical (Default)',
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

export const AdminTypographyManager: React.FC = () => {
  const [config, setConfig] = useState<TypographyConfig>(DEFAULT_TYPOGRAPHY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch current typography setting
  useEffect(() => {
    fetch('/api/admin/content?key=site_typography')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setConfig({ ...DEFAULT_TYPOGRAPHY, ...data.data });
        }
      })
      .catch((err) => console.warn('Could not load typography settings:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const getEffectiveFont = (font: string, custom?: string) => {
    if (font === 'Custom' && custom && custom.trim()) return custom.trim();
    return font || 'Inter';
  };

  // Dynamically load Google Font for the preview
  useEffect(() => {
    const fonts = new Set<string>();
    [
      getEffectiveFont(config.headingFont, config.headingCustomFont),
      getEffectiveFont(config.subheadingFont, config.subheadingCustomFont),
      getEffectiveFont(config.bodyFont, config.bodyCustomFont),
      getEffectiveFont(config.brandFont, config.brandCustomFont),
      getEffectiveFont(config.navFont, config.navCustomFont),
      getEffectiveFont(config.accentFont, config.accentCustomFont),
    ].forEach((f) => {
      if (f && !['system-ui', '-apple-system', 'sans-serif', 'serif', 'monospace'].includes(f.toLowerCase())) {
        fonts.add(f);
      }
    });

    if (fonts.size === 0) return;

    const query = Array.from(fonts)
      .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700`)
      .join('&');

    const linkId = 'admin-preview-dynamic-fonts';
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`;
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_typography',
          value: config,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert('Failed to save typography: ' + (data.message || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Error saving typography: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset typography to default studio architectural standards?')) {
      setConfig(DEFAULT_TYPOGRAPHY);
    }
  };

  const effectiveHeading = getEffectiveFont(config.headingFont, config.headingCustomFont);
  const effectiveSubheading = getEffectiveFont(config.subheadingFont, config.subheadingCustomFont);
  const effectiveBody = getEffectiveFont(config.bodyFont, config.bodyCustomFont);
  const effectiveBrand = getEffectiveFont(config.brandFont, config.brandCustomFont);
  const effectiveNav = getEffectiveFont(config.navFont, config.navCustomFont);
  const effectiveAccent = getEffectiveFont(config.accentFont, config.accentCustomFont);

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
        <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 1rem auto' }} />
        <p>Loading typography controls...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#6b7280',
              letterSpacing: '0.14em',
            }}
          >
            GLOBAL DESIGN SYSTEM &amp; TYPOGRAPHY
          </span>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#111827',
              margin: '0.25rem 0 0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Type size={26} style={{ color: '#111827' }} />
            <span>Typography &amp; Font Control</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            Change fonts, sizes, weights, and letter-spacing for every single element across the entire website in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <Undo2 size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.4rem',
              backgroundColor: saveSuccess ? '#059669' : '#111827',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#ffffff',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              transition: 'all 0.2s ease',
            }}
          >
            {isSaving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check size={14} />
                <span>Saved &amp; Synced!</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1-Click Architectural Presets */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={18} style={{ color: '#4f46e5' }} />
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: 0 }}>
            1-Click Architectural Presets
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: 'auto' }}>
            Click to apply a cohesive, professionally paired typography system
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setConfig(preset.config)}
              style={{
                textAlign: 'left',
                padding: '0.85rem 1rem',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#111827';
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#fafafa';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', marginBottom: '0.2rem' }}>
                {preset.name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#6b7280', lineHeight: 1.3 }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Controls (Left) & Real-time Live Preview (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1.25fr) minmax(340px, 1fr)',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Granular Controls for Every Element */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Card 1: Main Headings (H1, H2, Hero Titles) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                1. Main Headings (H1, H2, Hero &amp; Display Titles)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Heading Font Family
                </label>
                <select
                  value={config.headingFont}
                  onChange={(e) => setConfig({ ...config, headingFont: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                >
                  {CURATED_FONTS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                {config.headingFont === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter Google Font name (e.g. Clash Display, Bodoni, Italiana)"
                    value={config.headingCustomFont || ''}
                    onChange={(e) => setConfig({ ...config, headingCustomFont: e.target.value })}
                    style={{ width: '100%', marginTop: '0.45rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                  />
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Font Weight
                  </label>
                  <select
                    value={config.headingWeight}
                    onChange={(e) => setConfig({ ...config, headingWeight: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Scale / Size
                  </label>
                  <select
                    value={config.headingScale}
                    onChange={(e) => setConfig({ ...config, headingScale: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="compact">Compact (90%)</option>
                    <option value="normal">Default (100%)</option>
                    <option value="large">Large (112%)</option>
                    <option value="grand">Grand Display (125%)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Letter Spacing
                  </label>
                  <select
                    value={config.headingLetterSpacing}
                    onChange={(e) => setConfig({ ...config, headingLetterSpacing: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="tight">Tight (-0.025em)</option>
                    <option value="normal">Normal (0em)</option>
                    <option value="wide">Wide (+0.06em)</option>
                    <option value="ultra-wide">Ultra-Wide (+0.14em)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Text Transform
                  </label>
                  <select
                    value={config.headingTransform}
                    onChange={(e) => setConfig({ ...config, headingTransform: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="none">As Typed (Normal)</option>
                    <option value="uppercase">ALL UPPERCASE</option>
                    <option value="capitalize">Capitalize Words</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Subheadings & Product Cards (H3, H4) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                2. Subheadings &amp; Product Titles (H3, H4, Feature Cards)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Subheading Font Family
                </label>
                <select
                  value={config.subheadingFont}
                  onChange={(e) => setConfig({ ...config, subheadingFont: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                >
                  {CURATED_FONTS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                {config.subheadingFont === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter Google Font name"
                    value={config.subheadingCustomFont || ''}
                    onChange={(e) => setConfig({ ...config, subheadingCustomFont: e.target.value })}
                    style={{ width: '100%', marginTop: '0.45rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                  />
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Font Weight
                  </label>
                  <select
                    value={config.subheadingWeight}
                    onChange={(e) => setConfig({ ...config, subheadingWeight: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Letter Spacing
                  </label>
                  <select
                    value={config.subheadingLetterSpacing}
                    onChange={(e) => setConfig({ ...config, subheadingLetterSpacing: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="tight">Tight (-0.025em)</option>
                    <option value="normal">Normal (0em)</option>
                    <option value="wide">Wide (+0.06em)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Body & Paragraphs */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                3. Body &amp; Content Text (Paragraphs, Descriptions, Specs, Forms)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Body Font Family
                </label>
                <select
                  value={config.bodyFont}
                  onChange={(e) => setConfig({ ...config, bodyFont: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                >
                  {CURATED_FONTS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                {config.bodyFont === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter Google Font name"
                    value={config.bodyCustomFont || ''}
                    onChange={(e) => setConfig({ ...config, bodyCustomFont: e.target.value })}
                    style={{ width: '100%', marginTop: '0.45rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                  />
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Base Body Size
                  </label>
                  <select
                    value={config.bodyBaseSize}
                    onChange={(e) => setConfig({ ...config, bodyBaseSize: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="14px">Small (14px)</option>
                    <option value="15px">Refined Compact (15px)</option>
                    <option value="16px">Standard (16px)</option>
                    <option value="17px">Large (17px)</option>
                    <option value="18px">Extra Large (18px)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Line Height (Spacing)
                  </label>
                  <select
                    value={config.bodyLineHeight}
                    onChange={(e) => setConfig({ ...config, bodyLineHeight: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="1.4">Compact (1.4)</option>
                    <option value="1.5">Standard (1.5)</option>
                    <option value="1.6">Relaxed (1.6)</option>
                    <option value="1.7">Spacious (1.7)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Brand Logo & Navigation */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                4. Brand Logo &amp; Header Navigation
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Brand Logo Font (ZENVORA)
                </label>
                <select
                  value={config.brandFont}
                  onChange={(e) => setConfig({ ...config, brandFont: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                >
                  {CURATED_FONTS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                {config.brandFont === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter Google Font name"
                    value={config.brandCustomFont || ''}
                    onChange={(e) => setConfig({ ...config, brandCustomFont: e.target.value })}
                    style={{ width: '100%', marginTop: '0.45rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                  />
                )}
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.2rem' }}>
                    Brand Letter Spacing
                  </label>
                  <select
                    value={config.brandLetterSpacing}
                    onChange={(e) => setConfig({ ...config, brandLetterSpacing: e.target.value as any })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.75rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="normal">Normal (0.08em)</option>
                    <option value="wide">Wide (0.14em)</option>
                    <option value="extra-wide">Extra-Wide (0.22em)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Header Nav Links Font
                </label>
                <select
                  value={config.navFont}
                  onChange={(e) => setConfig({ ...config, navFont: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                >
                  {CURATED_FONTS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                {config.navFont === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter Google Font name"
                    value={config.navCustomFont || ''}
                    onChange={(e) => setConfig({ ...config, navCustomFont: e.target.value })}
                    style={{ width: '100%', marginTop: '0.45rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                  />
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.2rem' }}>
                      Nav Size
                    </label>
                    <select
                      value={config.navSize}
                      onChange={(e) => setConfig({ ...config, navSize: e.target.value as any })}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.75rem', backgroundColor: '#ffffff' }}
                    >
                      <option value="11px">11px</option>
                      <option value="12px">12px</option>
                      <option value="13px">13px</option>
                      <option value="14px">14px</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.2rem' }}>
                      Nav Spacing
                    </label>
                    <select
                      value={config.navLetterSpacing}
                      onChange={(e) => setConfig({ ...config, navLetterSpacing: e.target.value as any })}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.75rem', backgroundColor: '#ffffff' }}
                    >
                      <option value="normal">Normal</option>
                      <option value="wide">Wide (0.14em)</option>
                      <option value="extra-wide">Ultra (0.2em)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Technical Badges, Eyebrows & Specs */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                5. Eyebrows, Technical Badges &amp; Monospace Specs
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Technical / Accent Font
                </label>
                <select
                  value={config.accentFont}
                  onChange={(e) => setConfig({ ...config, accentFont: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                >
                  <option value="JetBrains Mono">JetBrains Mono (Precision Monospace)</option>
                  <option value="Space Mono">Space Mono (Editorial Monospace)</option>
                  <option value="Roboto Mono">Roboto Mono (Clean Technical)</option>
                  <option value="Inter">Inter (Sans-Serif Mono Match)</option>
                  <option value="Custom">Custom Font</option>
                </select>
                {config.accentFont === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter Google Font name"
                    value={config.accentCustomFont || ''}
                    onChange={(e) => setConfig({ ...config, accentCustomFont: e.target.value })}
                    style={{ width: '100%', marginTop: '0.45rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Accent Letter Spacing
                </label>
                <select
                  value={config.accentLetterSpacing}
                  onChange={(e) => setConfig({ ...config, accentLetterSpacing: e.target.value as any })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff' }}
                >
                  <option value="normal">Normal (0.14em)</option>
                  <option value="wide">Wide (0.22em)</option>
                  <option value="extra-wide">Ultra-Wide (0.3em)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div
            style={{
              backgroundColor: '#0a0a09',
              color: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #302f2b',
              padding: '2rem',
              boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.18em', color: '#96938c', textTransform: 'uppercase' }}>
                LIVE STUDIO PREVIEW
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                Instant Visual Feedback
              </span>
            </div>

            {/* Preview: Header Brand & Nav */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div
                    style={{
                      fontFamily: `"${effectiveBrand}", sans-serif`,
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      letterSpacing: config.brandLetterSpacing === 'extra-wide' ? '0.22em' : config.brandLetterSpacing === 'wide' ? '0.14em' : '0.08em',
                      textTransform: 'uppercase',
                      color: '#ffffff',
                    }}
                  >
                    ZENVORA
                  </div>
                  <div
                    style={{
                      fontFamily: `"${effectiveAccent}", monospace`,
                      fontSize: '0.55rem',
                      letterSpacing: '0.2em',
                      color: '#96938c',
                      textTransform: 'uppercase',
                    }}
                  >
                    ARCHITECTURAL LIGHTING
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontFamily: `"${effectiveNav}", sans-serif`,
                    fontSize: config.navSize,
                    letterSpacing: config.navLetterSpacing === 'extra-wide' ? '0.2em' : config.navLetterSpacing === 'wide' ? '0.14em' : '0.08em',
                    textTransform: 'uppercase',
                    color: '#c8c2b7',
                  }}
                >
                  <span style={{ color: '#ffffff', borderBottom: '1px solid #ffffff', paddingBottom: '2px' }}>HOME</span>
                  <span>DRY GOODS</span>
                  <span>WET GOODS</span>
                  <span>CONTACT</span>
                </div>
              </div>
            </div>

            {/* Preview: Eyebrow Tag */}
            <div
              style={{
                fontFamily: `"${effectiveAccent}", monospace`,
                fontSize: '0.6875rem',
                letterSpacing: config.accentLetterSpacing === 'extra-wide' ? '0.3em' : config.accentLetterSpacing === 'wide' ? '0.22em' : '0.14em',
                color: '#c5a880',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              IP68 SUBMERSIBLE SYSTEMS .01
            </div>

            {/* Preview: Main Heading */}
            <h1
              style={{
                fontFamily: `"${effectiveHeading}", Georgia, serif`,
                fontSize:
                  config.headingScale === 'grand'
                    ? '2.75rem'
                    : config.headingScale === 'large'
                    ? '2.4rem'
                    : config.headingScale === 'compact'
                    ? '1.85rem'
                    : '2.1rem',
                fontWeight: Number(config.headingWeight),
                letterSpacing:
                  config.headingLetterSpacing === 'ultra-wide'
                    ? '0.14em'
                    : config.headingLetterSpacing === 'wide'
                    ? '0.06em'
                    : config.headingLetterSpacing === 'tight'
                    ? '-0.025em'
                    : '0em',
                textTransform: config.headingTransform,
                lineHeight: 1.1,
                color: '#ffffff',
                marginBottom: '1rem',
              }}
            >
              Light, Refined.
            </h1>

            {/* Preview: Subheading */}
            <h3
              style={{
                fontFamily: `"${effectiveSubheading}", sans-serif`,
                fontSize: '1.15rem',
                fontWeight: Number(config.subheadingWeight),
                letterSpacing: config.subheadingLetterSpacing === 'wide' ? '0.06em' : config.subheadingLetterSpacing === 'tight' ? '-0.025em' : '0em',
                color: '#e9e6de',
                marginBottom: '0.85rem',
              }}
            >
              Calipso Monolithic Architectural System
            </h3>

            {/* Preview: Body Paragraph */}
            <p
              style={{
                fontFamily: `"${effectiveBody}", sans-serif`,
                fontSize: config.bodyBaseSize,
                lineHeight: Number(config.bodyLineHeight),
                color: '#96938c',
                marginBottom: '1.5rem',
              }}
            >
              Micro-aperture wall grazers engineered for subterranean facade resilience and continuous glare-free illumination across raw architectural stone.
            </p>

            {/* Preview: Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#ffffff',
                  color: '#0a0a09',
                  borderRadius: '9999px',
                  fontFamily: `"${effectiveBody}", sans-serif`,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                <span>EXPLORE LUMINAIRES</span>
                <span>↗</span>
              </div>

              <div
                style={{
                  fontFamily: `"${effectiveAccent}", monospace`,
                  fontSize: '0.7rem',
                  color: '#c8c2b7',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '4px',
                }}
              >
                CRI &gt;95 | 3000K | 24V
              </div>
            </div>

            {/* Summary Tag */}
            <div
              style={{
                marginTop: '1.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.6875rem',
                color: '#6b7280',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem 1rem',
              }}
            >
              <span>Heading: <strong style={{ color: '#ffffff' }}>{effectiveHeading}</strong></span>
              <span>Body: <strong style={{ color: '#ffffff' }}>{effectiveBody}</strong></span>
              <span>Brand: <strong style={{ color: '#ffffff' }}>{effectiveBrand}</strong></span>
              <span>Accent: <strong style={{ color: '#ffffff' }}>{effectiveAccent}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
