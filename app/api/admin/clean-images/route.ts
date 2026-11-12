import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getProductsFromDb, query } from '@/lib/db';
import { getSetting, DEFAULT_HERO_SLIDES, DEFAULT_PROJECTS, HeroSlideConfig, ProjectConfig } from '@/lib/site-settings';
import { getAllSiteImages } from '@/lib/site-images';
import { requireAdmin } from '@/lib/admin-auth';
import { deleteMedia, isSafeFilename } from '@/lib/media-storage';

export const dynamic = 'force-dynamic';

const SOURCE_DIRS = ['app', 'components', 'lib', 'config', 'data'];
const MEDIA_REF_RE = /\/media\/([A-Za-z0-9][A-Za-z0-9._-]*\.webp)/g;

/** Filenames referenced directly from source code / data files (e.g. hard-coded in a component). */
async function scanSourceReferences(): Promise<{ names: Set<string>; scanned: boolean }> {
  const names = new Set<string>();
  let scannedAny = false;

  async function walk(dir: string, depth = 0): Promise<void> {
    if (depth > 6) return;
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.next') continue;
        await walk(full, depth + 1);
      } else if (/\.(tsx?|jsx?|css|json|mdx?)$/.test(entry.name)) {
        try {
          const text = await fs.readFile(full, 'utf-8');
          scannedAny = true;
          for (const m of text.matchAll(MEDIA_REF_RE)) names.add(m[1]);
        } catch {}
      }
    }
  }

  for (const d of SOURCE_DIRS) await walk(path.join(process.cwd(), d));
  return { names, scanned: scannedAny };
}

async function collectUsedFilenames(): Promise<{ used: Set<string>; sourceScanned: boolean }> {
  const used = new Set<string>();
  const addUrl = (u?: string) => {
    if (!u) return;
    for (const m of u.matchAll(/([A-Za-z0-9][A-Za-z0-9._-]*\.webp)(?:$|[?#])/g)) used.add(m[1]);
  };

  const products = await getProductsFromDb();
  for (const p of products) {
    addUrl(p.heroImage?.url);
    p.heroCarouselImages?.forEach((g) => addUrl(g?.url));
    p.gallery?.forEach((g) => addUrl(g?.url));
    addUrl(p.seo?.ogImage);
  }
  const heroSlides = await getSetting<HeroSlideConfig[]>('hero_slides', DEFAULT_HERO_SLIDES);
  heroSlides.forEach((s) => addUrl(s.imageUrl));
  const projects = await getSetting<ProjectConfig[]>('site_projects', DEFAULT_PROJECTS);
  projects.forEach((p) => addUrl(p.imageUrl));
  // Other settings (CTA image, philosophy images, etc.) are scanned as raw JSON text
  for (const key of ['home_philosophy', 'home_why_choose_us', 'home_process', 'home_project_cta', 'site_contact']) {
    const value = await getSetting<unknown>(key, {});
    addUrl(JSON.stringify(value));
    for (const m of JSON.stringify(value).matchAll(MEDIA_REF_RE)) used.add(m[1]);
  }
  (await getAllSiteImages()).forEach((s) => addUrl(s.url));

  const src = await scanSourceReferences();
  src.names.forEach((n) => used.add(n));
  return { used, sourceScanned: src.scanned };
}

async function listMediaFiles() {
  const out: { filename: string; url: string; sizeBytes: number; createdAt: string }[] = [];
  try {
    const dir = path.join(process.cwd(), 'public', 'media');
    for (const file of await fs.readdir(dir)) {
      if (!file.endsWith('.webp') || file.includes('-thumb.')) continue;
      const stat = await fs.stat(path.join(dir, file));
      out.push({ filename: file, url: `/media/${file}`, sizeBytes: stat.size, createdAt: stat.birthtime.toISOString() });
    }
  } catch {}
  try {
    const db = await query<{ filename: string; url: string; compressed_size_bytes: number; created_at: string }>(
      'SELECT filename, url, compressed_size_bytes, created_at FROM media'
    );
    for (const row of db.rows) {
      if (!out.some((m) => m.filename === row.filename)) {
        out.push({ filename: row.filename, url: row.url, sizeBytes: Number(row.compressed_size_bytes) || 0, createdAt: row.created_at || new Date().toISOString() });
      }
    }
  } catch {}
  return out;
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const [{ used, sourceScanned }, all] = await Promise.all([collectUsedFilenames(), listMediaFiles()]);
    const unusedImages = all.filter((m) => !used.has(m.filename));
    const totalStorageBytes = all.reduce((n, m) => n + m.sizeBytes, 0);
    const unusedStorageBytes = unusedImages.reduce((n, m) => n + m.sizeBytes, 0);

    return NextResponse.json({
      success: true,
      sourceScanned,
      stats: {
        totalImagesCount: all.length,
        totalStorageBytes,
        unusedCount: unusedImages.length,
        unusedStorageBytes,
        usedStorageBytes: totalStorageBytes - unusedStorageBytes,
        storageLimitBytes: 1024 * 1024 * 1024,
        storageUsagePercent: Number(((totalStorageBytes / (1024 * 1024 * 1024)) * 100).toFixed(2)),
      },
      unusedImages,
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Scan error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    let body: { filenames?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
    const filenames = Array.isArray(body.filenames) ? body.filenames.filter((f): f is string => typeof f === 'string') : [];
    if (filenames.length === 0) {
      return NextResponse.json({ success: false, message: 'No image filenames specified for deletion.' }, { status: 400 });
    }

    // Re-verify on the server: never delete an image that is still referenced anywhere.
    const { used, sourceScanned } = await collectUsedFilenames();
    if (!sourceScanned) {
      return NextResponse.json(
        { success: false, message: 'Cannot verify code references in this environment, so deletion is disabled to avoid breaking the site.' },
        { status: 409 }
      );
    }

    let deletedCount = 0;
    let freedBytes = 0;
    const skipped: string[] = [];

    for (const filename of filenames) {
      if (!isSafeFilename(filename) || used.has(filename)) {
        skipped.push(filename);
        continue;
      }
      freedBytes += await deleteMedia(filename);
      await deleteMedia(filename.replace(/\.webp$/, '-thumb.webp'));
      try {
        await query('DELETE FROM media WHERE filename = $1', [filename]);
      } catch {}
      deletedCount++;
    }

    return NextResponse.json({ success: true, deletedCount, freedBytes, skipped });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Deletion error' }, { status: 500 });
  }
}
