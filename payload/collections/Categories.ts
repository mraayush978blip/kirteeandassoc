import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL Identifier / Slug',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Architectural Category Summary',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Sequence Order',
    },
  ],
};
