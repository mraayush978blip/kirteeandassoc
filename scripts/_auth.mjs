// Shared helpers for the test scripts: loads .env.local and logs in through the real /api/admin/login.
import fs from 'node:fs';

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export function loadEnvLocal() {
  try {
    for (const line of fs.readFileSync('.env.local', 'utf-8').split('\n')) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    }
  } catch {}
}

export async function loginAdmin() {
  loadEnvLocal();
  const email = process.env.TEST_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const password = process.env.TEST_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Set ADMIN_EMAIL / ADMIN_PASSWORD (or TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD).');
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Admin login failed (${res.status}): ${await res.text()}`);
  const cookie = (res.headers.getSetCookie?.() || []).map((c) => c.split(';')[0]).join('; ');
  return { cookie, email };
}
