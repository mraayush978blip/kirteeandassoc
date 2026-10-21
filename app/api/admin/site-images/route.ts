import { NextRequest, NextResponse } from 'next/server';
import { getAllSiteImages, updateSiteImageSlot, resetSiteImageSlot } from '@/lib/site-images';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slots = await getAllSiteImages();
    return NextResponse.json({
      success: true,
      slots,
      totalSlots: slots.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to load site image slots' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, url, alt, action } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Image slot ID is required' },
        { status: 400 }
      );
    }

    if (action === 'reset') {
      const result = await resetSiteImageSlot(id);
      return NextResponse.json(result);
    }

    const result = await updateSiteImageSlot(id, { url, alt });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update site image slot' },
      { status: 500 }
    );
  }
}
