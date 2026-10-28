import { SiteNavigation, FooterConfig } from '@/types/cms';

export const siteConfig = {
  name: 'Kirtee & Associates',
  tagline: 'Architectural Lighting & Bespoke Luminaires',
  description: 'Precision engineered architectural lighting instruments, high-performance in-ground optical grazers, and custom luminaire design solutions.',
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  contactPerson: 'Divvya',
  phone: '7096962640',
  formattedPhone: '+91 70969 62640',
  email: 'inquiries@kirteeandassoc.com',
  address: [
    'Kirtee & Associates Architectural Studio',
    'Luminaire Design & Photometric Evaluation Lab',
    'Prabhadevi, Mumbai 400013, India',
  ],
  hours: 'Monday – Friday, 09:30 – 18:30 IST',
  social: {
    instagram: 'https://instagram.com/kirteeandassoc',
    linkedin: 'https://linkedin.com/company/kirteeandassoc',
    youtube: 'https://youtube.com/@kirteeandassoc',
    twitter: 'https://x.com/kirteeandassoc',
  },
  seo: {
    defaultTitle: 'Kirtee & Associates | Architectural Lighting & Bespoke Luminaires',
    titleTemplate: '%s | Kirtee & Associates',
    defaultDescription: 'Precision architectural luminaires, in-ground optical wall grazers, low-glare downlights, and custom bespoke lighting engineering by Kirtee & Associates.',
    ogImage: '/images/og-share.jpg',
  }
};

export const defaultNavigation: SiteNavigation = {
  brandName: 'Kirtee & Associates',
  links: [
    { label: 'HOME', href: '/' },
    {
      label: 'PRODUCTS',
      href: '/products',
      children: [
        { label: 'DRY GOODS', href: '/dry-goods' },
        { label: 'WET GOODS', href: '/wet-goods' },
      ],
    },
    { label: 'CONTACT', href: '/contact' },
  ],
  ctaButton: {
    label: 'Consultation',
    href: '/contact',
  },
};

export const defaultFooter: FooterConfig = {
  tagline: 'Designing the poetry and physics of architectural illumination.',
  addressLines: [
    'Kirtee & Associates Architectural Lighting Lab',
    'Demonstration & Photometric Evaluation Studio',
  ],
  telephone: '+91 70969 62640',
  email: 'inquiries@kirteeandassoc.com',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/kirteeandassoc', label: 'Instagram' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/kirteeandassoc', label: 'LinkedIn' },
    { platform: 'youtube', url: 'https://youtube.com/@kirteeandassoc', label: 'YouTube' },
  ],
  quickLinks: [
    { label: 'Architectural Catalogue', href: '/products' },
    { label: 'In-Ground Systems', href: '/products/ingraze-frame-1000' },
    { label: 'Trimless Linear Grazers', href: '/products/veloce-40-wall-grazer' },
    { label: 'Bespoke Engineering', href: '/#bespoke' },
    { label: 'Specification Contact', href: '/contact' },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Photometric Compliance', href: '/compliance' },
  ],
  copyright: `© ${new Date().getFullYear()} Kirtee & Associates. All rights reserved.`,
};
