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
│   └── data/                 # Product catalogue & CMS initial content
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

### 1. Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
npm start
```

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
