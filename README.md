# Kirtee & Associates — Architectural Luminaire Platform

A production-grade web application and Content Management System built for **Kirtee & Associates** architectural lighting and bespoke luminaire engineering.

Built in strict compliance with:
- `Website brief 2026.pdf` (Client Requirement Specification)
- `kirteeandassoc.pdf` (Master Production Brief 2026)

---

## 🏛️ Architecture & Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router, Server Components by default)
- **Language**: TypeScript (strict type checking)
- **CMS / Backend**: [Payload CMS](https://payloadcms.com) v3 with PostgreSQL adapter
- **Database**: PostgreSQL (UUID identifiers, relational foreign keys, structured schemas)
- **Styling**: Centralized Design System (`styles/tokens.css` & `styles/globals.css`) with zero hardcoded values
- **Icons**: Accessible SVGs and Lucide icons
- **SEO & Schema**: JSON-LD Structured Data (`Organization`, `Product`, `WebSite`, `BreadcrumbList`), dynamic XML sitemap (`/sitemap.xml`), and `robots.txt`
- **Email & Validation**: Server-side validation with spam honeypot defense

---

## 📁 Project Directory Structure

```text
kirteeandassoc/
├── app/                      # Next.js App Router
│   ├── api/contact/          # Production contact inquiry API route
│   ├── contact/              # Page 03: Contact Page
│   ├── products/             # Catalogue listing page
│   │   └── [slug]/           # Page 02: Master Reusable Product Page template
│   ├── not-found.tsx         # Architectural 404 page
│   ├── error.tsx             # 500 error boundary
│   ├── layout.tsx            # Root layout, Header, Footer, Organization Schema
│   ├── page.tsx              # Page 01: Home page
│   ├── robots.ts             # Robots.txt generator
│   └── sitemap.ts            # Dynamic XML Sitemap generator
├── components/               # Modular component hierarchy
│   ├── contact/              # ContactForm component
│   ├── home/                 # Homepage sections (Hero, Intro, Featured, Storytelling, CTA)
│   ├── layout/               # Header, Footer, Navigation
│   ├── products/             # ProductCard, ProductGrid, ProductGallery, ProductSpecsTable, ProductDownloads
│   ├── seo/                  # JsonLd structured data generator
│   └── ui/                   # Reusable Button, Badge, Icons
├── config/                   # Centralized configuration & site metadata
│   ├── designTokens.ts       # Design system token definitions
│   └── site.ts               # Brand, contact, and navigation configuration
├── lib/                      # Core business logic & repositories
├── payload/                  # Payload CMS collections & globals
│   ├── collections/          # Users, Products, Categories, Media, Submissions
│   └── globals/              # SiteSettings, HomePage, ContactPage
├── styles/                   # Centralized Design Tokens & Typography
│   ├── tokens.css            # CSS variables for colors, typography, spacing, shadows
│   └── globals.css           # Global stylesheet and architectural utilities
├── types/                    # Strict TypeScript type definitions
│   ├── cms.ts                # CMS section & navigation data types
│   └── product.ts            # Product, category, spec, and download data types
├── payload.config.ts         # Payload CMS configuration
├── REQUIREMENTS-CHECKLIST.md # Master 73-section requirements checklist
└── README.md
```

---

## 🚀 Getting Started

### 1. Environment
```bash
cp .env.example .env.local
```
Fill in at least: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`ADMIN_SESSION_SECRET` (`openssl rand -hex 32`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
For admin image uploads on Vercel also set `SUPABASE_SERVICE_ROLE_KEY` (server-only), and
`RESEND_API_KEY` + `CONTACT_NOTIFICATION_EMAIL` for inquiry emails. Set the same variables in Vercel.

### 2. Install & create the database tables
```bash
npm install
npm run db:setup      # applies schema.sql to DATABASE_URL (safe to re-run)
```
Products and projects live only in the database (nothing is bundled with the code). Sign in at `/ad`
and add them there.

### 3. Run
```bash
npm run dev           # http://localhost:3000   (admin: /ad)
npm run test:e2e      # API test suite (needs the dev server running)
npm run test:sync     # admin -> frontend live-sync check
```

### Architecture note
The running app uses **Next.js + Supabase Postgres (`lib/db.ts`) + Supabase Storage**. Payload CMS
files (`payload/`, `payload.config.ts`) are optional and disabled unless `ENABLE_PAYLOAD=true`.

### Admin security model
Admin login is verified server-side (`/api/admin/login`) and stored in a signed, HttpOnly,
SameSite=Strict cookie. Every `/api/admin/*` route calls `requireAdmin()`. Never put credentials in client code.

---

## 📋 Primary Endpoints

- **Homepage**: `/`
- **Product Catalogue**: `/products`
- **Product Inner Page (Master Template)**: `/products/[slug]` (e.g. `/products/ingraze-frame-1000`)
- **Contact Page**: `/contact` (Primary representative: Divvya — `7096962640`)
- **Contact Form Submission API**: `POST /api/contact`
- **Dynamic XML Sitemap**: `/sitemap.xml`
- **Robots Specification**: `/robots.txt`

---

## 🔒 Security & Verification

- Rate limiting and honeypot bot trap on contact inquiries
- No sensitive keys or database credentials exposed to client bundles
- WCAG 2.2 AA compliant focus states, accessible form labels, and skip-to-content links
- Complete requirements verified in [REQUIREMENTS-CHECKLIST.md](file:///home/aayush/imp/imp/kirteeandassoc/REQUIREMENTS-CHECKLIST.md).
