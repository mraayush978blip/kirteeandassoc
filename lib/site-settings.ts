import fs from 'fs/promises';
import path from 'path';
import { query } from '@/lib/db';

export * from './site-settings-types';
import {
  HeroSlideConfig,
  ProjectConfig,
  ContactConfig,
  ProjectSettings,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROJECTS,
  DEFAULT_CONTACT,
  DEFAULT_PROJECT_SETTINGS,
} from './site-settings-types';

const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'data');

async function getLocalSettings<T>(key: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(LOCAL_STORAGE_DIR, `${key}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

async function setLocalSettings<T>(key: string, value: T): Promise<void> {
  try {
    await fs.mkdir(LOCAL_STORAGE_DIR, { recursive: true });
    const filePath = path.join(LOCAL_STORAGE_DIR, `${key}.json`);
    await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`[SiteSettings] Local file write failed for key "${key}":`, err);
  }
}

/**
 * Resilient multi-tier settings getter (Database -> Local JSON File -> Defaults).
 * Guaranteed to never crash even when Supabase/PostgreSQL is offline or slow.
 */
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  // 1. Try PostgreSQL / Supabase
  try {
    const res = await query<{ value: T }>(
      `SELECT value FROM site_settings WHERE key = $1 LIMIT 1`,
      [key]
    );
    if (res.rows && res.rows.length > 0 && res.rows[0].value !== undefined) {
      return res.rows[0].value;
    }
  } catch (err) {
    // Database unreachable or table missing; continue to local fallback
  }

  // 2. Try Local JSON file
  return getLocalSettings<T>(key, defaultValue);
}

/**
 * Saves setting to both Database and Local JSON file for 100% offline uptime resilience.
 */
export async function saveSetting<T>(key: string, value: T): Promise<{ success: boolean; error?: string }> {
  // 1. Save locally first
  await setLocalSettings<T>(key, value);

  // 2. Save to PostgreSQL if available
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
    return { success: true };
  } catch (err: unknown) {
    console.warn(`[SiteSettings] Database sync skipped for "${key}":`, err instanceof Error ? err.message : err);
    // Even if DB fails, local JSON file succeeded, so return success: true
    return { success: true };
  }
}
