import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/media',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'text/plain',
      'application/octet-stream',
    ],
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'filesize', 'createdAt'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Descriptive Alt Text',
      admin: {
        description: 'Required for accessibility and SEO image search.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Editorial Caption',
    },
  ],
};
