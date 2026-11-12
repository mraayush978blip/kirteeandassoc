import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json(
    { success: true, authenticated: true, user: { email: session.email, role: session.role } },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
