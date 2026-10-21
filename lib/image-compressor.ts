import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { CompressionResult, formatBytes } from './format';

export type { CompressionResult };
export { formatBytes };

export interface CompressionOptions {
  quality?: number; // 1-100 (default 85 for architectural fidelity)
  maxWidth?: number; // max width in pixels (e.g. 2400)
  maxHeight?: number; // max height in pixels (e.g. 2400)
  generateThumbnail?: boolean;
  thumbnailWidth?: number; // default 480
}

/**
 * Compresses an image buffer into high-quality WebP format with sharp edge retention.
 */
export async function compressToWebP(
  buffer: Buffer,
  originalFilename: string,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    quality = 85,
    maxWidth = 2400,
    maxHeight = 2400,
    generateThumbnail = true,
    thumbnailWidth = 480,
  } = options;

  const originalSizeBytes = buffer.length;

  // Sanitize base filename
  const parsed = path.parse(originalFilename);
  const cleanBaseName = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-');
  const timestamp = Date.now();
  const webpFilename = `${cleanBaseName}-${timestamp}.webp`;
  const thumbFilename = `${cleanBaseName}-${timestamp}-thumb.webp`;

  // Ensure public/media directory exists
  const publicMediaDir = path.join(process.cwd(), 'public', 'media');
  await fs.mkdir(publicMediaDir, { recursive: true });

  // 1. Process Main High-Quality WebP
  let pipeline = sharp(buffer).rotate(); // Auto-rotate by EXIF orientation

  const metadata = await pipeline.metadata();

  // Resize if exceeding max dimensions while preserving aspect ratio
  if (
    (metadata.width && metadata.width > maxWidth) ||
    (metadata.height && metadata.height > maxHeight)
  ) {
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Configure high-fidelity WebP compression
  const compressedBuffer = await pipeline
    .webp({
      quality,
      effort: 6, // Maximum compression effort
      smartSubsample: true, // Preserves high-frequency details (ideal for architectural lighting & metals)
      nearLossless: quality >= 95,
    })
    .toBuffer();

  const finalMetadata = await sharp(compressedBuffer).metadata();
  const compressedSizeBytes = compressedBuffer.length;
  const savingsBytes = Math.max(0, originalSizeBytes - compressedSizeBytes);
  const savingsPercent =
    originalSizeBytes > 0
      ? Number(((savingsBytes / originalSizeBytes) * 100).toFixed(1))
      : 0;

  // Save main file to public/media
  const filePath = path.join(publicMediaDir, webpFilename);
  await fs.writeFile(filePath, compressedBuffer);
  const url = `/media/${webpFilename}`;

  // 2. Generate Responsive Thumbnail
  let thumbnailUrl = url;
  if (generateThumbnail) {
    try {
      const thumbBuffer = await sharp(buffer)
        .rotate()
        .resize({
          width: thumbnailWidth,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      const thumbFilePath = path.join(publicMediaDir, thumbFilename);
      await fs.writeFile(thumbFilePath, thumbBuffer);
      thumbnailUrl = `/media/${thumbFilename}`;
    } catch (thumbError) {
      console.warn('Thumbnail generation warning:', thumbError);
    }
  }

  return {
    filename: webpFilename,
    originalName: originalFilename,
    mimeType: 'image/webp',
    originalSizeBytes,
    compressedSizeBytes,
    savingsBytes,
    savingsPercent,
    width: finalMetadata.width || 0,
    height: finalMetadata.height || 0,
    format: 'webp',
    quality,
    url,
    thumbnailUrl,
  };
}
