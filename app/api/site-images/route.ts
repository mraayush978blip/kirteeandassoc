import { NextResponse } from 'next/server';
import { getAllSiteImages } from '@/lib/site-images';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slots = await getAllSiteImages();
    // Return key-value map for instant client lookups: { [slotId]: { url, alt } }
    const map: Record<string, { url: string; alt: string }> = {};
    for (const slot of slots) {
      map[slot.id] = { url: slot.url, alt: slot.alt };
    }
    return NextResponse.json(
      {
        success: true,
        images: map,
        slots,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to read site images' },
      { status: 500 }
    );
  }
}
