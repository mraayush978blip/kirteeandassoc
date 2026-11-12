// Applies schema.sql to the database in DATABASE_URL (safe to re-run: all statements are IF NOT EXISTS).
// Usage: node scripts/setup-db.mjs
import fs from 'node:fs';
import pg from 'pg';
import { loadEnvLocal } from './_auth.mjs';

loadEnvLocal();
const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL is not set.'); process.exit(1); }

const client = new pg.Client({ connectionString: url.replace(/[?&]sslmode=[^&]+/g, ''), ssl: { rejectUnauthorized: false } });
try {
  await client.connect();
  await client.query(fs.readFileSync('schema.sql', 'utf-8'));
  const { rows } = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY 1");
  console.log('Schema applied. Tables:', rows.map((r) => r.table_name).join(', '));
  console.log('Start the app: the product catalog and settings seed themselves from data/*.json on first load.');
} catch (e) {
  console.error('Setup failed:', e.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
