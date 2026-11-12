/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool, PoolConfig } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types/product';
import { externalizeDataUrl } from '@/lib/media-storage';
import { writeFileAtomic } from '@/lib/fs-atomic';
import { products as fallbackProducts, categories as fallbackCategories } from '@/lib/data/products';

// Connection String Resolution
const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URI ||
  process.env.POSTGRES_URL ||
  '';

/**
 * On serverless hosts (Vercel) the filesystem is read-only/ephemeral, so a save only counts as
 * successful when the database accepted it. Elsewhere, a local-JSON save is acceptable.
 */
export const REQUIRE_DB = Boolean(process.env.VERCEL) || process.env.REQUIRE_DB === 'true';

export function persistenceOk(localOk: boolean, dbOk: boolean): boolean {
  return REQUIRE_DB ? dbOk : localOk || dbOk;
}

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  if (
    !connectionString ||
    connectionString.includes('[YOUR-PASSWORD]') ||
    connectionString.includes('yourpassword') ||
    connectionString.includes('[password]')
  ) {
    return null;
  }

  if (!pool) {
    const isRemote =
      connectionString.includes('supabase.co') ||
      connectionString.includes('neon.tech') ||
      connectionString.includes('pooler.supabase.com') ||
      connectionString.includes('amazonaws.com') ||
      connectionString.includes('render.com') ||
      connectionString.includes('railway.app') ||
      connectionString.includes('vercel-storage.com') ||
      connectionString.includes('sslmode=require');

    // Clean connection string to prevent pg-connection-string from forcing strict ssl: true
    const cleanConnectionString = connectionString
      .replace(/[?&]sslmode=[^&]+/g, '')
      .replace(/\?$/, '');

    const config: PoolConfig = {
      connectionString: cleanConnectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 4000,
      keepAlive: true,
    };

    if (isRemote) {
      config.ssl = { rejectUnauthorized: false };
    }

    pool = new Pool(config);

    pool.on('error', (err) => {
      console.warn('[DB Pool Background Warning]:', err.message);
    });
  }

  return pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<{ rows: T[]; rowCount: number }> {
  const p = getDbPool();
  if (!p) {
    throw new Error('DATABASE_URL is not configured. Running in offline catalog mode.');
  }
  const client = await p.connect();
  try {
    const res = await client.query(text, params);
    return { rows: res.rows as T[], rowCount: res.rowCount ?? 0 };
  } finally {
    client.release();
  }
}

export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  isConfigured: boolean;
  latencyMs?: number;
  database?: string;
  version?: string;
  counts?: {
    products: number;
    categories: number;
    media: number;
    submissions: number;
  };
  error?: string;
}> {
  if (!connectionString || connectionString.includes('[YOUR-PASSWORD]') || connectionString.includes('yourpassword')) {
    const local = await getLocalProducts();
    return {
      connected: false,
      isConfigured: false,
      error: connectionString.includes('[YOUR-PASSWORD]')
        ? 'DATABASE_URL contains placeholder [YOUR-PASSWORD]. Operating in resilient local storage mode.'
        : 'No DATABASE_URL configured. Operating in offline catalog mode.',
      counts: {
        products: local.length || fallbackProducts.length,
        categories: fallbackCategories.length,
        media: 0,
        submissions: 0,
      },
    };
  }

  const startTime = Date.now();
  try {
    const { rows } = await query<{ now: string; version: string; current_database: string }>(
      'SELECT NOW(), VERSION() as version, CURRENT_DATABASE() as current_database'
    );
    const latencyMs = Date.now() - startTime;

    // Check table counts if tables exist
    let productCount = 0;
    let categoryCount = 0;
    let mediaCount = 0;
    let submissionCount = 0;

    try {
      const pRes = await query<{ count: string }>('SELECT COUNT(*) FROM products');
      productCount = parseInt(pRes.rows[0]?.count || '0', 10);
    } catch {
      // Table may not have been created yet
    }

    try {
      const cRes = await query<{ count: string }>('SELECT COUNT(*) FROM categories');
      categoryCount = parseInt(cRes.rows[0]?.count || '0', 10);
    } catch {}

    try {
      const mRes = await query<{ count: string }>('SELECT COUNT(*) FROM media');
      mediaCount = parseInt(mRes.rows[0]?.count || '0', 10);
    } catch {}

    try {
      const sRes = await query<{ count: string }>('SELECT COUNT(*) FROM submissions');
      submissionCount = parseInt(sRes.rows[0]?.count || '0', 10);
    } catch {}

    return {
      connected: true,
      isConfigured: true,
      latencyMs,
      database: rows[0]?.current_database || 'postgres',
      version: rows[0]?.version?.split(' ')?.[0] || 'PostgreSQL',
      counts: {
        products: productCount,
        categories: categoryCount,
        media: mediaCount,
        submissions: submissionCount,
      },
    };
  } catch (err: unknown) {
    return {
      connected: false,
      isConfigured: true,
      error: err instanceof Error ? err.message : 'Database connection error',
    };
  }
}

const LOCAL_PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

async function getLocalProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(LOCAL_PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveLocalProducts(products: Product[]): Promise<void> {
  // Throws on failure so callers can report persistence honestly.
  await writeFileAtomic(LOCAL_PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// High-speed in-memory product catalog cache (serves catalogue in <0.5ms)
let cachedProducts: { data: Product[]; timestamp: number } | null = null;
// Kept very short on purpose: each serverless/route instance has its own copy of this cache, and
// invalidateProductsCache() only clears the instance that handled the admin edit. A long TTL made
// other instances regenerate pages from a stale catalog right after an edit/delete.
// Public pages are ISR-cached anyway, so this only de-duplicates bursts of reads.
const PRODUCTS_CACHE_TTL_MS = 2 * 1000;

export function invalidateProductsCache(): void {
  cachedProducts = null;
}

// -------------------------------------------------------------
// Products API (DB with static fallback)
// -------------------------------------------------------------
export async function getProductsFromDb(): Promise<Product[]> {
  // 1. Check ultra-fast in-memory cache
  if (cachedProducts && Date.now() - cachedProducts.timestamp < PRODUCTS_CACHE_TTL_MS) {
    return cachedProducts.data;
  }

  try {
    const { rows } = await query<Record<string, any>>(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.description as category_desc
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.order_index ASC, p.created_at DESC
    `);

    if (rows && rows.length > 0) {
      const dbProducts: Product[] = rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        sku: r.sku || '',
        name: r.name,
        codeLabel: r.code_label || r.name.toUpperCase(),
        designer: r.designer || 'Kirtee & Associates Studio',
        catalogType: r.catalog_type as 'dry' | 'wet',
        tagline: r.tagline || '',
        shortDescription: r.short_description || '',
        fullDescription: r.full_description || '',
        editorialStory: r.editorial_story || r.full_description || '',
        category: {
          id: r.category_id || 'cat-dry',
          slug: r.category_slug || 'dry-goods',
          name: r.category_name || 'Dry Goods',
          description: r.category_desc || '',
          order: 1,
        },
        subcategory: r.subcategory || '',
        tags: r.tags || [],
        status: (r.status as 'published' | 'draft' | 'archived') || 'published',
        isFeatured: Boolean(r.is_featured),
        order: r.order_index || 1,
        heroImage: {
          id: r.hero_image_id || `img-${r.slug}`,
          url: r.hero_image_url || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80',
          alt: r.hero_image_alt || r.name,
          isPrimary: true,
        },
        heroCarouselImages: Array.isArray(r.hero_carousel_images) && r.hero_carousel_images.length > 0
          ? r.hero_carousel_images
          : (Array.isArray(r.gallery_urls) && r.gallery_urls.length > 0
              ? r.gallery_urls
              : [
                  {
                    id: r.hero_image_id || `img-${r.slug}`,
                    url: r.hero_image_url || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80',
                    alt: r.hero_image_alt || r.name,
                    isPrimary: true,
                  },
                ]),
        gallery: Array.isArray(r.gallery_urls) ? r.gallery_urls : [],
        specifications: Array.isArray(r.specifications) ? r.specifications : [],
        downloads: Array.isArray(r.downloads) ? r.downloads : [],
        socialLinks: r.social_links || (r.downloads?.[0]?.socialLinks ? r.downloads[0].socialLinks : undefined),
        brochureButtonText: r.brochure_button_text || undefined,
        specsEyebrow: r.specs_eyebrow || undefined,
        specsHeading: r.specs_heading || undefined,
        specsDescription: r.specs_description || undefined,
        galleryEyebrow: r.gallery_eyebrow || undefined,
        galleryHeading: r.gallery_heading || undefined,
        galleryDescription: r.gallery_description || undefined,
        relatedHeading: r.related_heading || undefined,
        seo: {
          metaTitle: `${r.name} | Kirtee & Associates`,
          metaDescription: r.short_description || r.name,
          ogImage: r.hero_image_url || undefined,
        },
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));

      // Cache in memory and locally for offline resilience
      cachedProducts = { data: dbProducts, timestamp: Date.now() };
      // Optional offline-fallback mirror of the live catalog into data/products.json.
      // Off by default: it rewrites tracked repo files on every read.
      if (process.env.MIRROR_DB_TO_LOCAL === 'true' && !process.env.VERCEL) {
        saveLocalProducts(dbProducts).catch(() => {});
      }
      return dbProducts;
    }

    // DB is reachable but the catalog table is empty.
    // First time only: seed it from the bundled catalog. If it was seeded before, empty means empty.
    const seeded = await query(`SELECT 1 FROM site_settings WHERE key = 'catalog_seeded' LIMIT 1`);
    if (seeded.rows.length > 0) {
      cachedProducts = { data: [], timestamp: Date.now() };
      return [];
    }
    const seedSource = (await getLocalProducts());
    const toSeed = seedSource.length > 0 ? seedSource : fallbackProducts;
    for (const prod of toSeed) {
      await saveProductToDb(prod);
    }
    await query(
      `INSERT INTO site_settings (key, value) VALUES ('catalog_seeded', 'true'::jsonb) ON CONFLICT (key) DO NOTHING`
    );
    cachedProducts = { data: toSeed, timestamp: Date.now() };
    return toSeed;
  } catch {
    console.warn('[DB Catalog Warning]: Database unreachable or offline, checking local file fallback.');
  }

  // 2. Check local JSON file
  const local = await getLocalProducts();
  if (local.length > 0) {
    cachedProducts = { data: local, timestamp: Date.now() };
    return local;
  }

  // 3. Fallback to default in-memory catalog
  cachedProducts = { data: fallbackProducts, timestamp: Date.now() };
  return fallbackProducts;
}

export async function getProductBySlugFromDb(slug: string): Promise<Product | undefined> {
  const all = await getProductsFromDb();
  if (slug === 'outdoor-in-ground-ingraze-frame') {
    return all.find((p) => p.slug === 'ingraze-frame-1000' && p.status === 'published');
  }
  return all.find((p) => p.slug === slug && p.status === 'published');
}

export async function saveProductToDb(input: Partial<Product>): Promise<{ success: boolean; id: string; error?: string; warning?: string }> {
  const product = await externalizeProductImages(input);
  const id = product.id || `prod-${product.slug || Date.now()}`;
  const slug = product.slug || id;
  const name = product.name || 'Untitled Luminaire';
  const catalogType = product.catalogType || 'dry';
  const categoryId = product.category?.id || (catalogType === 'wet' ? 'cat-wet' : 'cat-dry');

  const fullProduct: Product = {
    id,
    slug,
    sku: product.sku || '',
    name,
    codeLabel: product.codeLabel || name.toUpperCase(),
    designer: product.designer || 'Kirtee & Associates Studio',
    catalogType,
    category: product.category || {
      id: categoryId,
      slug: catalogType === 'wet' ? 'wet-goods' : 'dry-goods',
      name: catalogType === 'wet' ? 'Wet Goods' : 'Dry Goods',
      order: 1,
    },
    subcategory: product.subcategory || '',
    tagline: product.tagline || '',
    shortDescription: product.shortDescription || '',
    fullDescription: product.fullDescription || '',
    editorialStory: product.editorialStory || product.fullDescription || '',
    tags: product.tags || [],
    status: product.status || 'published',
    isFeatured: Boolean(product.isFeatured),
    order: product.order || 1,
    heroImage: product.heroImage || {
      id: `img-${slug}`,
      url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80',
      alt: name,
      isPrimary: true,
    },
    heroCarouselImages: (product.heroCarouselImages && product.heroCarouselImages.length > 0)
      ? product.heroCarouselImages
      : (product.heroImage ? [product.heroImage] : []),
    gallery: product.gallery || [],
    specifications: product.specifications || [],
    downloads: product.downloads || [],
    socialLinks: product.socialLinks || {},
    brochureButtonText: product.brochureButtonText || '',
    specsEyebrow: product.specsEyebrow || '',
    specsHeading: product.specsHeading || '',
    specsDescription: product.specsDescription || '',
    galleryEyebrow: product.galleryEyebrow || '',
    galleryHeading: product.galleryHeading || '',
    galleryDescription: product.galleryDescription || '',
    relatedHeading: product.relatedHeading || '',
    seo: product.seo || {
      metaTitle: `${name} | Kirtee & Associates`,
      metaDescription: product.shortDescription || name,
    },
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to local JSON (dev / self-hosted fallback)
  let localOk = false;
  try {
    const existing = await getLocalProducts();
    const list = existing.length > 0 ? existing : [...fallbackProducts];
    const idx = list.findIndex((p) => p.id === id || p.slug === slug);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...fullProduct };
    } else {
      list.push(fullProduct);
    }
    await saveLocalProducts(list);
    localOk = true;
  } catch (err) {
    console.warn('[DB Products Local Save Warning]:', err instanceof Error ? err.message : err);
  }

  // 2. Sync to PostgreSQL. Try the full column set first, then the legacy column set
  //    (for databases that have not run the latest ALTER TABLE migrations yet).
  const baseCols: [string, unknown][] = [
    ['id', id],
    ['slug', slug],
    ['sku', fullProduct.sku || ''],
    ['name', name],
    ['code_label', fullProduct.codeLabel || name.toUpperCase()],
    ['designer', fullProduct.designer || 'Kirtee & Associates Studio'],
    ['catalog_type', catalogType],
    ['category_id', categoryId],
    ['subcategory', fullProduct.subcategory || ''],
    ['tagline', fullProduct.tagline || ''],
    ['short_description', fullProduct.shortDescription || ''],
    ['full_description', fullProduct.fullDescription || ''],
    ['editorial_story', fullProduct.editorialStory || fullProduct.fullDescription || ''],
    ['tags', fullProduct.tags || []],
    ['status', fullProduct.status || 'published'],
    ['is_featured', Boolean(fullProduct.isFeatured)],
    ['order_index', fullProduct.order || 1],
    ['hero_image_url', fullProduct.heroImage?.url || ''],
    ['hero_image_alt', fullProduct.heroImage?.alt || name],
    ['gallery_urls', JSON.stringify(fullProduct.gallery || [])],
    ['specifications', JSON.stringify(fullProduct.specifications || [])],
    ['downloads', JSON.stringify(fullProduct.downloads || [])],
  ];
  const extendedCols: [string, unknown][] = [
    ...baseCols,
    ['hero_carousel_images', JSON.stringify(fullProduct.heroCarouselImages || [])],
    ['social_links', JSON.stringify(fullProduct.socialLinks || {})],
    ['brochure_button_text', fullProduct.brochureButtonText || ''],
    ['specs_eyebrow', fullProduct.specsEyebrow || ''],
    ['specs_heading', fullProduct.specsHeading || ''],
    ['specs_description', fullProduct.specsDescription || ''],
    ['gallery_eyebrow', fullProduct.galleryEyebrow || ''],
    ['gallery_heading', fullProduct.galleryHeading || ''],
    ['gallery_description', fullProduct.galleryDescription || ''],
    ['related_heading', fullProduct.relatedHeading || ''],
  ];

  const upsert = async (cols: [string, unknown][]) => {
    const names = cols.map(([c]) => c);
    const placeholders = cols.map((_, i) => `$${i + 1}`);
    const updates = names.filter((c) => c !== 'id').map((c) => `${c} = EXCLUDED.${c}`);
    await query(
      `INSERT INTO products (${names.join(', ')}, updated_at) VALUES (${placeholders.join(', ')}, NOW())
       ON CONFLICT (id) DO UPDATE SET ${updates.join(', ')}, updated_at = NOW()`,
      cols.map(([, v]) => v)
    );
  };

  let dbOk = false;
  let dbError = '';
  try {
    await upsert(extendedCols);
    dbOk = true;
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
    try {
      await upsert(baseCols);
      dbOk = true;
      dbError = '';
    } catch (err2) {
      dbError = err2 instanceof Error ? err2.message : String(err2);
    }
  }

  invalidateProductsCache();

  if (!persistenceOk(localOk, dbOk)) {
    return {
      success: false,
      id,
      error: dbError
        ? `Could not save to the database: ${dbError}`
        : 'Could not save: no writable storage is available.',
    };
  }
  return {
    success: true,
    id,
    warning: dbOk ? undefined : `Saved locally only; database sync failed (${dbError || 'not configured'}).`,
  };
}

/** Moves inline base64 images to storage so product rows/pages stay small. */
async function externalizeProductImages(product: Partial<Product>): Promise<Partial<Product>> {
  const cache = new Map<string, string>();
  const fix = async <T extends { url?: string }>(img: T | undefined): Promise<T | undefined> =>
    img && typeof img.url === 'string' ? { ...img, url: await externalizeDataUrl(img.url, cache) } : img;
  const fixList = async <T extends { url?: string }>(list: T[] | undefined): Promise<T[] | undefined> =>
    Array.isArray(list) ? Promise.all(list.map((i) => fix(i) as Promise<T>)) : list;

  const out: Partial<Product> = { ...product };
  out.heroImage = await fix(product.heroImage);
  out.heroCarouselImages = await fixList(product.heroCarouselImages);
  out.gallery = await fixList(product.gallery);
  if (product.seo?.ogImage) {
    out.seo = { ...product.seo, ogImage: await externalizeDataUrl(product.seo.ogImage, cache) };
  }
  return out;
}

export async function productExists(idOrSlug: string): Promise<boolean> {
  const all = await getProductsFromDb();
  return all.some((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export async function deleteProductFromDb(
  id: string
): Promise<{ success: boolean; error?: string; slug?: string; notFound?: boolean }> {
  const all = await getProductsFromDb();
  const target = all.find((p) => p.id === id || p.slug === id);
  if (!target) return { success: false, notFound: true, error: 'Product not found.' };

  let localOk = false;
  try {
    const existing = await getLocalProducts();
    await saveLocalProducts(existing.filter((p) => p.id !== target.id && p.slug !== target.slug));
    localOk = true;
  } catch {
    /* read-only filesystem */
  }

  let dbOk = false;
  let dbError = '';
  try {
    await query('DELETE FROM products WHERE id = $1', [target.id]);
    dbOk = true;
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  invalidateProductsCache();
  if (!persistenceOk(localOk, dbOk)) {
    return { success: false, error: dbError ? `Could not delete from the database: ${dbError}` : 'Could not delete: no writable storage.' };
  }
  return { success: true, slug: target.slug };
}

// -------------------------------------------------------------
// Media Table API
// -------------------------------------------------------------
export interface MediaRecord {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  savingsPercent: number;
  width: number;
  height: number;
  format: string;
  quality: number;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  caption?: string;
  createdAt: string;
}

export async function saveMediaRecord(media: Omit<MediaRecord, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { rows } = await query<{ id: string }>(
      `
      INSERT INTO media (
        filename, original_name, mime_type, original_size_bytes, compressed_size_bytes,
        savings_percent, width, height, format, quality, url, thumbnail_url, alt, caption
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) RETURNING id
    `,
      [
        media.filename,
        media.originalName,
        media.mimeType,
        media.originalSizeBytes,
        media.compressedSizeBytes,
        media.savingsPercent,
        media.width,
        media.height,
        media.format,
        media.quality,
        media.url,
        media.thumbnailUrl || media.url,
        media.alt,
        media.caption || '',
      ]
    );

    return { success: true, id: rows[0]?.id };
  } catch (err: unknown) {
    // If DB is offline, the file is still saved on disk / public/media
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save media metadata in database',
    };
  }
}

export async function getMediaRecords(): Promise<MediaRecord[]> {
  try {
    const { rows } = await query<Record<string, any>>(`
      SELECT * FROM media ORDER BY created_at DESC LIMIT 100
    `);

    return rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      originalName: r.original_name,
      mimeType: r.mime_type,
      originalSizeBytes: parseInt(r.original_size_bytes || '0', 10),
      compressedSizeBytes: parseInt(r.compressed_size_bytes || '0', 10),
      savingsPercent: parseFloat(r.savings_percent || '0'),
      width: r.width,
      height: r.height,
      format: r.format,
      quality: r.quality,
      url: r.url,
      thumbnailUrl: r.thumbnail_url,
      alt: r.alt,
      caption: r.caption,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}
