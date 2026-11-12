import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  clearLoginFailures,
  clientIp,
  createSessionToken,
  loginThrottle,
  recordLoginFailure,
  sessionCookieOptions,
  verifyAdminCredentials,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const throttle = loginThrottle(ip);
  if (throttle.blocked) {
    return NextResponse.json(
      { success: false, message: `Too many failed attempts. Try again in ${Math.ceil(throttle.retryAfter / 60)} minute(s).` },
      { status: 429, headers: { 'Retry-After': String(throttle.retryAfter) } }
    );
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const result = await verifyAdminCredentials(email, password);
  if (!result.ok) {
    if (result.status === 401) recordLoginFailure(ip);
    return NextResponse.json({ success: false, message: result.error }, { status: result.status });
  }

  const token = createSessionToken(result.email);
  if (!token) {
    return NextResponse.json({ success: false, message: 'Server session secret is not configured.' }, { status: 500 });
  }
  clearLoginFailures(ip);
  const res = NextResponse.json({ success: true, user: { email: result.email, role: 'admin' } });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
