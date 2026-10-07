import { SiteNavigation, FooterConfig } from '@/types/cms';

export const siteConfig = {
  name: 'ZENVORA',
  legalName: 'Kirtee & Associates',
  tagline: 'Architectural Lighting & Bespoke Luminaires',
  description: 'Precision engineered architectural lighting instruments and custom luminaire design solutions inspired by leading Italian and European design houses.',
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://zenvora.com',
  contactPerson: 'Zenvora Specification Team',
  phone: '7096962640',
  formattedPhone: '+91 70969 62640',
  email: 'inquiries@zenvora.com',
  address: [
    'Zenvora Architectural Lighting Studio',
    'Polígono Industrial & Engineering Lab',
    'Demonstration & Experience Space',
  ],
  hours: 'Monday – Friday, 09:30 – 18:30 IST',
  social: {
    instagram: 'https://instagram.com/zenvora',
    linkedin: 'https://linkedin.com/company/zenvora',
    twitter: 'https://twitter.com/zenvora',
    facebook: 'https://facebook.com/zenvora',
    youtube: 'https://youtube.com/@zenvora',
  },
  seo: {
    defaultTitle: 'ZENVORA | Architectural Lighting & Bespoke Luminaires',
    titleTemplate: '%s | ZENVORA',
    defaultDescription: 'Explore precision-crafted architectural luminaires, dry goods indoor systems, wet goods exterior fixtures, and bespoke lighting engineering by ZENVORA.',
    ogImage: '/images/og-share.jpg',
  }
};

export const defaultNavigation: SiteNavigation = {
  brandName: 'ZENVORA',
  links: [
    { label: 'DRY GOODS', href: '/dry-goods' },
    { label: 'WET GOODS', href: '/wet-goods' },
    { label: 'CONTACT', href: '/contact' },
  ],
  ctaButton: {
    label: 'Contact',
    href: '/contact',
  },
};

export const defaultFooter: FooterConfig = {
  tagline: 'Products that convey innovation and design skills, towards new frontiers of light.',
  addressLines: [
    'Zenvora Design & Lighting Lab',
    'Polígono Industrial & Demonstration Studio',
  ],
  telephone: '+91 70969 62640',
  email: 'inquiries@zenvora.com',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/zenvora', label: 'Instagram' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/zenvora', label: 'LinkedIn' },
    { platform: 'twitter', url: 'https://x.com/zenvora', label: 'X' },
  ],
  quickLinks: [
    { label: 'Dry Goods', href: '/dry-goods' },
    { label: 'Wet Goods', href: '/wet-goods' },
    { label: 'Bespoke Engineering', href: '/#bespoke' },
    { label: 'Contact', href: '/contact' },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Specification', href: '/terms' },
    { label: 'Photometrics & IES Data', href: '/compliance' },
  ],
  copyright: `© ${new Date().getFullYear()} ZENVORA. All rights reserved.`,
};
