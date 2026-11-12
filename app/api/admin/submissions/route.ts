import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const { rows } = await query(`SELECT * FROM submissions ORDER BY created_at DESC LIMIT 200`);
    return NextResponse.json({ success: true, submissions: rows, source: 'database' });
  } catch {
    // Database offline: fall back to the local inbox file (dev / self-hosted). No fake data.
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const raw = await fs.readFile(path.join(process.cwd(), 'data', 'submissions.json'), 'utf-8');
      const local = JSON.parse(raw);
      return NextResponse.json({ success: true, submissions: Array.isArray(local) ? local : [], source: 'local-file' });
    } catch {
      return NextResponse.json({ success: true, submissions: [], source: 'empty' });
    }
  }
}
