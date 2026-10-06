import type { GlobalConfig } from 'payload';

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Homepage Content',
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'ARCHITECTURAL ILLUMINATION & OPTICAL INSTRUMENTS' },
        { name: 'heading', type: 'text', defaultValue: 'The Pure Chemistry of Light and Space' },
        { name: 'subheading', type: 'textarea', defaultValue: 'We engineer precision luminaires and custom optical solutions that transform contemporary architecture from within.' },
        { name: 'mediaUrl', type: 'text', defaultValue: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85' },
      ],
    },
    {
      name: 'intro',
      type: 'group',
      label: 'Philosophy & Overview',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Precision Optics Designed for Enduring Architecture' },
        { name: 'statement', type: 'text', defaultValue: 'Light should never compete with architecture. It must define it.' },
        { name: 'details', type: 'textarea' },
      ],
    },
  ],
};
