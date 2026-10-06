import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Design Tokens & Site Settings',
  fields: [
    {
      name: 'brandName',
      type: 'text',
      defaultValue: 'Kirtee & Associates',
      required: true,
      label: 'Brand Title',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Architectural Lighting & Bespoke Luminaires',
      label: 'Brand Tagline',
    },
    // Global Color Palette Tokens
    {
      name: 'colors',
      type: 'group',
      label: 'Global Color Tokens (HEX)',
      fields: [
        { name: 'primaryBg', type: 'text', defaultValue: '#0a0b0d', label: 'Primary Background' },
        { name: 'surfaceBg', type: 'text', defaultValue: '#121417', label: 'Surface Background' },
        { name: 'primaryText', type: 'text', defaultValue: '#f8f9fa', label: 'Primary Text' },
        { name: 'secondaryText', type: 'text', defaultValue: '#a0a6b1', label: 'Secondary Text' },
        { name: 'accent', type: 'text', defaultValue: '#c5a880', label: 'Accent / Brass Highlight' },
      ],
    },
    // Social Links
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Studio Social Media Channels',
      fields: [
        { name: 'instagram', type: 'text', defaultValue: 'https://instagram.com/kirteeandassoc' },
        { name: 'linkedin', type: 'text', defaultValue: 'https://linkedin.com/company/kirteeandassoc' },
        { name: 'youtube', type: 'text', defaultValue: 'https://youtube.com/@kirteeandassoc' },
      ],
    },
  ],
};
