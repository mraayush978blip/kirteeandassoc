-- =====================================================================
-- ZENVORA / KIRTEE & ASSOCIATES — SUPABASE DATABASE SETUP SCRIPT
-- Copy-paste this entire file into your Supabase Dashboard:
-- Project -> SQL Editor -> New Query -> Paste & Click "RUN"
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 2. USERS TABLE (Admin Authentication)
-- =====================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin', -- 'admin', 'editor', 'viewer'
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- 3. CATEGORIES TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- 4. MEDIA TABLE (WebP Compressed Storage Tracking & 1GB Quota Guard)
-- =====================================================================
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    original_size_bytes BIGINT NOT NULL,
    compressed_size_bytes BIGINT NOT NULL,
    savings_percent NUMERIC(5,2),
    width INTEGER,
    height INTEGER,
    format VARCHAR(20) DEFAULT 'webp',
    quality INTEGER DEFAULT 85,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- 5. PRODUCTS TABLE (Dry Goods & Wet Goods Architectural Luminaires)
-- =====================================================================
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    sku VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    code_label VARCHAR(100),
    designer VARCHAR(255),
    catalog_type VARCHAR(50) NOT NULL DEFAULT 'dry', -- 'dry' | 'wet' | 'bespoke'
    category_id VARCHAR(100) REFERENCES categories(id) ON DELETE SET NULL,
    subcategory VARCHAR(255),
    tagline TEXT,
    short_description TEXT,
    full_description TEXT,
    editorial_story TEXT,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'published', -- 'draft' | 'published' | 'archived'
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    hero_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
    hero_image_url TEXT,
    hero_image_alt TEXT,
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '[]'::jsonb,
    downloads JSONB DEFAULT '[]'::jsonb,
    hero_carousel_images JSONB DEFAULT '[]'::jsonb,
    social_links JSONB DEFAULT '{}'::jsonb,
    brochure_button_text TEXT,
    specs_eyebrow TEXT,
    specs_heading TEXT,
    specs_description TEXT,
    gallery_eyebrow TEXT,
    gallery_heading TEXT,
    gallery_description TEXT,
    related_heading TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Safe column additions if products table already exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS hero_carousel_images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brochure_button_text TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs_eyebrow TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs_heading TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_eyebrow TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_heading TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS related_heading TEXT;

-- =====================================================================
-- 6. CONTACT SUBMISSIONS / SPECIFICATION INQUIRIES
-- =====================================================================
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    company VARCHAR(255),
    topic VARCHAR(255),
    product VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- 'new' | 'reviewed' | 'quoted' | 'archived'
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- 7. SITE SETTINGS TABLE (Zero-Downtime Dynamic Settings Engine)
-- Stores: hero_slides, site_projects, project_settings, site_contact
-- =====================================================================
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- 8. INDEXES FOR LIGHTNING FAST QUERIES (< 5ms response time)
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_catalog_type ON products(catalog_type);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_media_format ON media(format);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- =====================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures public visitors can read, while admin can read/write
-- =====================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Categories Policies
DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access on categories" ON categories;
CREATE POLICY "Admin full access on categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- Products Policies
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access on products" ON products;
CREATE POLICY "Admin full access on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Media Policies
DROP POLICY IF EXISTS "Public can view media" ON media;
CREATE POLICY "Public can view media" ON media FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access on media" ON media;
CREATE POLICY "Admin full access on media" ON media FOR ALL USING (true) WITH CHECK (true);

-- Site Settings Policies
DROP POLICY IF EXISTS "Public can view site_settings" ON site_settings;
CREATE POLICY "Public can view site_settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access on site_settings" ON site_settings;
CREATE POLICY "Admin full access on site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- Submissions Policies (Visitors can send messages, only authenticated/service can read)
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON submissions;
CREATE POLICY "Public can submit contact inquiries" ON submissions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin can read submissions" ON submissions;
CREATE POLICY "Admin can read submissions" ON submissions FOR SELECT USING (true);

-- Users Policies
DROP POLICY IF EXISTS "Users can read own record or admin" ON users;
CREATE POLICY "Users can read own record or admin" ON users FOR SELECT USING (true);

-- =====================================================================
-- 10. SUPABASE STORAGE BUCKET CREATION (1GB Hobby Quota Protection)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    5242880, -- 5 MB max per file limit (recommended for WebP compression)
    ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880;

-- Storage RLS: Public read, Public upload (or authenticated)
DROP POLICY IF EXISTS "Public Read on Media Bucket" ON storage.objects;
CREATE POLICY "Public Read on Media Bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Allow Upload to Media Bucket" ON storage.objects;
CREATE POLICY "Allow Upload to Media Bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Allow Delete from Media Bucket" ON storage.objects;
CREATE POLICY "Allow Delete from Media Bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'media');

-- =====================================================================
-- 11. INITIAL SEED DATA
-- =====================================================================

-- Seed Admin User
INSERT INTO users (id, email, name, role)
VALUES 
  ('9460e78f-ffe8-420a-aa7e-baabbe4643ab', 'zenvora204@gmail.com', 'Zenvora Admin', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Seed Categories
INSERT INTO categories (id, slug, name, description, order_index) VALUES
('cat-dry', 'dry-goods', 'Dry Goods', 'Architectural indoor lighting systems, downlights, and fractal diffusers for refined interiors.', 1),
('cat-wet', 'wet-goods', 'Wet Goods', 'Submerged, in-ground, and exterior weatherproof luminaires engineered in 316L stainless steel.', 2),
('cat-inground', 'in-ground', 'In-Ground & Subterranean', 'Walk-over and drive-over recessed luminaires for facade grazing and landscape paths.', 3),
('cat-grazers', 'linear-grazers', 'Linear Systems & Profiles', 'Continuous architectural wall grazers engineered for vertical surface reveals.', 4),
('cat-bespoke', 'bespoke-commissions', 'Bespoke Luminaire Engineering', 'Custom engineered luminaires tailored specifically to signature architectural briefs.', 5)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- Seed Default Hero Swipe Slides (Home Page Editor)
INSERT INTO site_settings (key, value) VALUES
('hero_slides', '[
  {
    "id": "hero-1",
    "slotId": "hero-slide-1",
    "eyebrow": "ARCHITECTURAL LIGHTING SYSTEMS",
    "title": "LIGHT,\nREFINED.",
    "subtitle": "Bespoke architectural lighting systems engineered for exceptional spaces.",
    "ctaText": "EXPLORE COLLECTIONS",
    "ctaHref": "/products",
    "imageUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    "imageAlt": "Bespoke pendant luminaire illuminating warm dining table overlooking ocean twilight",
    "order": 1
  },
  {
    "id": "hero-2",
    "slotId": "hero-slide-2",
    "eyebrow": "PRECISION OPTICAL CRAFT",
    "title": "SPACE,\nDEFINED.",
    "subtitle": "Micro-aperture linear wall grazers and dark-light downlights for monolithic architecture.",
    "ctaText": "DISCOVER DRY GOODS",
    "ctaHref": "/dry-goods",
    "imageUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85",
    "imageAlt": "Continuous linear lighting grazing architectural travertine wall",
    "order": 2
  },
  {
    "id": "hero-3",
    "slotId": "hero-slide-3",
    "eyebrow": "IP68 SUBMERSIBLE SYSTEMS",
    "title": "FORM,\nENDURING.",
    "subtitle": "Marine-grade in-ground facade projectors crafted for extreme subterranean resilience.",
    "ctaText": "DISCOVER WET GOODS",
    "ctaHref": "/wet-goods",
    "imageUrl": "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=2000&q=85",
    "imageAlt": "Articulated architectural bronze projectors illuminating water and facade",
    "order": 3
  }
]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed Default Projects
INSERT INTO site_settings (key, value) VALUES
('site_projects', '[
  {
    "id": "proj-1",
    "num": "01",
    "title": "PRIVATE RESIDENCE",
    "location": "Mumbai, India",
    "category": "Residential",
    "year": "2025",
    "description": "Precision recessed linear grazing and bespoke bronze pendant luminaires accentuating monolithic limestone walls.",
    "imageUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "slug": "private-residence-mumbai",
    "order": 1,
    "isFeatured": true
  },
  {
    "id": "proj-2",
    "num": "02",
    "title": "BOUTIQUE HOTEL",
    "location": "Dubai, UAE",
    "category": "Hospitality",
    "year": "2024",
    "description": "Custom acoustic luminaire arrays delivering warm glare-free ambient illumination in double-height atrium.",
    "imageUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    "slug": "boutique-hotel-dubai",
    "order": 2,
    "isFeatured": true
  },
  {
    "id": "proj-3",
    "num": "03",
    "title": "ARCHITECTURAL INTERIOR",
    "location": "London, UK",
    "category": "Commercial",
    "year": "2024",
    "description": "Ultra-low glare UGR < 10 downlight arrays integrated invisibly within acoustic architectural timber slats.",
    "imageUrl": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    "slug": "architectural-interior-london",
    "order": 3,
    "isFeatured": true
  },
  {
    "id": "proj-4",
    "num": "04",
    "title": "CULTURAL PAVILION",
    "location": "Milan, Italy",
    "category": "Cultural",
    "year": "2025",
    "description": "Dynamic tunable white grazing systems engineered for gallery exhibition spaces.",
    "imageUrl": "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80",
    "slug": "cultural-pavilion-milan",
    "order": 4,
    "isFeatured": true
  }
]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed Project Visibility Setting (Default OFF per user requirement until photography is ready)
INSERT INTO site_settings (key, value) VALUES
('project_settings', '{
  "showOnWebsite": false
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed Contact Details (WhatsApp Redirection & Studio Info)
INSERT INTO site_settings (key, value) VALUES
('site_contact', '{
  "whatsappNumber": "+91 70969 62640",
  "whatsappMessage": "Hello Zenvora Architectural Lighting, I am inquiring regarding luminaire specifications for an upcoming project.",
  "inquiryEmail": "inquiries@kirteeandassoc.com",
  "phoneNumber": "+91 70969 62640",
  "studioAddress": "Kirtee & Associates Architectural Studio, Worli Sea Face, Mumbai 400030, India",
  "businessHours": "Monday – Friday: 9:30 AM – 6:30 PM IST",
  "instagramUrl": "https://instagram.com/kirteeandassoc",
  "linkedinUrl": "https://linkedin.com/company/kirteeandassoc"
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed Core Products
INSERT INTO products (
    id, slug, sku, name, code_label, designer, catalog_type, category_id, subcategory,
    tagline, short_description, full_description, status, is_featured, order_index,
    hero_image_url, hero_image_alt, specifications, downloads
) VALUES
(
    'prod-calipso',
    'calipso',
    'CALIPSO-01',
    'Calipso',
    'CALIPSO',
    'Neil Poulton',
    'dry',
    'cat-dry',
    'Ceiling & Wall Luminaire',
    'Honeycomb Fractal Ceiling and Wall Architectural Luminaire',
    'Organic honeycomb architectural luminaire generated from fractal moon algorithms, offering diffuse comfort and emotional lighting geometry.',
    'The unique honeycomb grill of Calipso was generated by feeding a photo of the moon into an image-based algorithm. The resulting fractal shape, an impure geometry that displays the irregular beauty of nature, is built from an organic honeycomb of different diameter tubes.',
    'published',
    true,
    1,
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80',
    'Calipso architectural honeycomb luminaire with high-performance optical geometry',
    '[
        {"id": "cs1", "label": "Luminous Flux", "value": "2,884", "unit": "lm", "group": "Optical"},
        {"id": "cs2", "label": "Color Temperature", "value": "3000K / 2700K Warm White", "group": "Optical"},
        {"id": "cs3", "label": "Color Rendering", "value": "CRI 90 (R9 > 50)", "group": "Optical"},
        {"id": "cs4", "label": "Optical Efficiency", "value": "55%", "group": "Optical"},
        {"id": "cs5", "label": "Total Power", "value": "30", "unit": "W", "group": "Electrical"},
        {"id": "cs6", "label": "Dimming Protocol", "value": "Push / DALI / App Bluetooth", "group": "Electrical"},
        {"id": "cs7", "label": "Diameter", "value": "Ø 526", "unit": "mm", "group": "Physical"},
        {"id": "cs8", "label": "Body Material", "value": "Technopolymer & Thermoplastic Resins", "group": "Physical"},
        {"id": "cs9", "label": "Protection Rating", "value": "IP20 (Indoor Dry)", "group": "Physical"}
    ]'::jsonb,
    '[
        {"id": "cd1", "title": "Technical Datasheet (Google Drive)", "fileUrl": "https://drive.google.com/file/d/sample-calipso-datasheet/view", "fileType": "PDF"}
    ]'::jsonb
),
(
    'prod-a24',
    'a-24-system',
    'A24-SYS',
    'A.24 System',
    'A.24',
    'Carlotta de Bevilacqua',
    'dry',
    'cat-dry',
    'Continuous Linear Architectural System',
    'Continuous Linear Architectural Track and Profile System',
    'Ultra-slender 24mm profile seamlessly integrating direct diffuse light, grazing sharp optics, and vector magnetic projectors into continuous fluid layouts.',
    'A.24 is an open system that traces complex geometric shapes in space with minimal visual impact. The 24mm thin section can incorporate continuous diffuse emission, wall washer grazing, or high-definition downlights with micro-reflectors.',
    'published',
    true,
    2,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'A.24 continuous architectural linear lighting system',
    '[
        {"id": "a24-1", "label": "Profile Width", "value": "24", "unit": "mm", "group": "Physical"},
        {"id": "a24-2", "label": "Luminous Flux", "value": "1,900 / m", "unit": "lm", "group": "Optical"},
        {"id": "a24-3", "label": "Color Temperature", "value": "2700K / 3000K / 4000K", "group": "Optical"},
        {"id": "a24-4", "label": "Glare Rating", "value": "UGR < 10 (Controlled)", "group": "Optical"},
        {"id": "a24-5", "label": "Control System", "value": "DALI-2 / Casambi Wireless", "group": "Electrical"},
        {"id": "a24-6", "label": "Finish Options", "value": "Matte White / Matte Black / Brushed Silver", "group": "Physical"}
    ]'::jsonb,
    '[
        {"id": "a24-d1", "title": "System Specification Guide (Google Drive)", "fileUrl": "https://drive.google.com/file/d/sample-a24-guide/view", "fileType": "PDF"}
    ]'::jsonb
),
(
    'prod-subterranean-grazer',
    'subterranean-grazer',
    'SUB-GRZ-01',
    'Subterranean Grazer',
    'SUBTERRANEAN',
    'Kirtee & Associates Studio',
    'wet',
    'cat-wet',
    'In-Ground Subterranean Linear Grazer',
    'Marine-Grade IP68 Walk-Over and Drive-Over Grazing Fixture',
    'Heavy-duty drive-over in-ground linear grazer with 8° asymmetrical optic designed to graze architectural stone facades, retaining walls, and water features.',
    'Engineered in AISI 316L marine-grade stainless steel with nitrogen-sealed optical chamber. Completely submersible (IP68 up to 10m) and drive-over rated up to 25kN.',
    'published',
    true,
    3,
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80',
    'Subterranean Grazer IP68 in-ground facade grazing luminaire',
    '[
        {"id": "sg-1", "label": "Protection Rating", "value": "IP68 Submersible (10m) & IP69K", "group": "Physical"},
        {"id": "sg-2", "label": "Drive-Over Load", "value": "25 kN (2,500 kg)", "group": "Physical"},
        {"id": "sg-3", "label": "Housing Material", "value": "Marine-grade 316L Stainless Steel", "group": "Physical"},
        {"id": "sg-4", "label": "Optics", "value": "8° x 45° Asymmetric Facade Wall Grazer", "group": "Optical"},
        {"id": "sg-5", "label": "CCT Options", "value": "2700K / 3000K / Amber / RGBW", "group": "Optical"}
    ]'::jsonb,
    '[
        {"id": "sg-d1", "title": "IP68 Subterranean Grazer Datasheet (Google Drive)", "fileUrl": "https://drive.google.com/file/d/sample-sub-grazer/view", "fileType": "PDF"}
    ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    specifications = EXCLUDED.specifications,
    downloads = EXCLUDED.downloads;

-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_products_timestamp ON products;
CREATE TRIGGER trg_update_products_timestamp
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_update_settings_timestamp ON site_settings;
CREATE TRIGGER trg_update_settings_timestamp
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();
