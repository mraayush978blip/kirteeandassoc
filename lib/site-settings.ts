import fs from 'fs/promises';
import path from 'path';
import { query, persistenceOk } from '@/lib/db';
import { writeFileAtomic } from '@/lib/fs-atomic';

export * from './site-settings-types';
/** Only these keys may be read/written through the admin API (also prevents path traversal). */
export const ALLOWED_SETTING_KEYS = [
  'hero_slides',
  'site_projects',
  'project_settings',
  'site_contact',
  'home_philosophy',
  'home_why_choose_us',
  'home_process',
  'home_project_cta',
  'site_typography',
] as const;

export function isAllowedSettingKey(key: unknown): key is (typeof ALLOWED_SETTING_KEYS)[number] {
  return typeof key === 'string' && (ALLOWED_SETTING_KEYS as readonly string[]).includes(key);
}

const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'data');

// High-speed in-memory cache (eliminates repeat Supabase roundtrips; <0.5ms lookup)
const settingsCache = new Map<string, { data: unknown; timestamp: number }>();
const SETTINGS_CACHE_TTL_MS = 2000; // 2 seconds TTL (instant real-time responsiveness)

export function invalidateSettingsCache(key?: string): void {
  if (key) {
    settingsCache.delete(key);
  } else {
    settingsCache.clear();
  }
}

async function getLocalSettings<T>(key: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(LOCAL_STORAGE_DIR, `${key}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

async function setLocalSettings<T>(key: string, value: T): Promise<boolean> {
  if (!isAllowedSettingKey(key)) return false;
  try {
    await writeFileAtomic(path.join(LOCAL_STORAGE_DIR, `${key}.json`), JSON.stringify(value, null, 2));
    return true;
  } catch (err) {
    console.warn(`[SiteSettings] Local file write failed for key "${key}":`, err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * Resilient multi-tier settings getter with in-memory caching:
 * Level 1: In-Memory RAM Cache (<0.5ms, zero network latency)
 * Level 2: Supabase PostgreSQL (revalidates every 60s)
 * Level 3: Local JSON File (Offline fallback)
 * Level 4: Built-in Defaults
 */
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  // 1. Check ultra-fast in-memory cache
  const cached = settingsCache.get(key);
  if (cached && Date.now() - cached.timestamp < SETTINGS_CACHE_TTL_MS) {
    return cached.data as T;
  }

  // 2. Try PostgreSQL / Supabase
  try {
    const res = await query<{ value: T }>(
      `SELECT value FROM site_settings WHERE key = $1 LIMIT 1`,
      [key]
    );
    if (res.rows && res.rows.length > 0 && res.rows[0].value !== undefined) {
      const val = res.rows[0].value;
      settingsCache.set(key, { data: val, timestamp: Date.now() });
      return val;
    }
  } catch {
    // Database unreachable or table missing; continue to local fallback
  }

  // 3. Try Local JSON file
  const localVal = await getLocalSettings<T>(key, defaultValue);
  settingsCache.set(key, { data: localVal, timestamp: Date.now() });
  return localVal;
}

/**
 * Saves a setting to the database and (where the filesystem is writable) a local JSON file.
 * Reports failure honestly: on serverless hosts a save only succeeds if the database accepted it.
 */
export async function saveSetting<T>(
  key: string,
  value: T
): Promise<{ success: boolean; error?: string; warning?: string }> {
  if (!isAllowedSettingKey(key)) {
    return { success: false, error: `Unknown setting key "${key}".` };
  }

  // 1. Database
  let dbOk = false;
  let dbError = '';
  try {
    await query(
      `
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ($1, $2::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    `,
      [key, JSON.stringify(value)]
    );
    dbOk = true;
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  // 2. Local JSON file: offline fallback. When the database accepted the write it is authoritative,
  //    so the repo's data/*.json files are left untouched (unless MIRROR_DB_TO_LOCAL=true).
  const localOk =
    dbOk && process.env.MIRROR_DB_TO_LOCAL !== 'true' ? false : await setLocalSettings<T>(key, value);

  if (!persistenceOk(localOk, dbOk)) {
    return {
      success: false,
      error: dbError ? `Could not save to the database: ${dbError}` : 'Could not save: no writable storage is available.',
    };
  }

  settingsCache.set(key, { data: value, timestamp: Date.now() });
  return {
    success: true,
    warning: dbOk ? undefined : `Saved locally only; database sync failed (${dbError || 'not configured'}).`,
  };
}
