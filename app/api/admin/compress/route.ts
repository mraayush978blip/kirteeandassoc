import { NextRequest, NextResponse } from 'next/server';
import { compressToWebP } from '@/lib/image-compressor';
import { saveMediaRecord } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const qualityParam = formData.get('quality');
    const maxWidthParam = formData.get('maxWidth');

    const quality = qualityParam ? parseInt(qualityParam.toString(), 10) : 85;
    const maxWidth = maxWidthParam ? parseInt(maxWidthParam.toString(), 10) : 2400;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No image files provided for compression.' },
        { status: 400 }
      );
    }

    const results = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

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
