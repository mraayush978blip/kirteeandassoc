import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProductsFromDb, saveProductToDb, deleteProductFromDb } from '@/lib/db';

export async function GET() {
  try {
    const products = await getProductsFromDb();
    return NextResponse.json({ success: true, products });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await saveProductToDb(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to save product' },
        { status: 400 }
      );
    }

    // Instantly invalidate server cache so the frontend displays the new product immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/dry-goods');
      revalidatePath('/wet-goods');
      revalidatePath('/products');
      if (body.slug) {
        revalidatePath(`/products/${body.slug}`);
      }
    } catch (e) {
      console.warn('[Cache Revalidation Warning]:', e);
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });
    }

    const result = await deleteProductFromDb(id);

    // Instantly invalidate server cache
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/dry-goods');
      revalidatePath('/wet-goods');
      revalidatePath('/products');
    } catch (e) {
      console.warn('[Cache Revalidation Warning]:', e);
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
