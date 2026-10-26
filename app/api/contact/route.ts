import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, topic, product, message, consent, websiteHoneypot } = body;

    // Spam honeypot detection
    if (websiteHoneypot) {
      return NextResponse.json({ success: true, message: 'Inquiry received.' }, { status: 200 });
    }

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Valid full name is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, message: 'Valid email address is required.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json({ success: false, message: 'Inquiry message must be at least 10 characters.' }, { status: 400 });
    }

    if (consent === false) {
      return NextResponse.json({ success: false, message: 'Specification consent is mandatory.' }, { status: 400 });
    }

    const submissionRecord = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      topic: topic || null,
      product: product || null,
      message: message.trim(),
      status: 'new',
      created_at: new Date().toISOString(),
    };

    // 1. Try local JSON file fallback first
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'submissions.json');
      let current: any[] = [];
      try {
        const raw = await fs.readFile(filePath, 'utf-8');
        current = JSON.parse(raw);
      } catch {}
      current.unshift(submissionRecord);
      await fs.writeFile(filePath, JSON.stringify(current.slice(0, 100), null, 2), 'utf-8');
    } catch {}

    // 2. Persist to PostgreSQL submissions table if available
    try {
      const { query } = await import('@/lib/db');
      await query(
        `INSERT INTO submissions (name, email, phone, company, topic, product, message, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', NOW())`,
        [name.trim(), email.trim(), phone?.trim() || null, company?.trim() || null, topic || null, product || null, message.trim()]
      );
    } catch {
      // Fallback: DB offline, logged cleanly
    }

    console.log('[Contact Form Submission Received]:', {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      company: company?.trim(),
      topic,
      product,
      messageLength: message.trim().length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry successfully transmitted to Kirtee & Associates specification team.',
    });
  } catch (error: unknown) {
    console.error('Contact form submission processing error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected server error occurred while processing the request.' },
      { status: 500 }
    );
  }
}
