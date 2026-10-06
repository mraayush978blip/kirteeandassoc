import type { CollectionConfig } from 'payload';

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'topic', 'email', 'createdAt'],
  },
  access: {
    // Public cannot read submissions, only authenticated CMS users can
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'super-admin'),
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Contact Name' },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'phone', type: 'text', label: 'Telephone' },
    { name: 'company', type: 'text', label: 'Architecture Firm' },
    { name: 'topic', type: 'text', label: 'Inquiry Classification' },
    { name: 'product', type: 'text', label: 'Specified Luminaire' },
    { name: 'message', type: 'textarea', required: true, label: 'Project Message' },
  ],
};
