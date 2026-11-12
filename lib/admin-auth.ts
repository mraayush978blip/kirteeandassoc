import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side admin authentication.
 *
 * - Credentials are checked on the server only (never shipped to the browser).
 * - A successful login sets a signed, HttpOnly, SameSite=Strict cookie.
 * - Every /api/admin/* route calls requireAdmin() before doing anything.
 *
 * Required env vars (see .env.example):
 *   ADMIN_SESSION_SECRET  random string, >= 32 chars
 *   ADMIN_EMAIL + ADMIN_PASSWORD        (simple built-in credential), and/or
 *   ADMIN_EMAILS (comma list) + Supabase Auth users (password grant)
 */

export const SESSION_COOKIE = 'kirtee_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export interface AdminSession {
  email: string;
  role: 'admin';
  exp: number; // unix seconds
}

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== 'production') {
    // Local-development convenience only. Production refuses to run without a real secret.
    return 'dev-only-insecure-secret-change-me-0123456789';
  }
  return null;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function createSessionToken(email: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const session: AdminSession = {
    email,
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = b64url(JSON.stringify(session));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if (!safeEqual(signature, sign(payload, secret))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as AdminSession;
    if (!session.email || session.role !== 'admin') return null;
    if (session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export function getSession(req: NextRequest): AdminSession | null {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

/** Returns a 401 response when the request is not an authenticated admin, otherwise null. */
export function requireAdmin(req: NextRequest): NextResponse | null {
  if (getSession(req)) return null;
  return NextResponse.json(
    { success: false, message: 'Unauthorized. Please sign in to the admin console.' },
    { status: 401, headers: { 'Cache-Control': 'no-store' } }
  );
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  };
}

// ---------------------------------------------------------------------------
// Credential verification
// ---------------------------------------------------------------------------

function adminAllowlist(): string[] {
  const list = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list;
}

export async function verifyAdminCredentials(
  rawEmail: string,
  password: string
): Promise<{ ok: true; email: string } | { ok: false; error: string; status: number }> {
  const email = rawEmail.trim().toLowerCase();
  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.', status: 400 };
  }
  if (!getSecret()) {
    return { ok: false, error: 'Server is missing ADMIN_SESSION_SECRET (min 32 chars).', status: 500 };
  }

  const allowed = adminAllowlist();
  if (allowed.length === 0) {
    return { ok: false, error: 'No admin accounts configured (set ADMIN_EMAIL).', status: 500 };
  }
  if (!allowed.includes(email)) {
    return { ok: false, error: 'Invalid email or password.', status: 401 };
  }

  // 1. Built-in env credential
  const envEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword && envEmail && email === envEmail && safeEqual(password, envPassword)) {
    return { ok: true, email };
  }

  // 2. Supabase Auth password grant (server-side)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anon) {
    try {
      const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { apikey: anon, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return { ok: true, email };
    } catch {
      // Supabase unreachable: fall through to a generic failure (never leak details)
    }
  }

  return { ok: false, error: 'Invalid email or password.', status: 401 };
}

// ---------------------------------------------------------------------------
// Tiny in-memory login throttle (per IP). Good enough to blunt brute force on a
// single instance; use Redis/Upstash for strict multi-instance guarantees.
// ---------------------------------------------------------------------------
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function loginThrottle(ip: string): { blocked: boolean; retryAfter: number } {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) return { blocked: false, retryAfter: 0 };
  if (rec.count >= MAX_ATTEMPTS) {
    return { blocked: true, retryAfter: Math.ceil((rec.first + WINDOW_MS - now) / 1000) };
  }
  return { blocked: false, retryAfter: 0 };
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) attempts.set(ip, { count: 1, first: now });
  else rec.count += 1;
}

export function clearLoginFailures(ip: string): void {
  attempts.delete(ip);
}

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}
