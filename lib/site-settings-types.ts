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
  whatsappNumber: '+919820000000',
  whatsappMessage: 'Hello Zenvora Architectural Lighting team, I would like to consult on architectural luminaires for an upcoming project.',
  inquiryEmail: 'inquiries@zenvora.com',
  phoneNumber: '+91 22 2490 0000',
  studioAddress: 'Level 14, Tower 3, One International Centre, Senapati Bapat Marg, Prabhadevi, Mumbai 400013, India',
  businessHours: 'Monday – Friday: 09:30 to 18:30 IST',
  instagramUrl: 'https://instagram.com/zenvora.lighting',
  linkedinUrl: 'https://linkedin.com/company/zenvora-architectural',
};

export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  showOnWebsite: false, // Default to false as requested by user until photography is uploaded
};
