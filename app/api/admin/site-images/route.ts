import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { getAllSiteImages, updateSiteImageSlot, resetSiteImageSlot } from '@/lib/site-images';

export const dynamic = 'force-dynamic';

function isSafeImageUrl(url: string): boolean {
  return /^(\/|https:\/\/)/.test(url) && !/^\/\//.test(url) && url.length < 2048;
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const slots = await getAllSiteImages();
    return NextResponse.json({ success: true, slots, totalSlots: slots.length });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to load site image slots' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    let body: { id?: unknown; url?: unknown; alt?: unknown; action?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
    const { id, url, alt, action } = body;

    if (typeof id !== 'string' || !id) {
      return NextResponse.json({ success: false, message: 'Image slot ID is required' }, { status: 400 });
    }

    let result;
    if (action === 'reset') {
      result = await resetSiteImageSlot(id);
    } else {
      if (url !== undefined && (typeof url !== 'string' || !isSafeImageUrl(url))) {
        return NextResponse.json({ success: false, message: 'Image URL must be a relative path or an https URL.' }, { status: 400 });
      }
      if (alt !== undefined && (typeof alt !== 'string' || alt.length > 300)) {
        return NextResponse.json({ success: false, message: 'Alt text must be a string (max 300 chars).' }, { status: 400 });
      }
      result = await updateSiteImageSlot(id, { url: url as string | undefined, alt: alt as string | undefined });
    }

    if (!result.success) {
      return NextResponse.json({ success: false, message: ('error' in result && result.error) || 'Update failed' }, { status: 400 });
    }
    try {
      revalidatePath('/', 'layout');
    } catch {}
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to update site image slot' },
      { status: 500 }
    );
  }
}
