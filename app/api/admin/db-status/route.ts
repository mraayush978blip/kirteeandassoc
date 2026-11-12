import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { storageMode } from '@/lib/media-storage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const status = await checkDatabaseConnection();
  return NextResponse.json({ ...status, storage: storageMode() });
}
