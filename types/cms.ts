import { Product } from './product';

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
  children?: NavLink[];
}

export interface SiteNavigation {
  brandName: string;
  logoUrl?: string;
  links: NavLink[];
  ctaButton?: {
    label: string;
    href: string;
  };
}

export interface FooterConfig {
  tagline: string;
  addressLines: string[];
  telephone: string;
  email: string;
  socialLinks: {
    platform: 'instagram' | 'linkedin' | 'youtube' | 'twitter';
    url: string;
    label: string;
  }[];
  quickLinks: { label: string; href: string }[];
  legalLinks: { label: string; href: string }[];
  copyright: string;
}

export interface HeroSectionData {
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  mediaType: 'image' | 'video';
  mediaUrl: string;
  posterUrl?: string;
}

export interface BrandIntroSectionData {
  eyebrow: string;
  title: string;
  statement: string;
  details: string;
  stats?: { value: string; label: string }[];
}

export interface FeaturedProductsSectionData {
  eyebrow: string;
  title: string;
  subtitle: string;
  productSlugs: string[];
}

export interface StorytellingSectionData {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  aspectRatio?: string;
  quote?: {
    text: string;
    author: string;
    role: string;
  };
}

export interface CtaSectionData {
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export interface HomePageData {
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  hero: HeroSectionData;
  intro: BrandIntroSectionData;
  featuredProducts: FeaturedProductsSectionData;
  storytelling: StorytellingSectionData;
  cta: CtaSectionData;
}

export interface ContactPageData {
  seo: {
    title: string;
    description: string;
  };
  heading: string;
  subheading: string;
  contactDetails: {
    primaryContactPerson: string;
    phone: string;
    email: string;
    officeAddress: string[];
    businessHours: string;
  };
  formTopics: string[];
}
