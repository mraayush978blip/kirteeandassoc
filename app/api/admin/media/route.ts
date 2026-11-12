import { NextRequest, NextResponse } from 'next/server';
import { getMediaRecords } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    // 1. Try DB first
    const dbMedia = await getMediaRecords();
    if (dbMedia && dbMedia.length > 0) {
      return NextResponse.json({ success: true, media: dbMedia, source: 'database' });
    }

    // 2. Fallback to scanning public/media directory (real sizes only; no invented numbers)
    const publicMediaDir = path.join(process.cwd(), 'public', 'media');
    try {
      const files = await fs.readdir(publicMediaDir);
      const mediaList = [];
      for (const file of files) {
        if (!file.endsWith('.webp') || file.includes('-thumb.')) continue;
        const stats = await fs.stat(path.join(publicMediaDir, file));
        const thumb = file.replace('.webp', '-thumb.webp');
        const hasThumb = files.includes(thumb);
        mediaList.push({
          id: file,
          filename: file,
          originalName: file.replace(/-\d+\.webp$/, ''),
          mimeType: 'image/webp',
          compressedSizeBytes: stats.size,
          format: 'webp',
          url: `/media/${file}`,
          thumbnailUrl: hasThumb ? `/media/${thumb}` : `/media/${file}`,
          alt: file.replace(/[-_]/g, ' ').replace('.webp', ''),
          createdAt: stats.birthtime.toISOString(),
        });
      }
      return NextResponse.json({ success: true, media: mediaList, source: 'filesystem' });
    } catch {
      return NextResponse.json({ success: true, media: [], source: 'empty' });
    }
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Error reading media' },
      { status: 500 }
    );
  }
}
