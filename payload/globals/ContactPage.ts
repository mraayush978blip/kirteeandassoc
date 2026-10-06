import type { GlobalConfig } from 'payload';

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Information & Settings',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Initiate a Consultation',
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue: 'Our lighting specialists support architects, facade engineers, and lighting consultants from initial concept to on-site commissioning.',
    },
    {
      name: 'primaryContactPerson',
      type: 'text',
      defaultValue: 'Divvya',
      label: 'Primary Contact Person',
    },
    {
      name: 'phone',
      type: 'text',
      defaultValue: '7096962640',
      label: 'Contact Telephone',
    },
    {
      name: 'email',
      type: 'email',
      defaultValue: 'inquiries@kirteeandassoc.com',
      label: 'Official Inquiries Email',
    },
    {
      name: 'businessHours',
      type: 'text',
      defaultValue: 'Monday – Friday: 09:30 – 18:30 IST',
    },
  ],
};
