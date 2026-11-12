import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { writeFileAtomic } from '@/lib/fs-atomic';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const STATUSES = ['new', 'reviewed', 'quoted', 'archived'] as const;
const LOCAL_FILE = path.join(process.cwd(), 'data', 'submissions.json');

type Row = Record<string, unknown> & { id: string; status?: string };

async function readLocal(): Promise<Row[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(LOCAL_FILE, 'utf-8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** The database is authoritative; the local inbox file is only used when the DB is unreachable. */
async function dbAvailable(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { rows } = await query<Row>(`SELECT * FROM submissions ORDER BY created_at DESC LIMIT 500`);
    return NextResponse.json({ success: true, submissions: rows, source: 'database' });
  } catch {
    return NextResponse.json({ success: true, submissions: await readLocal(), source: 'local-file' });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  let body: { id?: unknown; status?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }
  const { id, status } = body;
  if (typeof id !== 'string' || !id || !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return NextResponse.json({ success: false, message: `id and a valid status (${STATUSES.join(', ')}) are required.` }, { status: 400 });
  }

  if (await dbAvailable()) {
    const res = await query('UPDATE submissions SET status = $1 WHERE id::text = $2', [status, id]);
    if (res.rowCount === 0) return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  }
  const local = await readLocal();
  const item = local.find((r) => r.id === id);
  if (!item) return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
  item.status = status as string;
  try {
    await writeFileAtomic(LOCAL_FILE, JSON.stringify(local, null, 2));
  } catch {
    return NextResponse.json({ success: false, message: 'Could not save: database offline and no writable storage.' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, message: 'Missing enquiry id.' }, { status: 400 });

  if (await dbAvailable()) {
    const res = await query('DELETE FROM submissions WHERE id::text = $1', [id]);
    if (res.rowCount === 0) return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  }
  const local = await readLocal();
  if (!local.some((r) => r.id === id)) return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
  try {
    await writeFileAtomic(LOCAL_FILE, JSON.stringify(local.filter((r) => r.id !== id), null, 2));
  } catch {
    return NextResponse.json({ success: false, message: 'Could not delete: database offline and no writable storage.' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
