import { SiteNavigation, FooterConfig } from '@/types/cms';

export const siteConfig = {
  name: 'Kirtee & Associates',
  tagline: 'Architectural Lighting & Bespoke Luminaires',
  description: 'Precision engineered architectural lighting instruments and custom luminaire design solutions for commercial, public, and high-end residential spaces.',
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://kirteeandassoc.com',
  contactPerson: 'Divvya',
  phone: '7096962640',
  formattedPhone: '+91 70969 62640',
  email: 'inquiries@kirteeandassoc.com',
  address: [
    'Kirtee & Associates Design Studio',
    'Architectural Luminaire Division',
    'Studio & Demonstration Space [Location TBD]'
  ],
  hours: 'Monday – Friday, 09:30 – 18:30 IST',
  social: {
    instagram: 'https://instagram.com/kirteeandassoc',
    linkedin: 'https://linkedin.com/company/kirteeandassoc',
    youtube: 'https://youtube.com/@kirteeandassoc',
  },
  seo: {
    defaultTitle: 'Kirtee & Associates | Architectural Lighting & Bespoke Luminaires',
    titleTemplate: '%s | Kirtee & Associates',
    defaultDescription: 'Explore precision-crafted architectural luminaires, recessed optical systems, and bespoke lighting engineering by Kirtee & Associates.',
    ogImage: '/images/og-share.jpg',
  }
};

export const defaultNavigation: SiteNavigation = {
  brandName: 'Kirtee & Associates',
  links: [
    { label: 'Overview', href: '/#overview' },
    { label: 'Catalogue', href: '/products' },
    { label: 'Bespoke Engineering', href: '/#bespoke' },
    { label: 'Technical Data', href: '/#specifications' },
    { label: 'Contact', href: '/contact' },
  ],
  ctaButton: {
    label: 'Consultation',
    href: '/contact',
  },
};

export const defaultFooter: FooterConfig = {
  tagline: 'Designing the poetry and physics of architectural illumination.',
  addressLines: [
    'Kirtee & Associates Luminaire Laboratory',
    'Architectural Fixture Studio',
    'Demonstration Center [TBD]'
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
    { label: 'In-Ground Systems', href: '/products?category=in-ground' },
    { label: 'Linear Optical Grazers', href: '/products?category=linear-grazers' },
    { label: 'Bespoke Commissions', href: '/#bespoke' },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Specification', href: '/terms' },
    { label: 'Compliance & Photometrics', href: '/compliance' },
  ],
  copyright: `© ${new Date().getFullYear()} Kirtee & Associates. All rights reserved.`,
};
