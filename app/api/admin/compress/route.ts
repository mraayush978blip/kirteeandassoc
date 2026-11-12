import { NextRequest, NextResponse } from 'next/server';
import { compressToWebP } from '@/lib/image-compressor';
import { saveMediaRecord } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

const MAX_FILES = 20;
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB per image
const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff', 'heif']);

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid upload (expected multipart form data).' }, { status: 400 });
    }
    const files = formData.getAll('files') as File[];
    const qualityParam = formData.get('quality');
    const maxWidthParam = formData.get('maxWidth');

    const clamp = (n: number, min: number, max: number, dflt: number) => (Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : dflt);
    const quality = clamp(qualityParam ? parseInt(qualityParam.toString(), 10) : 85, 30, 100, 85);
    const maxWidth = clamp(maxWidthParam ? parseInt(maxWidthParam.toString(), 10) : 2400, 200, 6000, 2400);

    if (files.length > MAX_FILES) {
      return NextResponse.json({ success: false, message: `Upload at most ${MAX_FILES} images at a time.` }, { status: 400 });
    }

    if (!files || files.length === 0 || !files.some((f) => f instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'No image files provided for compression.' },
        { status: 400 }
      );
    }

    const results = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { success: false, message: `"${file.name}" is larger than ${MAX_FILE_BYTES / 1024 / 1024} MB.` },
          { status: 413 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Verify the real content with sharp instead of trusting the client-supplied MIME type
      let detected: string | undefined;
      try {
        detected = (await sharp(buffer).metadata()).format;
      } catch {
        detected = undefined;
      }
      if (!detected || !ALLOWED_FORMATS.has(detected)) {
        return NextResponse.json(
          { success: false, message: `"${file.name}" is not a supported image (use JPG, PNG, WebP, GIF or AVIF).` },
          { status: 400 }
        );
      }

      // Compress to high-fidelity WebP
      const compressed = await compressToWebP(buffer, file.name, {
        quality,
        maxWidth,
      });

      // Save to media catalog in DB if available
      await saveMediaRecord({
        filename: compressed.filename,
        originalName: compressed.originalName,
        mimeType: compressed.mimeType,
        originalSizeBytes: compressed.originalSizeBytes,
        compressedSizeBytes: compressed.compressedSizeBytes,
        savingsPercent: compressed.savingsPercent,
        width: compressed.width,
        height: compressed.height,
        format: compressed.format,
        quality: compressed.quality,
        url: compressed.url,
        thumbnailUrl: compressed.thumbnailUrl,
        alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        caption: 'Architectural luminaire asset',
      });

      results.push(compressed);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      files: results,
    });
  } catch (error: unknown) {
    console.error('Image compression endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Compression failed.',
      },
      { status: 500 }
    );
  }
}
