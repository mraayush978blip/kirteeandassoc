import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

/**
 * Media storage abstraction.
 *
 *  - Production (Vercel): uploads go to a PUBLIC Supabase Storage bucket, because the
 *    serverless filesystem is read-only/ephemeral and files written to public/media vanish.
 *    Needs SUPABASE_SERVICE_ROLE_KEY (server only!) and NEXT_PUBLIC_SUPABASE_URL.
 *  - Local development without a service key: files are written to public/media.
 */

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'media';
const LOCAL_DIR = path.join(process.cwd(), 'public', 'media');

function supabaseConfig(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) return { url: url.replace(/\/$/, ''), key };
  return null;
}

export function storageMode(): 'supabase' | 'local' {
  return supabaseConfig() ? 'supabase' : 'local';
}

export function isSafeFilename(name: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,200}$/.test(name) && !name.includes('..');
}

/**
 * Auth headers for the Storage REST API.
 * - New-style secret keys (`sb_secret_...`) are not JWTs: send them in `apikey` only.
 * - Legacy service_role keys are JWTs: send them as both `apikey` and Bearer token.
 */
function authHeaders(key: string): Record<string, string> {
  return key.startsWith('sb_secret_') ? { apikey: key } : { apikey: key, Authorization: `Bearer ${key}` };
}

async function ensureBucket(cfg: { url: string; key: string }): Promise<void> {
  await fetch(`${cfg.url}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...authHeaders(cfg.key), 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
    signal: AbortSignal.timeout(10000),
  }).catch(() => undefined);
}

async function uploadToSupabase(cfg: { url: string; key: string }, filename: string, buffer: Buffer, contentType: string) {
  const doUpload = () =>
    fetch(`${cfg.url}/storage/v1/object/${BUCKET}/${encodeURIComponent(filename)}`, {
      method: 'POST',
      headers: {
        ...authHeaders(cfg.key),
        'Content-Type': contentType,
        'x-upsert': 'true',
        'Cache-Control': 'max-age=31536000',
      },
      body: new Uint8Array(buffer),
      signal: AbortSignal.timeout(30000),
    });

  let res = await doUpload();
  if (res.status === 404 || res.status === 400) {
    // Bucket probably doesn't exist yet: create it (public) and retry once.
    await ensureBucket(cfg);
    res = await doUpload();
  }
  if (!res.ok) {
    throw new Error(`Supabase Storage upload failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }
  return `${cfg.url}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(filename)}`;
}

/** Stores a file and returns its public URL (absolute for Supabase, /media/... for local). */
export async function storeMedia(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  if (!isSafeFilename(filename)) throw new Error('Unsafe filename.');
  const cfg = supabaseConfig();
  if (cfg) return uploadToSupabase(cfg, filename, buffer, contentType);

  if (process.env.VERCEL) {
    throw new Error(
      'Image storage is not configured. Set SUPABASE_SERVICE_ROLE_KEY (and NEXT_PUBLIC_SUPABASE_URL) in Vercel — the serverless filesystem is read-only.'
    );
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, filename), buffer);
  return `/media/${filename}`;
}

/** Deletes a stored file from every backend it may live in. Returns freed bytes (local only). */
export async function deleteMedia(filename: string): Promise<number> {
  if (!isSafeFilename(filename)) return 0;
  let freed = 0;
  try {
    const p = path.join(LOCAL_DIR, filename);
    const st = await fs.stat(p);
    await fs.unlink(p);
    freed = st.size;
  } catch {
    /* not on local disk */
  }
  const cfg = supabaseConfig();
  if (cfg) {
    try {
      await fetch(`${cfg.url}/storage/v1/object/${BUCKET}/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: authHeaders(cfg.key),
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      /* ignore */
    }
  }
  return freed;
}

const MIME_EXT: Record<string, string> = {
  'image/webp': 'webp',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

/**
 * Converts an inline base64 `data:image/...` URL into a stored file and returns its URL.
 * Inline images bloat the product JSON/HTML (a single product was ~740 KB), so they are
 * moved to storage on save. Returns the original string if it is not a data URL or on failure.
 */
export async function externalizeDataUrl(value: string, cache?: Map<string, string>): Promise<string> {
  if (typeof value !== 'string' || !value.startsWith('data:image/')) return value;
  const cached = cache?.get(value);
  if (cached) return cached;

  const match = /^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i.exec(value);
  const ext = match ? MIME_EXT[match[1].toLowerCase()] : undefined;
  if (!match || !ext) return value;

  try {
    const buffer = Buffer.from(match[2], 'base64');
    const hash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 16);
    const url = await storeMedia(buffer, `inline-${hash}.${ext}`, match[1].toLowerCase());
    cache?.set(value, url);
    return url;
  } catch (err) {
    console.warn('[Media] Could not externalize inline image, keeping data URL:', err instanceof Error ? err.message : err);
    return value;
  }
}
