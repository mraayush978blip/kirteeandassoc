import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ---- tiny in-memory rate limiter (per IP): 5 inquiries / 10 minutes ----
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.set(ip, recent);
  return recent.length >= MAX_HITS;
}

function recordHit(ip: string): void {
  hits.set(ip, [...(hits.get(ip) || []), Date.now()]);
}

const str = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

async function sendNotificationEmail(rec: {
  name: string; email: string; phone: string | null; company: string | null;
  topic: string | null; product: string | null; message: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Kirtee Website <onboarding@resend.dev>',
        to: to.split(',').map((e) => e.trim()),
        reply_to: rec.email,
        subject: `New inquiry: ${rec.topic || rec.product || 'Website contact'} — ${rec.name}`,
        html: `<h2>New website inquiry</h2>
          <p><b>Name:</b> ${escapeHtml(rec.name)}<br>
          <b>Email:</b> ${escapeHtml(rec.email)}<br>
          <b>Phone:</b> ${escapeHtml(rec.phone || '-')}<br>
          <b>Company:</b> ${escapeHtml(rec.company || '-')}<br>
          <b>Subject:</b> ${escapeHtml(rec.topic || '-')}<br>
          <b>Product:</b> ${escapeHtml(rec.product || '-')}</p>
          <p style="white-space:pre-wrap">${escapeHtml(rec.message)}</p>`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    // Spam honeypot: pretend success, store nothing
    if (body.websiteHoneypot) {
      return NextResponse.json({ success: true, message: 'Inquiry received.' });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ success: false, message: 'Too many inquiries. Please try again in a few minutes.' }, { status: 429 });
    }

    const name = str(body.name, 200);
    const email = str(body.email, 254);
    const message = str(body.message, 5000);

    if (!name) return NextResponse.json({ success: false, message: 'Valid full name is required.' }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Valid email address is required.' }, { status: 400 });
    }
    if (!message || message.length < 10) {
      return NextResponse.json({ success: false, message: 'Inquiry message must be at least 10 characters.' }, { status: 400 });
    }
    if (body.consent === false) {
      return NextResponse.json({ success: false, message: 'Specification consent is mandatory.' }, { status: 400 });
    }

    // Only valid submissions count towards the limit (typos shouldn't lock visitors out)
    recordHit(ip);

    const record = {
      name,
      email,
      phone: str(body.phone, 60),
      company: str(body.company, 200),
      topic: str(body.topic, 255),
      product: str(body.product, 255),
      message,
    };

    // 1. Database (authoritative on serverless hosts)
    let stored = false;
    try {
      const { query } = await import('@/lib/db');
      await query(
        `INSERT INTO submissions (name, email, phone, company, topic, product, message, status, ip_address, user_agent, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', $8, $9, NOW())`,
        [record.name, record.email, record.phone, record.company, record.topic, record.product, record.message, ip.slice(0, 100), (request.headers.get('user-agent') || '').slice(0, 500)]
      );
      stored = true;
    } catch (err) {
      console.warn('[Contact] DB insert failed:', err instanceof Error ? err.message : err);
    }

    // 2. Local inbox file (works on a normal server / local dev; harmless no-op on read-only hosts)
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'submissions.json');
      let current: unknown[] = [];
      try {
        current = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        if (!Array.isArray(current)) current = [];
      } catch {}
      current.unshift({ id: `sub-${Date.now()}`, ...record, status: 'new', created_at: new Date().toISOString() });
      await fs.writeFile(filePath, JSON.stringify(current.slice(0, 200), null, 2), 'utf-8');
      stored = stored || !process.env.VERCEL;
    } catch {}

    // 3. Email notification to the studio
    const emailed = await sendNotificationEmail(record);

    if (!stored && !emailed) {
      console.error('[Contact] Inquiry could not be stored or emailed.');
      return NextResponse.json(
        { success: false, message: 'We could not record your inquiry right now. Please email us or message us on WhatsApp.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry successfully transmitted to Kirtee & Associates specification team.',
    });
  } catch (error: unknown) {
    console.error('Contact form submission processing error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, message: 'An unexpected server error occurred while processing the request.' },
      { status: 500 }
    );
  }
}
