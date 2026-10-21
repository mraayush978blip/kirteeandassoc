-- =====================================================================
-- Kirtee & Associates — Architectural Lighting Database Schema
-- Compatible with PostgreSQL 13+, Neon, Supabase, Vercel Postgres, AWS RDS
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'editor', -- 'admin', 'editor', 'viewer'
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MEDIA & COMPRESSED ASSETS (High Quality WebP Storage)
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

-- 5. PRODUCTS (Architectural Luminaires)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    sku VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    code_label VARCHAR(100),
    designer VARCHAR(255),
    catalog_type VARCHAR(50) NOT NULL, -- 'dry' | 'wet' | 'bespoke'
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CONTACT SUBMISSIONS / SPECIFICATION INQUIRIES
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

-- 7. SITE SETTINGS (Key-Value Store)
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(catalog_type);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_media_format ON media(format);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- =====================================================================
-- INITIAL SEED DATA
-- =====================================================================

-- Seed Default Admin User
INSERT INTO users (email, name, role)
VALUES ('admin@kirteeandassoc.com', 'Divvya / Studio Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

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
        {"id": "cd1", "title": "Technical Datasheet (PDF)", "format": "PDF", "size": "2.4 MB", "url": "/downloads/calipso-datasheet.pdf"},
        {"id": "cd2", "title": "IES / LDT Photometric Web", "format": "IES", "size": "148 KB", "url": "/downloads/calipso-photometry.ies"}
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
        {"id": "a24-d1", "title": "System Specification Guide (PDF)", "format": "PDF", "size": "5.1 MB", "url": "/downloads/a24-guide.pdf"},
        {"id": "a24-d2", "title": "Complete IES Photometric Matrix", "format": "ZIP", "size": "1.2 MB", "url": "/downloads/a24-photometrics.zip"}
    ]'::jsonb
),
(
    'prod-a39',
    'a-39-system',
    'A39-SYS',
    'A.39 System',
    'A.39',
    'Studio Artemide',
    'dry',
    'cat-dry',
    'High-Performance Commercial Optical Line',
    'Architectural Controlled Glare Linear Workplace Lighting',
    'Pure extruded aluminium linear system with patented optical modules delivering UGR < 16 for high-end office environments and commercial towers.',
    'A.39 provides optimal visual comfort for workspaces and institutional architecture. Available in pendant, surface-mounted, and recessed variations with high-output CRI 90 LED arrays.',
    'published',
    true,
    3,
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    'A.39 architectural commercial downlight linear system',
    '[
        {"id": "a39-1", "label": "Profile Dimension", "value": "45 x 75", "unit": "mm", "group": "Physical"},
        {"id": "a39-2", "label": "Flux Output", "value": "3,200 / m", "unit": "lm", "group": "Optical"},
        {"id": "a39-3", "label": "Glare Rating", "value": "UGR < 16 (BREEAM Compliant)", "group": "Optical"},
        {"id": "a39-4", "label": "Optics", "value": "Dark Light Micro-prismatic / Opal Diffuser", "group": "Optical"},
        {"id": "a39-5", "label": "Ingress Rating", "value": "IP40", "group": "Physical"}
    ]'::jsonb,
    '[
        {"id": "a39-d1", "title": "A.39 Photometric & Photometric Data", "format": "IES", "size": "320 KB", "url": "/downloads/a39.ies"}
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
    4,
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
        {"id": "sg-d1", "title": "IP68 Subterranean Grazer Datasheet", "format": "PDF", "size": "3.8 MB", "url": "/downloads/subterranean-grazer.pdf"}
    ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    specifications = EXCLUDED.specifications;

-- Seed Default Site Settings
INSERT INTO site_settings (key, value) VALUES
('company_info', '{
    "name": "Kirtee & Associates",
    "lead": "Divvya",
    "phone": "+91 70969 62640",
    "email": "inquiries@kirteeandassoc.com",
    "hours": "Mon - Sat: 10:00 - 19:00 IST",
    "currency": "INR"
}'::jsonb),
('media_compression', '{
    "default_format": "webp",
    "default_quality": 85,
    "max_width_px": 2400,
    "max_height_px": 2400,
    "auto_compress": true
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
