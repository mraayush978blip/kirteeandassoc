# Database Connection & Setup Guide — Kirtee & Associates

This project supports PostgreSQL 13+ with automatic connection pooling, fallback to offline cache, and image compression storage.

## 1. Quick Database Setup

You can use **any** PostgreSQL database provider:
- [Supabase](https://supabase.com/) (Free tier available)
- [Neon Serverless Postgres](https://neon.tech/) (Fast setup, great with Next.js/Vercel)
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Railway](https://railway.app/)
- Local PostgreSQL (`docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`)

---

## 2. Running `schema.sql`

Once your PostgreSQL database is created:

### Option A: Using Web SQL Editor (Supabase / Neon / Railway)
1. Open your database dashboard (e.g. Supabase SQL Editor or Neon SQL Console).
2. Copy the entire contents of [`schema.sql`](../schema.sql).
3. Paste and click **Run**.
4. All tables (`products`, `categories`, `media`, `submissions`, `users`, `site_settings`) and initial seed luminaires will be created instantly.

### Option B: Using psql CLI
```bash
psql "postgres://username:password@your-host:5432/your-db?sslmode=require" -f schema.sql
```

---

## 3. Configuring `.env.local`

Add your connection string to `.env.local` (and in Vercel Project Settings > Environment Variables):

```env
# PostgreSQL connection string
DATABASE_URL=postgres://postgres:yourpassword@db.yourprovider.com:5432/postgres?sslmode=require

# Optional alias for Payload CMS compatibility
DATABASE_URI=postgres://postgres:yourpassword@db.yourprovider.com:5432/postgres?sslmode=require

# Media storage compression quality (80-95 recommended for architectural images)
MEDIA_WEBP_QUALITY=85
```

---

## 4. Verification in Admin Panel

1. Start development server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin`
3. Click on the **Database & SQL** tab.
4. The panel will display:
   - 🟢 **PostgreSQL Connected**
   - Active latency (e.g. `24ms`)
   - Total rows in `products`, `categories`, `media`, and `submissions`.
