import { Pool, PoolConfig } from 'pg';
import { Product, ProductCategory } from '@/types/product';
import { products as fallbackProducts, categories as fallbackCategories } from '@/lib/data/products';

// Connection String Resolution
const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URI ||
  process.env.POSTGRES_URL ||
  '';

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  if (!connectionString) {
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

    const config: PoolConfig = {
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
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
  if (!connectionString) {
    return {
      connected: false,
      isConfigured: false,
      error: 'No DATABASE_URL or DATABASE_URI configured in environment. Operating in offline catalog mode.',
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

// -------------------------------------------------------------
// Products API (DB with static fallback)
// -------------------------------------------------------------
export async function getProductsFromDb(): Promise<Product[]> {
  try {
    const { rows } = await query<any>(`
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
      return rows.map((r) => ({
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
        gallery: Array.isArray(r.gallery_urls) ? r.gallery_urls : [],
        specifications: Array.isArray(r.specifications) ? r.specifications : [],
        downloads: Array.isArray(r.downloads) ? r.downloads : [],
        seo: {
          metaTitle: `${r.name} | Kirtee & Associates`,
          metaDescription: r.short_description || r.name,
          ogImage: r.hero_image_url || undefined,
        },
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (error) {
    // Database query failed or table not found; gracefully fallback to file data
    console.warn('[DB Catalog Fallback]: Using static products library.');
  }

  return fallbackProducts;
}

export async function saveProductToDb(product: Partial<Product>): Promise<{ success: boolean; id: string; error?: string }> {
  try {
    const id = product.id || `prod-${product.slug || Date.now()}`;
    const slug = product.slug || id;
    const name = product.name || 'Untitled Luminaire';
    const catalogType = product.catalogType || 'dry';
    const categoryId = product.category?.id || (catalogType === 'wet' ? 'cat-wet' : 'cat-dry');

    await query(
      `
      INSERT INTO products (
        id, slug, sku, name, code_label, designer, catalog_type, category_id,
        subcategory, tagline, short_description, full_description, editorial_story,
        tags, status, is_featured, order_index, hero_image_url, hero_image_alt,
        specifications, downloads, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19,
        $20, $21, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        sku = EXCLUDED.sku,
        name = EXCLUDED.name,
        code_label = EXCLUDED.code_label,
        designer = EXCLUDED.designer,
        catalog_type = EXCLUDED.catalog_type,
        category_id = EXCLUDED.category_id,
        subcategory = EXCLUDED.subcategory,
        tagline = EXCLUDED.tagline,
        short_description = EXCLUDED.short_description,
        full_description = EXCLUDED.full_description,
        editorial_story = EXCLUDED.editorial_story,
        tags = EXCLUDED.tags,
        status = EXCLUDED.status,
        is_featured = EXCLUDED.is_featured,
        order_index = EXCLUDED.order_index,
        hero_image_url = EXCLUDED.hero_image_url,
        hero_image_alt = EXCLUDED.hero_image_alt,
        specifications = EXCLUDED.specifications,
        downloads = EXCLUDED.downloads,
        updated_at = NOW()
    `,
      [
        id,
        slug,
        product.sku || '',
        name,
        product.codeLabel || name.toUpperCase(),
        product.designer || 'Kirtee & Associates Studio',
        catalogType,
        categoryId,
        product.subcategory || '',
        product.tagline || '',
        product.shortDescription || '',
        product.fullDescription || '',
        product.editorialStory || product.fullDescription || '',
        product.tags || [],
        product.status || 'published',
        Boolean(product.isFeatured),
        product.order || 1,
        product.heroImage?.url || '',
        product.heroImage?.alt || name,
        JSON.stringify(product.specifications || []),
        JSON.stringify(product.downloads || []),
      ]
    );

    return { success: true, id };
  } catch (err: unknown) {
    return {
      success: false,
      id: product.id || '',
      error: err instanceof Error ? err.message : 'Failed to save product in database',
    };
  }
}

export async function deleteProductFromDb(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { rowCount } = await query('DELETE FROM products WHERE id = $1', [id]);
    return { success: rowCount > 0 };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete product',
    };
  }
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
    const { rows } = await query<any>(`
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
