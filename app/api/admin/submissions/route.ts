import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await query<any>(`
      SELECT * FROM submissions ORDER BY created_at DESC LIMIT 50
    `);
    return NextResponse.json({ success: true, submissions: rows });
  } catch {
    // If DB is offline, return sample/empty list
    return NextResponse.json({
      success: true,
      submissions: [
        {
          id: 'demo-sub-1',
          name: 'Ar. Vikramaditya Mehta',
          email: 'vikram@mehtastudio.in',
          phone: '+91 98200 12345',
          company: 'Mehta Architectural Atelier, Mumbai',
          topic: 'Bespoke Facade Grazing & IP68 Subterranean Fixtures',
          product: 'Subterranean Grazer',
          message:
            'We are specifying luminaires for a beachfront resort in Goa. Need certified IES files, 3000K warm white, and custom marine-grade 316L finish submittals for tender approval.',
          status: 'new',
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ],
      isDemo: true,
    });
  }
}
