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

    if (!consent) {
      return NextResponse.json({ success: false, message: 'Specification consent is mandatory.' }, { status: 400 });
    }

    // In production with RESEND_API_KEY or SMTP configured, trigger transactional email dispatch:
    // e.g. await sendEmail({ to: 'inquiries@kirteeandassoc.com', subject: `[Specification] ${topic}`, ... })
    // For local development and verification, log the formatted submission cleanly:
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
