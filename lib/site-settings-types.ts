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
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
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
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
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
    imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=2000&q=85',
    imageAlt: 'Articulated architectural bronze projectors illuminating water and facade',
    order: 3,
  },
];

export const DEFAULT_PROJECTS: ProjectConfig[] = [
  {
    id: 'proj-1',
    num: '01',
    title: 'PRIVATE RESIDENCE',
    location: 'Mumbai, India',
    category: 'Residential',
    year: '2025',
    description: 'Precision recessed linear grazing and bespoke bronze pendant luminaires accentuating monolithic limestone walls.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    slug: 'private-residence-mumbai',
    order: 1,
    isFeatured: true,
  },
  {
    id: 'proj-2',
    num: '02',
    title: 'BOUTIQUE HOTEL',
    location: 'Dubai, UAE',
    category: 'Hospitality',
    year: '2024',
    description: 'Custom acoustic luminaire arrays delivering warm glare-free ambient illumination in double-height atrium.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    slug: 'boutique-hotel-dubai',
    order: 2,
    isFeatured: true,
  },
  {
    id: 'proj-3',
    num: '03',
    title: 'ARCHITECTURAL INTERIOR',
    location: 'London, UK',
    category: 'Commercial',
    year: '2024',
    description: 'Ultra-low glare UGR < 10 downlight arrays integrated invisibly within acoustic architectural timber slats.',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    slug: 'architectural-interior-london',
    order: 3,
    isFeatured: true,
  },
  {
    id: 'proj-4',
    num: '04',
    title: 'CULTURAL PAVILION',
    location: 'Milan, Italy',
    category: 'Cultural',
    year: '2025',
    description: 'Dynamic tunable white grazing systems engineered for gallery exhibition spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    slug: 'cultural-pavilion-milan',
    order: 4,
    isFeatured: true,
  },
];

export const DEFAULT_CONTACT: ContactConfig = {
  heading: 'Contact us',
  teamNotice: 'Our architectural lighting team will be delighted to assist you.',
  description:
    'If you would like more information about our products or services, or wish to make a technical or commercial enquiry, please contact us using the form below.',
  contactPerson: 'Divvya',
  companyName: 'Kirtee & Associates Studio',
  addressLine1: 'Level 14, Tower 3, One International Centre',
  addressLine2: 'Senapati Bapat Marg, Prabhadevi, Mumbai 400013, India',
  whatsappNumber: '+91 70969 62640',
  whatsappMessage: 'Hello Kirtee & Associates, I would like to consult on architectural luminaires for an upcoming project.',
  inquiryEmail: 'inquiries@kirteeandassoc.com',
  phoneNumber: '+91 70969 62640',
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
