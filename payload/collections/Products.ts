import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'category', 'status', 'isFeatured'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Product Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL Slug (/products/[slug])',
      admin: {
        description: 'Auto-generated or custom SEO-friendly slug. Unique across catalog.',
      },
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      index: true,
      label: 'Order Code / SKU',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Optical Tagline / Subtitle',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Feature on Homepage',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Architectural Category',
    },
    {
      name: 'subcategory',
      type: 'text',
      label: 'Subcategory Classification',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      label: 'Short Overview (Card & Synopsis)',
    },
    {
      name: 'fullDescription',
      type: 'textarea',
      required: true,
      label: 'Full Architectural & Optical Narrative',
    },
    {
      name: 'heroImageUrl',
      type: 'text',
      label: 'Hero Image Asset URL',
      required: true,
    },
    {
      name: 'heroImageAlt',
      type: 'text',
      label: 'Hero Image Alt Text',
      required: true,
    },
    // Flexible Technical Specifications Array
    {
      name: 'specifications',
      type: 'array',
      label: 'Technical & Photometric Specifications',
      labels: {
        singular: 'Specification Parameter',
        plural: 'Specification Parameters',
      },
      fields: [
        {
          name: 'group',
          type: 'select',
          defaultValue: 'Optical',
          options: [
            { label: 'Optical', value: 'Optical' },
            { label: 'Electrical', value: 'Electrical' },
            { label: 'Physical', value: 'Physical' },
            { label: 'Mounting', value: 'Mounting' },
            { label: 'Photometric', value: 'Photometric' },
            { label: 'General', value: 'General' },
          ],
        },
        { name: 'label', type: 'text', required: true, label: 'Parameter Label' },
        { name: 'value', type: 'text', required: true, label: 'Parameter Value' },
        { name: 'unit', type: 'text', label: 'Unit of Measure (e.g. lm, W, mm)' },
      ],
    },
    // Downloads Array
    {
      name: 'downloads',
      type: 'array',
      label: 'Technical Assets & Downloads',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Document Title' },
        { name: 'fileUrl', type: 'text', required: true, label: 'Download URL' },
        {
          name: 'fileType',
          type: 'select',
          defaultValue: 'PDF',
          options: [
            { label: 'PDF Datasheet', value: 'PDF' },
            { label: 'IES Photometrics', value: 'IES' },
            { label: 'LDT Photometrics', value: 'LDT' },
            { label: 'CAD / BIM Family', value: 'CAD' },
            { label: 'Installation Guide', value: 'DOC' },
          ],
        },
        { name: 'fileSize', type: 'text', label: 'File Size (e.g. 2.4 MB)' },
        { name: 'description', type: 'text', label: 'Brief Description' },
      ],
    },
    // SEO fields
    {
      name: 'seo',
      type: 'group',
      label: 'Search Engine Optimization',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Custom Meta Title' },
        { name: 'metaDescription', type: 'textarea', label: 'Custom Meta Description' },
        { name: 'canonicalUrl', type: 'text', label: 'Canonical URL' },
      ],
    },
  ],
};
