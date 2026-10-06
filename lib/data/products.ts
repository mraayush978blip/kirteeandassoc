import { Product, ProductCategory } from '@/types/product';

export const categories: ProductCategory[] = [
  {
    id: 'cat-inground',
    slug: 'in-ground',
    name: 'In-Ground & Recessed Systems',
    description: 'Precision drive-over and walk-over architectural ground luminaires designed for facade grazing, pathways, and landscape perimeters.',
    order: 1,
  },
  {
    id: 'cat-grazers',
    slug: 'linear-grazers',
    name: 'Linear Grazers & Profiles',
    description: 'Continuous linear lighting systems engineered with proprietary wall-grazing optical matrices for vertical surface reveals.',
    order: 2,
  },
  {
    id: 'cat-projectors',
    slug: 'architectural-projectors',
    name: 'Architectural Projectors',
    description: 'Compact optical spotlights featuring variable beam angles, glare snoots, and high-purity framing shutters.',
    order: 3,
  },
  {
    id: 'cat-downlights',
    slug: 'downlights',
    name: 'Recessed Downlights',
    description: 'Ultra-low glare dark-light architectural downlights designed for discreet integration into ceiling plenums.',
    order: 4,
  },
  {
    id: 'cat-bespoke',
    slug: 'bespoke-commissions',
    name: 'Bespoke Luminaire Engineering',
    description: 'Custom engineered luminaires tailored specifically to signature architectural briefs and heritage restoration projects.',
    order: 5,
  },
];

export const products: Product[] = [
  {
    id: 'prod-ingraze-frame-1000',
    name: 'Ingraze Frame 1000',
    slug: 'ingraze-frame-1000',
    sku: 'KA-IG-1000-F',
    tagline: 'Precision In-Ground Recessed Linear Optical Grazer',
    shortDescription: 'High-performance flush-mounted in-ground architectural luminaire engineered for grazing facades up to 14 meters with zero stray light.',
    fullDescription: `The Ingraze Frame 1000 represents the pinnacle of linear ground illumination. Crafted from marine-grade extruded aluminium with a 316L stainless steel bezel, it delivers continuous, uniform vertical grazing with exceptional cutoff and glare control.

Designed specifically to meet demanding architectural standards, this system integrates high-efficiency TIR lens arrays with tilt-adjustable optical modules. The double-cavity IP68 sealing chamber ensures lifetime resilience against subterranean humidity, water ingress, and seasonal temperature cycling.`,
    category: categories[0],
    subcategory: 'Drive-over Linear',
    tags: ['Inground', 'Facade Grazing', 'IP68', 'DALI-2', 'Stainless Steel 316L'],
    status: 'published',
    isFeatured: true,
    order: 1,
    heroImage: {
      id: 'img-ingraze-1',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      alt: 'Ingraze Frame 1000 flush architectural ground fixture grazing monolithic stone wall',
      caption: 'Ingraze Frame 1000 installed flush along an architectural travertine facade',
      isPrimary: true,
    },
    gallery: [
      {
        id: 'img-ingraze-1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        alt: 'Ingraze Frame 1000 grazing facade at twilight',
      },
      {
        id: 'img-ingraze-2',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
        alt: 'Ingraze Frame optical head detail and stainless steel bezel',
      },
      {
        id: 'img-ingraze-3',
        url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
        alt: 'Atmospheric night illumination demonstrating vertical beam uniformity',
      },
    ],
    specifications: [
      { id: 's1', label: 'Luminous Flux', value: '4,850', unit: 'lm', group: 'Optical' },
      { id: 's2', label: 'System Efficacy', value: '118', unit: 'lm/W', group: 'Optical' },
      { id: 's3', label: 'Color Temperature (CCT)', value: '2700K / 3000K / 4000K / Tunable White', group: 'Optical' },
      { id: 's4', label: 'Color Rendering Index (CRI)', value: 'CRI 95+ (R9 > 85)', group: 'Optical' },
      { id: 's5', label: 'Beam Distribution', value: '10° × 45° Asymmetric Graze / 15° Narrow / 30° Medium', group: 'Optical' },
      { id: 's6', label: 'Power Consumption', value: '41', unit: 'W', group: 'Electrical' },
      { id: 's7', label: 'Supply Voltage', value: '220–240V AC, 50/60Hz', group: 'Electrical' },
      { id: 's8', label: 'Control Protocol', value: 'DALI-2 / 0-10V / DMX512 / Casambi BLE', group: 'Electrical' },
      { id: 's9', label: 'Ingress Protection', value: 'IP68 (continuous immersion 1.5m)', group: 'Physical' },
      { id: 's10', label: 'Impact Resistance', value: 'IK10 (20 Joules)', group: 'Physical' },
      { id: 's11', label: 'Load Rating', value: 'Drive-over up to 4,500 kg at 30 km/h', group: 'Physical' },
      { id: 's12', label: 'Housing & Trim', value: 'Extruded 6060 Aluminium, 316L Marine Stainless Bezel', group: 'Physical' },
      { id: 's13', label: 'Dimensions', value: '1000 × 72 × 95', unit: 'mm', group: 'Physical' },
    ],
    downloads: [
      {
        id: 'd1',
        title: 'Technical Specification Datasheet',
        fileUrl: '#',
        fileType: 'PDF',
        fileSize: '2.4 MB',
        description: 'Comprehensive electrical, optical, and dimensional specification sheet.',
        versionDate: '2026.1',
      },
      {
        id: 'd2',
        title: 'Photometric Data Package (IES / LDT)',
        fileUrl: '#',
        fileType: 'IES',
        fileSize: '480 KB',
        description: 'Goniophotometric distribution profiles for Dialux and Relux calculation.',
        versionDate: '2026.1',
      },
      {
        id: 'd3',
        title: 'BIM Revit & 3D CAD Archive',
        fileUrl: '#',
        fileType: 'CAD',
        fileSize: '8.2 MB',
        description: 'Native Revit BIM family with electrical connector parameters and 3D step files.',
        versionDate: '2026.1',
      },
      {
        id: 'd4',
        title: 'Installation & Recessed Housing Guide',
        fileUrl: '#',
        fileType: 'PDF',
        fileSize: '3.1 MB',
        description: 'Drainage requirements, ground sleeve preparation, and cable connection manual.',
        versionDate: '2026.1',
      },
    ],
    relatedProductSlugs: ['veloce-40-wall-grazer', 'aura-spot-75', 'stria-facade-1200'],
    seo: {
      metaTitle: 'Ingraze Frame 1000 | Recessed In-Ground Architectural Grazer',
      metaDescription: 'Discover the Ingraze Frame 1000: an IP68 drive-over linear luminaire engineered for precision architectural facade grazing by Kirtee & Associates.',
      ogImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'prod-veloce-40-wall-grazer',
    name: 'Veloce 40 Trimless Grazer',
    slug: 'veloce-40-wall-grazer',
    sku: 'KA-VG-040-TR',
    tagline: 'Micro-Aperture Continuous Ceiling Recessed Grazer',
    shortDescription: 'Monolithic trimless ceiling-recessed linear optical grazer that highlights vertical architectural textures from an unseen 40mm slot.',
    fullDescription: `The Veloce 40 system disappears completely into ceiling architecture, revealing only an uninterrupted wash of light across perimeter walls. Designed for interior galleries, luxury lobbies, and corporate headquarters.

Featuring custom-engineered TIR micro-optics and anti-glare honeycomb louvers, Veloce delivers a cutoff angle exceeding 45 degrees, guaranteeing total visual comfort without glare for occupants below.`,
    category: categories[1],
    subcategory: 'Trimless Linear Grazer',
    tags: ['Trimless', 'Ceiling Recessed', 'UGR<10', 'Interior Architectural', 'Micro Aperture'],
    status: 'published',
    isFeatured: true,
    order: 2,
    heroImage: {
      id: 'img-veloce-1',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
      alt: 'Veloce 40 trimless linear grazer lighting textured architectural concrete',
      caption: 'Continuous Veloce 40 installation grazing an 8-meter fluted stone gallery wall',
      isPrimary: true,
    },
    gallery: [
      {
        id: 'img-veloce-1',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
        alt: 'Veloce 40 grazing wall texture',
      },
      {
        id: 'img-veloce-2',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        alt: 'Trimless plaster-in profile detail showing seamless integration',
      },
    ],
    specifications: [
      { id: 'vs1', label: 'Luminous Output', value: '3,200', unit: 'lm/m', group: 'Optical' },
      { id: 'vs2', label: 'Efficacy', value: '112', unit: 'lm/W', group: 'Optical' },
      { id: 'vs3', label: 'Unified Glare Rating', value: 'UGR < 10 (High Visual Comfort)', group: 'Optical' },
      { id: 'vs4', label: 'Color Rendering Index', value: 'CRI 98 (R9 > 92, Rf 96, Rg 102)', group: 'Optical' },
      { id: 'vs5', label: 'Optical Profile', value: '8° × 50° Wall Graze Optic with Baffle', group: 'Optical' },
      { id: 'vs6', label: 'System Wattage', value: '28.5', unit: 'W/m', group: 'Electrical' },
      { id: 'vs7', label: 'Dimming Protocols', value: 'DALI-2 DT8 / Lutron Ecosystem / 0-10V', group: 'Electrical' },
      { id: 'vs8', label: 'Aperture Width', value: '40', unit: 'mm', group: 'Physical' },
      { id: 'vs9', label: 'Profile Construction', value: 'Precision CNC 6063-T5 Aluminium Extrusion', group: 'Physical' },
      { id: 'vs10', label: 'Finish', value: 'Plaster-in Matte Black Cavity / Champagne Trim', group: 'Physical' },
    ],
    downloads: [
      {
        id: 'vd1',
        title: 'Veloce 40 Technical Datasheet',
        fileUrl: '#',
        fileType: 'PDF',
        fileSize: '1.9 MB',
        description: 'Complete optical run lengths, corner connectors, and driver selection.',
      },
      {
        id: 'vd2',
        title: 'Photometric Files Package',
        fileUrl: '#',
        fileType: 'IES',
        fileSize: '320 KB',
        description: 'IES and EULUMDAT files for architectural lighting design software.',
      },
    ],
    relatedProductSlugs: ['ingraze-frame-1000', 'atelier-oculus-90'],
    seo: {
      metaTitle: 'Veloce 40 Trimless Grazer | Kirtee & Associates',
      metaDescription: 'Explore the Veloce 40 micro-aperture continuous trimless ceiling grazer, designed for glare-free architectural wall washing.',
    },
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-03-18T14:00:00Z',
  },
  {
    id: 'prod-aura-spot-75',
    name: 'Aura Spot 75 Architectural Projector',
    slug: 'aura-spot-75',
    sku: 'KA-PR-075-AD',
    tagline: 'Articulated Micro-Projector with Dynamic Zoom Optics',
    shortDescription: 'Compact high-definition architectural spotlight with adjustable beam angles from 9° to 45°, designed for sculptures, facades, and focal accents.',
    fullDescription: `The Aura Spot 75 is an exacting optical projector engineered for precision accentuation. Constructed from forged brass and marine aluminium, it features continuous 360° rotation and 120° tilt locking with calibrated mechanical dial gauges.

Equipped with an integrated front accessory bezel supporting dichroic color filters, linear spreading lenses, and anti-glare honeycomb snoots.`,
    category: categories[2],
    subcategory: 'Adjustable Spotlight',
    tags: ['Spotlight', 'Adjustable Beam', 'IP67', 'Bronze Finish', 'High CRI'],
    status: 'published',
    isFeatured: true,
    order: 3,
    heroImage: {
      id: 'img-aura-1',
      url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1600&q=80',
      alt: 'Aura Spot 75 articulated projector finished in aged architectural bronze',
      caption: 'Aura Spot 75 highlighting outdoor bronze sculpture with 12° crisp beam',
      isPrimary: true,
    },
    gallery: [
      {
        id: 'img-aura-1',
        url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1600&q=80',
        alt: 'Aura Spot 75 exterior sculpture illumination',
      },
      {
        id: 'img-aura-2',
        url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
        alt: 'Mechanical knuckle and dial detail',
      },
    ],
    specifications: [
      { id: 'as1', label: 'Light Output', value: '2,400', unit: 'lm', group: 'Optical' },
      { id: 'as2', label: 'Dynamic Beam Angle', value: '9° – 45° Stepless Dial Zoom', group: 'Optical' },
      { id: 'as3', label: 'Color Consistency', value: 'MacAdam 2-Step Ellipse (SDCM < 2)', group: 'Optical' },
      { id: 'as4', label: 'Rated Power', value: '24', unit: 'W', group: 'Electrical' },
      { id: 'as5', label: 'Driver Configuration', value: 'Remote 48V DC / 700mA Constant Current', group: 'Electrical' },
      { id: 'as6', label: 'Ingress Protection', value: 'IP67 / IK08', group: 'Physical' },
      { id: 'as7', label: 'Finishes Available', value: 'Aged Brushed Brass, Obsidian Anodized, Satin Bronze', group: 'Physical' },
    ],
    downloads: [
      {
        id: 'ad1',
        title: 'Aura Spot 75 Spec Sheet',
        fileUrl: '#',
        fileType: 'PDF',
        fileSize: '1.6 MB',
      },
      {
        id: 'ad2',
        title: 'IES Photometric Data',
        fileUrl: '#',
        fileType: 'IES',
        fileSize: '210 KB',
      },
    ],
    relatedProductSlugs: ['ingraze-frame-1000', 'stria-facade-1200'],
    seo: {
      metaTitle: 'Aura Spot 75 Projector | Kirtee & Associates',
      metaDescription: 'Precision architectural projector with stepless zoom optics and IP67 weather sealing by Kirtee & Associates.',
    },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-21T11:00:00Z',
  },
  {
    id: 'prod-atelier-oculus-90',
    name: 'Atelier Oculus 90 Deep Recessed Downlight',
    slug: 'atelier-oculus-90',
    sku: 'KA-DL-090-OC',
    tagline: 'Ultra-Deep Regressed Architectural Downlight',
    shortDescription: 'Regressed architectural downlight with dark-light reflector geometry and field-interchangeable optics for high-end residential and hotel suites.',
    fullDescription: `Engineered around the concept of invisible illumination, the Atelier Oculus 90 features a 60mm regressed light source shielded by a faceted champagne or specular black parabolic reflector. 

Occupants experience warm, richly rendered architectural light across tabletops, textures, and floors without perceiving the light source directly.`,
    category: categories[3],
    subcategory: 'Deep Regressed Downlight',
    tags: ['Downlight', 'Low Glare', 'Dark Light', 'Warm Dim', 'Hospitality'],
    status: 'published',
    isFeatured: true,
    order: 4,
    heroImage: {
      id: 'img-oculus-1',
      url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
      alt: 'Atelier Oculus 90 installed in minimalist timber ceiling',
      caption: 'Atelier Oculus 90 creating dramatic low-glare pools of illumination in an executive gallery',
      isPrimary: true,
    },
    gallery: [
      {
        id: 'img-oculus-1',
        url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
        alt: 'Oculus downlight in ceiling',
      },
    ],
    specifications: [
      { id: 'os1', label: 'Luminous Output', value: '1,850', unit: 'lm', group: 'Optical' },
      { id: 'os2', label: 'Glare Cutoff Angle', value: '55° Direct Visual Cutoff', group: 'Optical' },
      { id: 'os3', label: 'Color Rendering Index', value: 'CRI 98 (R9 > 95)', group: 'Optical' },
      { id: 'os4', label: 'Warm Dim Range', value: '3000K down to 1800K candle-like glow', group: 'Optical' },
      { id: 'os5', label: 'Power Consumption', value: '18', unit: 'W', group: 'Electrical' },
      { id: 'os6', label: 'Ceiling Cutout', value: 'Ø 90', unit: 'mm', group: 'Physical' },
      { id: 'os7', label: 'Installation Frame', value: 'Trimless Plaster-in / Flanged Bezel', group: 'Physical' },
    ],
    downloads: [
      {
        id: 'od1',
        title: 'Oculus 90 Technical Specification',
        fileUrl: '#',
        fileType: 'PDF',
        fileSize: '1.8 MB',
      },
    ],
    relatedProductSlugs: ['veloce-40-wall-grazer', 'aura-spot-75'],
    seo: {
      metaTitle: 'Atelier Oculus 90 Downlight | Kirtee & Associates',
      metaDescription: 'Explore the Atelier Oculus 90 deep regressed dark-light downlight for luxury hospitality and residence projects.',
    },
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z',
  },
  {
    id: 'prod-stria-facade-1200',
    name: 'Stria Façade 1200 Exterior Grazer',
    slug: 'stria-facade-1200',
    sku: 'KA-SF-1200-EX',
    tagline: 'High-Output Surface-Mounted Architectural Wall Grazer',
    shortDescription: 'Heavy-duty linear architectural projector for exterior elevations, monumental colonnades, and public infrastructure.',
    fullDescription: `The Stria Façade 1200 is built to withstand extreme exterior conditions while delivering uniform optical throws exceeding 20 meters. With CNC-machined anti-reflective tempered glass and an intelligent thermal feedback loop, it ensures multi-decade optical stability.`,
    category: categories[1],
    subcategory: 'Surface Exterior Grazer',
    tags: ['Exterior', 'Facade', 'IP67', 'Long Throw', 'High Output'],
    status: 'published',
    isFeatured: false,
    order: 5,
    heroImage: {
      id: 'img-stria-1',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      alt: 'Stria Façade illuminating stone colonnade',
      caption: 'Monumental exterior illumination using Stria Façade 1200',
      isPrimary: true,
    },
    gallery: [
      {
        id: 'img-stria-1',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
        alt: 'Colonnade lighting at dusk',
      },
    ],
    specifications: [
      { id: 'st1', label: 'Output Flux', value: '7,200', unit: 'lm', group: 'Optical' },
      { id: 'st2', label: 'System Wattage', value: '65', unit: 'W', group: 'Electrical' },
      { id: 'st3', label: 'Ingress Protection', value: 'IP67 / IK09', group: 'Physical' },
      { id: 'st4', label: 'Finish', value: 'Corrosion-Resistant Architectural Charcoal Powder Coat', group: 'Physical' },
    ],
    downloads: [
      {
        id: 'std1',
        title: 'Stria Façade 1200 Datasheet',
        fileUrl: '#',
        fileType: 'PDF',
        fileSize: '2.1 MB',
      },
    ],
    relatedProductSlugs: ['ingraze-frame-1000', 'aura-spot-75'],
    seo: {
      metaTitle: 'Stria Façade 1200 Exterior Grazer | Kirtee & Associates',
      metaDescription: 'Stria Façade 1200 surface mounted architectural wall grazer for high elevations and monumental stonework.',
    },
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-03-12T16:00:00Z',
  },
];

// Helper functions for retrieval, search, filtering
export function getAllProducts(): Product[] {
  return products.filter((p) => p.status === 'published');
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.status === 'published' && p.isFeatured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.status === 'published');
}

export function getRelatedProducts(product: Product): Product[] {
  if (product.relatedProductSlugs && product.relatedProductSlugs.length > 0) {
    const manualMatches = products.filter((p) => product.relatedProductSlugs?.includes(p.slug));
    if (manualMatches.length > 0) return manualMatches;
  }
  // Fallback to same category
  return products
    .filter((p) => p.slug !== product.slug && p.category.slug === product.category.slug)
    .slice(0, 3);
}

export function searchProducts(query: string, categorySlug?: string): Product[] {
  const q = query.toLowerCase().trim();
  return products.filter((product) => {
    if (product.status !== 'published') return false;
    if (categorySlug && categorySlug !== 'all' && product.category.slug !== categorySlug) {
      return false;
    }
    if (!q) return true;
    const matchesName = product.name.toLowerCase().includes(q);
    const matchesSku = product.sku.toLowerCase().includes(q);
    const matchesDesc = product.shortDescription.toLowerCase().includes(q);
    const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(q));
    const matchesSpecs = product.specifications.some(
      (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
    );
    return matchesName || matchesSku || matchesDesc || matchesTags || matchesSpecs;
  });
}
