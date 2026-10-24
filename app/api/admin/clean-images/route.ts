import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getProductsFromDb, query } from '@/lib/db';
import { getSetting, DEFAULT_HERO_SLIDES, DEFAULT_PROJECTS, HeroSlideConfig, ProjectConfig } from '@/lib/site-settings';
import { getAllSiteImages } from '@/lib/site-images';

export async function GET() {
  try {
    // 1. Collect all active image references
    const usedUrls = new Set<string>();

    // From Products
    const products = await getProductsFromDb();
    for (const p of products) {
      if (p.heroImage?.url) usedUrls.add(p.heroImage.url);
      if (Array.isArray(p.gallery)) {
        p.gallery.forEach((g) => {
          if (g?.url) usedUrls.add(g.url);
        });
      }
    }

    // From Hero Slides
    const heroSlides = await getSetting<HeroSlideConfig[]>('hero_slides', DEFAULT_HERO_SLIDES);
    for (const slide of heroSlides) {
      if (slide.imageUrl) usedUrls.add(slide.imageUrl);
    }

    // From Projects
    const projects = await getSetting<ProjectConfig[]>('site_projects', DEFAULT_PROJECTS);
    for (const proj of projects) {
      if (proj.imageUrl) usedUrls.add(proj.imageUrl);
    }

    // From Site Image Slots
    const siteImages = await getAllSiteImages();
    for (const slot of siteImages) {
      if (slot.url) usedUrls.add(slot.url);
    }

    // 2. Scan public/media files
    const mediaDir = path.join(process.cwd(), 'public', 'media');
    let allMediaFiles: { filename: string; url: string; sizeBytes: number; createdAt: string }[] = [];

    try {
      const files = await fs.readdir(mediaDir);
      for (const file of files) {
        if (!file.endsWith('.webp') || file.includes('-thumb.')) continue;
        const filePath = path.join(mediaDir, file);
        const stat = await fs.stat(filePath);
        allMediaFiles.push({
          filename: file,
          url: `/media/${file}`,
          sizeBytes: stat.size,
          createdAt: stat.birthtime.toISOString(),
        });
      }
    } catch {
      // media folder might not exist yet
    }

    // 3. Scan DB media table if available
    try {
      const dbMedia = await query<{ filename: string; url: string; compressed_size_bytes: number; created_at: string }>(
        'SELECT filename, url, compressed_size_bytes, created_at FROM media'
      );
      if (dbMedia.rows && dbMedia.rows.length > 0) {
        for (const row of dbMedia.rows) {
          if (!allMediaFiles.some((m) => m.filename === row.filename)) {
            allMediaFiles.push({
              filename: row.filename,
              url: row.url,
              sizeBytes: row.compressed_size_bytes || 0,
              createdAt: row.created_at || new Date().toISOString(),
            });
          }
        }
      }
    } catch {
      // DB offline or table missing
    }

    // 4. Classify used vs unused
    const unusedImages = [];
    let totalStorageBytes = 0;
    let unusedStorageBytes = 0;

    for (const item of allMediaFiles) {
      totalStorageBytes += item.sizeBytes;
      const isUsed = Array.from(usedUrls).some((u) => u.includes(item.filename) || u === item.url);
      if (!isUsed) {
        unusedImages.push(item);
        unusedStorageBytes += item.sizeBytes;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalImagesCount: allMediaFiles.length,
        totalStorageBytes,
        unusedCount: unusedImages.length,
        unusedStorageBytes,
        usedStorageBytes: totalStorageBytes - unusedStorageBytes,
        // Free tier capacity metrics (1GB = 1,073,741,824 bytes)
        storageLimitBytes: 1024 * 1024 * 1024,
        storageUsagePercent: Number(((totalStorageBytes / (1024 * 1024 * 1024)) * 100).toFixed(2)),
      },
      unusedImages,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Scan error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filenames } = body as { filenames: string[] };

    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No image filenames specified for deletion.' },
        { status: 400 }
      );
    }

    const mediaDir = path.join(process.cwd(), 'public', 'media');
    let deletedCount = 0;
    let freedBytes = 0;

    for (const filename of filenames) {
      // Safe path checking to prevent path traversal
      const safeFilename = path.basename(filename);
      const filePath = path.join(mediaDir, safeFilename);
      const thumbPath = path.join(mediaDir, safeFilename.replace('.webp', '-thumb.webp'));

      try {
        const stat = await fs.stat(filePath);
        freedBytes += stat.size;
        await fs.unlink(filePath);
        deletedCount++;
      } catch {}

      try {
        await fs.unlink(thumbPath);
      } catch {}

      // Also remove from DB media table
      try {
        await query('DELETE FROM media WHERE filename = $1 OR url LIKE $2', [safeFilename, `%${safeFilename}%`]);
      } catch {}
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      freedBytes,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Deletion error' },
      { status: 500 }
    );
  }
}
