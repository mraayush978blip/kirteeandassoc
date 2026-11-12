import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProductsFromDb, saveProductToDb, deleteProductFromDb } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const products = await getProductsFromDb();
    return NextResponse.json({ success: true, products }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function revalidateCatalog(slug?: string) {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/dry-goods');
    revalidatePath('/wet-goods');
    revalidatePath('/products');
    if (slug) revalidatePath(`/products/${slug}`);
  } catch (e) {
    console.warn('[Cache Revalidation Warning]:', e);
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Invalid product payload' }, { status: 400 });
    }

    // ---- validation ----
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name || name.length > 200) {
      return NextResponse.json({ success: false, message: 'Product name is required (max 200 characters).' }, { status: 400 });
    }
    const slug = typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : slugify(name);
    if (!SLUG_RE.test(slug) || slug.length > 120) {
      return NextResponse.json(
        { success: false, message: 'Slug may only contain lowercase letters, numbers and single hyphens.' },
        { status: 400 }
      );
    }
    if (body.catalogType !== undefined && body.catalogType !== 'dry' && body.catalogType !== 'wet') {
      return NextResponse.json({ success: false, message: 'catalogType must be "dry" or "wet".' }, { status: 400 });
    }
    if (body.status !== undefined && !['published', 'draft', 'archived'].includes(body.status as string)) {
      return NextResponse.json({ success: false, message: 'status must be published, draft or archived.' }, { status: 400 });
    }
    if (body.id !== undefined && (typeof body.id !== 'string' || !body.id.trim() || body.id.length > 120)) {
      return NextResponse.json({ success: false, message: 'Invalid product id.' }, { status: 400 });
    }

    // ---- slug uniqueness (a different product must not already own this slug) ----
    const existing = await getProductsFromDb();
    const clash = existing.find((p) => p.slug === slug && p.id !== body.id);
    if (clash) {
      return NextResponse.json(
        { success: false, message: `The slug "${slug}" is already used by "${clash.name}". Choose a different slug.` },
        { status: 409 }
      );
    }
    const isNew = !body.id;
    const payload = { ...body, name, slug, id: isNew ? `prod-${slug}` : (body.id as string) };

    const result = await saveProductToDb(payload as Parameters<typeof saveProductToDb>[0]);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error || 'Failed to save product' }, { status: 500 });
    }

    // If the slug was renamed, the old product page must be refreshed too
    const previous = existing.find((p) => p.id === payload.id);
    if (previous && previous.slug !== slug) revalidateCatalog(previous.slug);
    revalidateCatalog(slug);

    return NextResponse.json({ success: true, id: result.id, slug, warning: result.warning });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });
    }

    const result = await deleteProductFromDb(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to delete product' },
        { status: result.notFound ? 404 : 500 }
      );
    }

    revalidateCatalog(result.slug);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
