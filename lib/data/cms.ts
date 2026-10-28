import { HomePageData, ContactPageData } from '@/types/cms';

export const initialHomePageData: HomePageData = {
  seo: {
    title: 'Kirtee & Associates | Architectural Lighting & Bespoke Luminaires',
    description: 'Precision architectural luminaires, low-glare optical systems, and custom bespoke lighting engineering.',
    ogImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  hero: {
    eyebrow: 'ARCHITECTURAL ILLUMINATION & OPTICAL INSTRUMENTS',
    heading: 'The Pure Chemistry of Light and Space',
    subheading: 'We engineer precision luminaires and custom optical solutions that transform contemporary architecture from within.',
    primaryCta: {
      label: 'Explore Catalogue',
      href: '/products',
    },
    secondaryCta: {
      label: 'Bespoke Commissions',
      href: '/#bespoke',
    },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
  },
  intro: {
    eyebrow: 'OUR PHILOSOPHY',
    title: 'Precision Optics Designed for Enduring Architecture',
    statement: 'Light should never compete with architecture. It must define it.',
    details: 'At Kirtee & Associates, we collaborate with leading architects, lighting designers, and landscape consultants to produce luminaires of exacting mechanical precision, zero optical compromise, and enduring material permanence.',
    stats: [
      { value: 'CRI 98+', label: 'Color Fidelity Index' },
      { value: 'IP68', label: 'Continuous Submersion Sealing' },
      { value: 'UGR < 10', label: 'Glare-Free Human Comfort' },
      { value: '5-Year', label: 'Comprehensive Warranty' },
    ],
  },
  featuredProducts: {
    eyebrow: 'CURATED INSTRUMENTS',
    title: 'Master Architectural Families',
    subtitle: 'Engineered for facade grazing, subterranean reveals, and discreet interior integration.',
    productSlugs: ['ingraze-frame-1000', 'veloce-40-wall-grazer', 'aura-spot-75', 'atelier-oculus-90'],
  },
  storytelling: {
    eyebrow: 'BESPOKE COMMISSIONING',
    title: 'Tailored Luminaires for Signature Projects',
    description: 'When catalog fixtures cannot fulfill the architectural vision, our engineering studio designs custom optical housings, proprietary extrusions, and specialized mounting assemblies tailored to unique site conditions.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Architectural lighting installation highlighting textured stone and structural geometry',
    quote: {
      text: 'Light is not an accessory to architecture; it is the medium through which architectural form reveals its true materiality.',
      author: 'Kirtee & Associates Studio',
      role: 'Engineering & Photometrics Division',
    },
  },
  cta: {
    heading: 'Begin Your Architectural Specification',
    description: 'Discuss technical parameters, request photometric packages, or initiate a bespoke fixture consultation with our lighting engineers.',
    buttonText: 'Contact Specification Team',
    buttonHref: '/contact',
  },
};

export const initialContactPageData: ContactPageData = {
  seo: {
    title: 'Contact & Project Inquiries | Kirtee & Associates',
    description: 'Connect with Kirtee & Associates for luminaire specifications, photometric packages, or bespoke commissions. Primary Contact: Divvya — 7096962640.',
  },
  heading: 'Initiate a Consultation',
  subheading: 'Our lighting specialists support architects, facade engineers, and lighting consultants from initial concept to on-site commissioning.',
  contactDetails: {
    primaryContactPerson: 'Divvya',
    phone: '7096962640',
    email: 'inquiries@kirteeandassoc.com',
    officeAddress: [
      'Kirtee & Associates Architectural Studio',
      'Luminaire Design & Photometric Evaluation Lab',
      'Prabhadevi, Mumbai 400013, India',
    ],
    businessHours: 'Monday – Friday: 09:30 – 18:30 IST',
  },
  formTopics: [
    'Commercial Specification & Quotation',
    'Bespoke Luminaire Engineering',
    'Photometric & IES File Request',
    'Sample Fixture Evaluation',
    'Technical Consultation',
  ],
};
