import fs from 'fs/promises';
import path from 'path';
import { query } from '@/lib/db';

export interface SiteImageSlot {
  id: string;
  section: 'hero' | 'collections' | 'process' | 'projects' | 'studio';
  label: string;
  description: string;
  url: string;
  alt: string;
  defaultUrl: string;
  recommendedAspect: string;
  updatedAt?: string;
}

export const DEFAULT_SITE_IMAGES: SiteImageSlot[] = [
  // 1. Hero Slides
  {
    id: 'hero-slide-1',
    section: 'hero',
    label: 'Hero Slide 1 (Refined Light)',
    description: 'First impression hero banner showcasing architectural dining luminaire with ocean twilight.',
    url: '/media/hero-slide-1.webp',
    defaultUrl: '/media/hero-slide-1.webp',
    alt: 'Bespoke pendant luminaire illuminating warm dining table overlooking ocean twilight',
    recommendedAspect: '16:9 or 21:9 (2000x1125+)',
  },
  {
    id: 'hero-slide-2',
    section: 'hero',
    label: 'Hero Slide 2 (Space Defined)',
    description: 'Second hero banner highlighting continuous linear grazing over monolithic travertine wall.',
    url: '/media/hero-slide-2.webp',
    defaultUrl: '/media/hero-slide-2.webp',
    alt: 'Continuous linear lighting grazing architectural travertine wall',
    recommendedAspect: '16:9 or 21:9 (2000x1125+)',
  },
  {
    id: 'hero-slide-3',
    section: 'hero',
    label: 'Hero Slide 3 (Form Enduring)',
    description: 'Third hero banner showing IP68 submersible architectural projectors illuminating reflective water.',
    url: '/media/hero-slide-3.webp',
    defaultUrl: '/media/hero-slide-3.webp',
    alt: 'Articulated architectural bronze projectors illuminating water and facade',
    recommendedAspect: '16:9 or 21:9 (2000x1125+)',
  },

  // 2. Collections
  {
    id: 'collection-dry',
    section: 'collections',
    label: 'Dry Goods Collection Banner',
    description: 'Homepage featured collection card for Interior Architectural Downlights & Linear systems.',
    url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1400&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1400&q=80',
    alt: 'Dry Goods architectural interior downlights and linear illumination',
    recommendedAspect: '16:10 (1400x875+)',
  },
  {
    id: 'collection-wet',
    section: 'collections',
    label: 'Wet Goods Collection Banner',
    description: 'Homepage featured collection card for Exterior IP68 Submersible & Marine-Grade In-Ground systems.',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=80',
    alt: 'Wet Goods exterior submersible architectural lighting in landscape pool',
    recommendedAspect: '16:10 (1400x875+)',
  },

  // 3. Flos Bespoke 4-Step Process Section
  {
    id: 'process-step-1',
    section: 'process',
    label: 'Bespoke Step .01: Design Thinking',
    description: 'Exploratory ideation, lighting design sketches, and collaborative architectural concept.',
    url: '/images/bespoke/01-design-thinking.jpg',
    defaultUrl: '/images/bespoke/01-design-thinking.jpg',
    alt: 'Architectural lighting design concept sketch and photometric plan',
    recommendedAspect: '4:3 or 16:9 (1600x1200+)',
  },
  {
    id: 'process-step-2',
    section: 'process',
    label: 'Bespoke Step .02: Prototyping',
    description: 'Precision engineering, optical calculations, and physical 1:1 CNC machined mockups.',
    url: '/images/bespoke/02-prototyping.jpg',
    defaultUrl: '/images/bespoke/02-prototyping.jpg',
    alt: 'Precision linear optical prototype in testing laboratory',
    recommendedAspect: '4:3 or 16:9 (1600x1200+)',
  },
  {
    id: 'process-step-3',
    section: 'process',
    label: 'Bespoke Step .03: Realization',
    description: 'Artisanal assembly, premium Italian finishes, and custom finish application.',
    url: '/images/bespoke/03-realization.jpg',
    defaultUrl: '/images/bespoke/03-realization.jpg',
    alt: 'Master artisanal luminaire assembly and surface refinement',
    recommendedAspect: '4:3 or 16:9 (1600x1200+)',
  },
  {
    id: 'process-step-4',
    section: 'process',
    label: 'Bespoke Step .04: Installation',
    description: 'On-site technical integration, aiming, commission, and scene programming.',
    url: '/images/bespoke/04-installation.jpg',
    defaultUrl: '/images/bespoke/04-installation.jpg',
    alt: 'Monolithic gallery architectural lighting installation',
    recommendedAspect: '4:3 or 16:9 (1600x1200+)',
  },

  // 4. Architectural Projects Swipe Section
  {
    id: 'project-1',
    section: 'projects',
    label: 'Project 01: Private Residence',
    description: 'Luxury coastal private residence in Mumbai featuring bespoke ceiling coves.',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Private coastal residence Mumbai architectural lighting',
    recommendedAspect: '4:3 (1200x900+)',
  },
  {
    id: 'project-2',
    section: 'projects',
    label: 'Project 02: Boutique Hotel',
    description: 'Hospitality lighting installation in Dubai featuring micro-aperture warm dimming.',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Boutique luxury hotel lobby lighting in Dubai',
    recommendedAspect: '4:3 (1200x900+)',
  },
  {
    id: 'project-3',
    section: 'projects',
    label: 'Project 03: Architectural Interior',
    description: 'Mayfair interior gallery in London with monolithic track and dark light downlights.',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    alt: 'London architectural gallery interior lighting',
    recommendedAspect: '4:3 (1200x900+)',
  },
  {
    id: 'project-4',
    section: 'projects',
    label: 'Project 04: Cultural Pavilion',
    description: 'Sculptural outdoor pavilion in Milan with integrated grazing linear profiles.',
    url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Cultural pavilion exterior illumination in Milan',
    recommendedAspect: '4:3 (1200x900+)',
  },
  {
    id: 'project-5',
    section: 'projects',
    label: 'Project 05: Civic Galleria',
    description: 'Cathedral height public galleria in Kyoto with custom suspended rings.',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    alt: 'Civic galleria public architectural lighting Kyoto',
    recommendedAspect: '4:3 (1200x900+)',
  },

  // 5. Studio & Contact
  {
    id: 'studio-hero',
    section: 'studio',
    label: 'Specification Studio & Photometrics Lab',
    description: 'Studio interior showing mock-up testing benches and optical goniophotometer.',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    alt: 'Kirtee & Associates architectural lighting studio workspace',
    recommendedAspect: '16:9 (1600x900+)',
  },
  {
    id: 'contact-consult',
    section: 'studio',
    label: 'Consultation & Samples Desk',
    description: 'Architectural lighting sample room and fixture material finish library.',
    url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1400&q=80',
    defaultUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1400&q=80',
    alt: 'Architectural lighting specification desk with fixture samples',
    recommendedAspect: '16:9 (1400x787+)',
  },
];

const LOCAL_STORAGE_FILE = path.join(process.cwd(), 'data', 'site-images.json');

// High-speed in-memory site images cache (<0.5ms lookup)
let cachedSiteImagesList: { data: SiteImageSlot[]; timestamp: number } | null = null;
const SITE_IMAGES_CACHE_TTL_MS = 60 * 1000;

export function invalidateSiteImagesCache(): void {
  cachedSiteImagesList = null;
}

/**
 * Loads all site images from database (site_settings table) or local JSON fallback.
 */
export async function getAllSiteImages(): Promise<SiteImageSlot[]> {
  // 1. Check ultra-fast in-memory cache
  if (cachedSiteImagesList && Date.now() - cachedSiteImagesList.timestamp < SITE_IMAGES_CACHE_TTL_MS) {
    return cachedSiteImagesList.data;
  }

  // 2. Try reading from PostgreSQL site_settings table
  try {
    const { rows } = await query<{ value: Record<string, Partial<SiteImageSlot>> }>(
      `SELECT value FROM site_settings WHERE key = 'site_images'`
    );

    if (rows && rows.length > 0 && rows[0].value) {
      const overrides = rows[0].value;
      const result = DEFAULT_SITE_IMAGES.map((slot) => {
        const custom = overrides[slot.id];
        if (custom) {
          return {
            ...slot,
            url: custom.url || slot.url,
            alt: custom.alt || slot.alt,
            updatedAt: custom.updatedAt,
          };
        }
        return slot;
      });
      cachedSiteImagesList = { data: result, timestamp: Date.now() };
      return result;
    }
  } catch (dbErr) {
    // Database might be unconfigured or offline - proceed to file check
  }

  // 3. Try reading from local data file
  try {
    const raw = await fs.readFile(LOCAL_STORAGE_FILE, 'utf-8');
    const overrides = JSON.parse(raw);
    const result = DEFAULT_SITE_IMAGES.map((slot) => {
      const custom = overrides[slot.id];
      if (custom) {
        return {
          ...slot,
          url: custom.url || slot.url,
          alt: custom.alt || slot.alt,
          updatedAt: custom.updatedAt,
        };
      }
      return slot;
    });
    cachedSiteImagesList = { data: result, timestamp: Date.now() };
    return result;
  } catch {
    // No file yet, return default catalog
    cachedSiteImagesList = { data: DEFAULT_SITE_IMAGES, timestamp: Date.now() };
    return DEFAULT_SITE_IMAGES;
  }
}

/**
 * Updates an individual or set of site image slots.
 */
export async function updateSiteImageSlot(
  id: string,
  updates: { url?: string; alt?: string }
): Promise<{ success: boolean; slot?: SiteImageSlot; error?: string }> {
  const currentSlots = await getAllSiteImages();
  const targetIndex = currentSlots.findIndex((s) => s.id === id);

  if (targetIndex === -1) {
    return { success: false, error: `Image slot with ID "${id}" does not exist` };
  }

  const updatedSlot: SiteImageSlot = {
    ...currentSlots[targetIndex],
    url: updates.url ?? currentSlots[targetIndex].url,
    alt: updates.alt ?? currentSlots[targetIndex].alt,
    updatedAt: new Date().toISOString(),
  };

  currentSlots[targetIndex] = updatedSlot;

  // Build dictionary
  const overridesDict: Record<string, { url: string; alt: string; updatedAt: string }> = {};
  for (const slot of currentSlots) {
    if (slot.url !== slot.defaultUrl || slot.alt !== slot.alt || slot.updatedAt) {
      overridesDict[slot.id] = {
        url: slot.url,
        alt: slot.alt,
        updatedAt: slot.updatedAt || new Date().toISOString(),
      };
    }
  }

  // 1. Save to local data JSON file
  try {
    const dir = path.dirname(LOCAL_STORAGE_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(LOCAL_STORAGE_FILE, JSON.stringify(overridesDict, null, 2), 'utf-8');
  } catch (fsErr) {
    console.warn('[Site Images] Could not write to local JSON fallback', fsErr);
  }

  // 2. Save to PostgreSQL site_settings if available
  try {
    await query(
      `
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('site_images', $1::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    `,
      [JSON.stringify(overridesDict)]
    );
  } catch (dbErr) {
    console.warn('[Site Images] DB update skipped or offline', dbErr);
  }

  invalidateSiteImagesCache();
  return { success: true, slot: updatedSlot };
}

/**
 * Resets a site image slot back to its original studio default.
 */
export async function resetSiteImageSlot(id: string): Promise<{ success: boolean; slot?: SiteImageSlot }> {
  const defaultSlot = DEFAULT_SITE_IMAGES.find((s) => s.id === id);
  if (!defaultSlot) {
    return { success: false };
  }

  return updateSiteImageSlot(id, {
    url: defaultSlot.defaultUrl,
    alt: defaultSlot.alt,
  });
}
