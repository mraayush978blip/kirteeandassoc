export interface HeroSlideConfig {
  id: string;
  slotId: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
  order: number;
}

export interface ProjectConfig {
  id: string;
  num: string;
  title: string;
  location: string;
  category?: string;
  year?: string;
  description?: string;
  imageUrl: string;
  slug: string;
  order: number;
  isFeatured?: boolean;
}

export interface ContactConfig {
  heading?: string;
  teamNotice?: string;
  description?: string;
  contactPerson?: string;
  companyName?: string;
  addressLine1?: string;
  addressLine2?: string;
  whatsappNumber: string;
  whatsappMessage: string;
  inquiryEmail: string;
  phoneNumber: string;
  studioAddress: string;
  businessHours: string;
  instagramUrl: string;
  linkedinUrl: string;
}

export interface ProjectSettings {
  showOnWebsite: boolean;
}

export interface PhilosophyPillar {
  num: string;
  title: string;
  description: string;
}

export interface PhilosophyConfig {
  eyebrow: string;
  headline: string;
  narrative: string;
  pillars: PhilosophyPillar[];
}

export interface ValuePillar {
  id: string;
  num: string;
  tag: string;
  title: string;
  metric: string;
  description: string;
  image: string;
}

export interface WhyChooseUsConfig {
  eyebrow: string;
  headline: string;
  description: string;
  pillars: ValuePillar[];
}

export interface BespokeStepConfig {
  slotId: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface ProcessConfig {
  eyebrow: string;
  headline: string;
  steps: BespokeStepConfig[];
}

export interface ProjectCtaConfig {
  eyebrow: string;
  headline: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  imageUrl: string;
  imageAlt: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: 'hero-1',
    slotId: 'hero-slide-1',
    eyebrow: 'ARCHITECTURAL LIGHTING SYSTEMS',
    title: 'LIGHT,\nREFINED.',
    subtitle: 'Bespoke architectural lighting systems engineered for exceptional spaces.',
    ctaText: 'EXPLORE COLLECTIONS',
    ctaHref: '/products',
    imageUrl: '/media/hero-slide-1.webp',
    imageAlt: 'Bespoke pendant luminaire illuminating warm dining table overlooking ocean twilight',
    order: 1,
  },
  {
    id: 'hero-2',
    slotId: 'hero-slide-2',
    eyebrow: 'PRECISION OPTICAL CRAFT',
    title: 'SPACE,\nDEFINED.',
    subtitle: 'Micro-aperture linear wall grazers and dark-light downlights for monolithic architecture.',
    ctaText: 'DISCOVER DRY GOODS',
    ctaHref: '/dry-goods',
    imageUrl: '/media/hero-slide-2.webp',
    imageAlt: 'Continuous linear lighting grazing architectural travertine wall',
    order: 2,
  },
  {
    id: 'hero-3',
    slotId: 'hero-slide-3',
    eyebrow: 'IP68 SUBMERSIBLE SYSTEMS',
    title: 'FORM,\nENDURING.',
    subtitle: 'Marine-grade in-ground facade projectors crafted for extreme subterranean resilience.',
    ctaText: 'DISCOVER WET GOODS',
    ctaHref: '/wet-goods',
    imageUrl: '/media/hero-slide-3.webp',
    imageAlt: 'Articulated architectural bronze projectors illuminating water and facade',
    order: 3,
  },
];

/** Projects live only in the database. Nothing is bundled with the code. */
export const DEFAULT_PROJECTS: ProjectConfig[] = [];

export const DEFAULT_CONTACT: ContactConfig = {
  heading: 'Contact us',
  teamNotice: 'Our architectural lighting team will be delighted to assist you.',
  description:
    'If you would like more information about our products or services, or wish to make a technical or commercial enquiry, please contact us using the form below.',
  contactPerson: '',
  companyName: 'Kirtee & Associates Studio',
  addressLine1: 'Level 14, Tower 3, One International Centre',
  addressLine2: 'Senapati Bapat Marg, Prabhadevi, Mumbai 400013, India',
  whatsappNumber: '+91 70969 62640',
  whatsappMessage: 'Hello Kirtee & Associates, I would like to consult on architectural luminaires for an upcoming project.',
  inquiryEmail: '',
  phoneNumber: '',
  studioAddress: 'Level 14, Tower 3, One International Centre, Senapati Bapat Marg, Prabhadevi, Mumbai 400013, India',
  businessHours: 'Monday – Friday: 09:30 to 18:30 IST',
  instagramUrl: 'https://instagram.com/kirteeandassoc',
  linkedinUrl: 'https://linkedin.com/company/kirteeandassoc',
};

export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  showOnWebsite: false, // Default to false as requested by user until photography is uploaded
};

export const DEFAULT_PHILOSOPHY: PhilosophyConfig = {
  eyebrow: 'OUR ARCHITECTURAL PHILOSOPHY',
  headline: "WE DON'T JUST LIGHT SPACES. WE DEFINE THEM.",
  narrative:
    'From architectural specifications to bespoke luminaire adaptations, Kirtee & Associates engineers lighting systems designed seamlessly around the architecture they inhabit.',
  pillars: [
    {
      num: '01',
      title: 'EXPERTISE',
      description: 'Specification-led engineering for complex architectural and commercial requirements.',
    },
    {
      num: '02',
      title: 'GLOBAL REACH',
      description: 'An established specification network spanning architects, designers and premier manufacturers.',
    },
    {
      num: '03',
      title: 'PRECISION',
      description: 'Technical photometrics, low glare (UGR < 10), and certified engineering without compromising aesthetic purity.',
    },
    {
      num: '04',
      title: 'EXPERIENCE',
      description: 'Extensive portfolio of bespoke luminaire solutions specified across prestigious architecture worldwide.',
    },
  ],
};

export const DEFAULT_WHY_CHOOSE_US: WhyChooseUsConfig = {
  eyebrow: 'WHY CHOOSE US',
  headline: 'ARCHITECTURAL RIGOR. UNCOMPROMISING FIDELITY.',
  description:
    'Every luminaire in our dry and wet architectural collections represents decades of precision optical physics, noble metallurgy, and exacting Swiss & Italian engineering standards.',
  pillars: [
    {
      id: 'p1',
      num: '01',
      tag: 'BESPOKE TAILORING',
      title: 'Custom Spatial Geometry',
      metric: '100% Tailored',
      description: 'Custom lengths, mounting junctions, and RAL finishes engineered to your architectural drawings.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'p2',
      num: '02',
      tag: 'OPTICAL PRECISION',
      title: 'Zero-Glare Purity',
      metric: 'UGR < 10',
      description: 'Micro-engineered fractal apertures delivering absolute visual comfort with CRI 90+ spectral fidelity.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'p3',
      num: '03',
      tag: 'NOBLE METALLURGY',
      title: 'Architectural Alloys',
      metric: '6063-T6 & Brass',
      description: 'CNC-milled structural aluminium and hand-turned solid brass built to microscopic mechanical tolerances.',
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'p4',
      num: '04',
      tag: 'CERTIFIED ENDURANCE',
      title: 'Submersible Rigor',
      metric: 'IP68 & 50,000h',
      description: 'Hermetically sealed for wet architectural environments, backed by LM-79 and LM-80 laboratory certification.',
      image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85',
    },
  ],
};

export const DEFAULT_PROCESS: ProcessConfig = {
  eyebrow: 'BESPOKE COMMISSIONING & ENGINEERING',
  headline: 'FROM CONCEPT TO MONUMENTAL REALIZATION.',
  steps: [
    {
      slotId: 'process-step-1',
      number: '.01',
      title: 'Design Thinking',
      description:
        'From concept or sketch, all the way to the final installation, the process is collaborative to ensure your vision is fully realized.',
      image: '/images/bespoke/01-design-thinking.jpg',
      imageAlt: 'Architectural lighting design concept',
    },
    {
      slotId: 'process-step-2',
      number: '.02',
      title: 'Prototyping',
      description:
        'Merging technology and emotion, we integrate light into architecture and nature, bringing a sophisticated poetic sensibility to our designs and creations.',
      image: '/images/bespoke/02-prototyping.jpg',
      imageAlt: 'Precision linear optical prototype',
    },
    {
      slotId: 'process-step-3',
      number: '.03',
      title: 'Realization',
      description:
        'Form, function, and performance drive each creation, aided by the most advanced technologies and processes.',
      image: '/images/bespoke/03-realization.jpg',
      imageAlt: 'Master artisanal luminaire realization',
    },
    {
      slotId: 'process-step-4',
      number: '.04',
      title: 'Installation',
      description:
        'As a full-service partner, Kirtee & Associates believes in providing support and specialized engineering assistance from inception to commissioning.',
      image: '/images/bespoke/04-installation.jpg',
      imageAlt: 'Monolithic gallery architectural lighting installation',
    },
  ],
};

export const DEFAULT_PROJECT_CTA: ProjectCtaConfig = {
  eyebrow: "LET'S WORK TOGETHER",
  headline: 'HAVE A PROJECT IN MIND?',
  description: 'Our specification team is here to help you bring your vision to life.',
  buttonText: 'Schedule Consultation',
  buttonHref: '/contact',
  imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1400&q=80',
  imageAlt: 'Architectural space with marble steps and indirect lighting',
};

export interface TypographyConfig {
  // 1. Headings (H1, H2, Hero titles, Large display text)
  headingFont: string;
  headingCustomFont?: string;
  headingWeight: '300' | '400' | '500' | '600' | '700';
  headingScale: 'compact' | 'normal' | 'large' | 'grand'; // 0.9, 1.0, 1.12, 1.25
  headingLetterSpacing: 'tight' | 'normal' | 'wide' | 'ultra-wide'; // -0.02em, 0, 0.04em, 0.12em
  headingTransform: 'none' | 'uppercase' | 'capitalize';

  // 2. Subheadings (H3, H4, Product Titles, Card Titles)
  subheadingFont: string;
  subheadingCustomFont?: string;
  subheadingWeight: '400' | '500' | '600' | '700';
  subheadingLetterSpacing: 'tight' | 'normal' | 'wide';

  // 3. Body & Content Text (Paragraphs, Descriptions, Specs, Modals, Forms)
  bodyFont: string;
  bodyCustomFont?: string;
  bodyBaseSize: '14px' | '15px' | '16px' | '17px' | '18px';
  bodyLineHeight: '1.4' | '1.5' | '1.6' | '1.7';

  // 4. Brand Logo & Header Navigation
  brandFont: string;
  brandCustomFont?: string;
  brandLetterSpacing: 'normal' | 'wide' | 'extra-wide'; // 0.08em, 0.14em, 0.22em
  navFont: string;
  navCustomFont?: string;
  navSize: '11px' | '12px' | '13px' | '14px';
  navLetterSpacing: 'normal' | 'wide' | 'extra-wide'; // 0.08em, 0.14em, 0.2em

  // 5. Technical Badges, Eyebrows & Specs (Monospace elements, Item counters)
  accentFont: string;
  accentCustomFont?: string;
  accentLetterSpacing: 'normal' | 'wide' | 'extra-wide'; // 0.14em, 0.22em, 0.3em
}

export const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  headingFont: 'Cinzel',
  headingWeight: '500',
  headingScale: 'normal',
  headingLetterSpacing: 'normal',
  headingTransform: 'none',

  subheadingFont: 'Inter',
  subheadingWeight: '600',
  subheadingLetterSpacing: 'normal',

  bodyFont: 'Inter',
  bodyBaseSize: '16px',
  bodyLineHeight: '1.5',

  brandFont: 'Inter',
  brandLetterSpacing: 'wide',
  navFont: 'Inter',
  navSize: '12px',
  navLetterSpacing: 'wide',

  accentFont: 'JetBrains Mono',
  accentLetterSpacing: 'wide',
};


// ---------------------------------------------------------------------------
// Typography sanitising (font names end up inside a <style> tag and a Google Fonts URL,
// so only plain font-name characters are allowed)
// ---------------------------------------------------------------------------
const FONT_NAME_RE = /^[A-Za-z0-9_-][A-Za-z0-9 _-]{0,59}$/;

export function sanitizeFontName(value: unknown, fallback: string): string {
  return typeof value === 'string' && FONT_NAME_RE.test(value.trim()) ? value.trim() : fallback;
}

export function sanitizeTypography(input: unknown): TypographyConfig {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = { ...DEFAULT_TYPOGRAPHY };
  for (const [k, v] of Object.entries(raw)) {
    if (!(k in DEFAULT_TYPOGRAPHY) && !k.endsWith('CustomFont')) continue;
    if (/Font$/.test(k) || /CustomFont$/.test(k)) {
      const fallback = (DEFAULT_TYPOGRAPHY as unknown as Record<string, unknown>)[k];
      if (v === '' || v === undefined || v === null) {
        if (/CustomFont$/.test(k)) out[k] = '';
        continue;
      }
      out[k] = sanitizeFontName(v, typeof fallback === 'string' ? fallback : '');
    } else if (typeof v === 'string' && /^[A-Za-z0-9.\- ]{1,24}$/.test(v)) {
      out[k] = v;
    }
  }
  return out as unknown as TypographyConfig;
}

// ---------------------------------------------------------------------------
// Brand (name + logo), editable from the admin console ("Brand & Logo")
// ---------------------------------------------------------------------------
export interface BrandConfig {
  /** Shown in the header, footer, copyright line, page titles and search-engine data */
  brandName: string;
  /** Small line under the name in the header, e.g. "Architectural Lighting" (optional) */
  tagline: string;
  /** Logo image: "" = text only. A /media/... path or an https:// URL. */
  logoUrl: string;
  logoAlt: string;
  logoSize: 'small' | 'medium' | 'large';
  /** When a logo is set, also show the brand name next to it */
  showNameWithLogo: boolean;
}

export const DEFAULT_BRAND: BrandConfig = {
  brandName: 'Kirtee & Associates',
  tagline: 'Architectural Lighting',
  logoUrl: '',
  logoAlt: '',
  logoSize: 'medium',
  showNameWithLogo: false,
};

export function isSafeLogoUrl(url: string): boolean {
  return url === '' || ((/^\/(?!\/)/.test(url) || /^https:\/\//.test(url)) && url.length <= 2048);
}

/** Clamp every field to a safe shape (used when saving and when reading). */
export function sanitizeBrand(input: unknown): BrandConfig {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const str = (v: unknown, max: number, fallback: string) =>
    typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, '').trim().slice(0, max) : fallback;
  const name = str(raw.brandName, 80, DEFAULT_BRAND.brandName);
  const logoUrl = typeof raw.logoUrl === 'string' && isSafeLogoUrl(raw.logoUrl.trim()) ? raw.logoUrl.trim() : '';
  return {
    brandName: name || DEFAULT_BRAND.brandName,
    tagline: str(raw.tagline, 60, DEFAULT_BRAND.tagline),
    logoUrl,
    logoAlt: str(raw.logoAlt, 120, ''),
    logoSize: raw.logoSize === 'small' || raw.logoSize === 'large' ? raw.logoSize : 'medium',
    showNameWithLogo: raw.showNameWithLogo === true,
  };
}
