export interface ProductSpecification {
  id: string;
  label: string;
  value: string;
  unit?: string;
  group?: 'Optical' | 'Electrical' | 'Physical' | 'Mounting' | 'Photometric' | 'General';
}

export interface ProductDownload {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'PDF' | 'IES' | 'LDT' | 'BIM' | 'CAD' | 'DOC';
  fileSize?: string;
  description?: string;
  versionDate?: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  heroImage?: string;
  order?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  tagline?: string;
  shortDescription: string;
  fullDescription: string;
  category: ProductCategory;
  catalogType?: 'dry' | 'wet';
  designer?: string;
  codeLabel?: string;
  mosaicSpan?: number;
  editorialStory?: string;
  subcategory?: string;
  tags?: string[];
  status: 'published' | 'draft' | 'archived';
  isFeatured?: boolean;
  order?: number;
  
  // Media
  heroImage: ProductImage;
  heroCarouselImages?: ProductImage[]; // Top subpage hero carousel slider images
  gallery: ProductImage[];

  // Technical Specifications & Downloads
  specifications: ProductSpecification[];
  downloads: ProductDownload[];
  
  // Product Specific Social Links
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };

  // Customizable Subpage Section Overrides (Zero-hardcoding)
  brochureButtonText?: string;
  specsEyebrow?: string;
  specsHeading?: string;
  specsDescription?: string;
  galleryEyebrow?: string;
  galleryHeading?: string;
  galleryDescription?: string;
  relatedHeading?: string;

  // Product Relationships
  relatedProductSlugs?: string[];

  // SEO metadata
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
    noIndex?: boolean;
  };

  createdAt: string;
  updatedAt: string;
}
