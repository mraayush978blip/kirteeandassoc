-- =====================================================================
-- KIRTEE & ASSOCIATES — "Brand & Logo" setup  (safe to run more than once)
-- Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- =====================================================================

-- 1) Default brand name + logo settings.
--    Edit "brandName" / "tagline" below if you want different starting values.
--    "logoUrl" stays empty until the client uploads a logo in Admin -> Brand & Logo.
--    ON CONFLICT DO NOTHING: if a brand row already exists it is NOT overwritten.
INSERT INTO site_settings (key, value)
VALUES (
  'site_brand',
  jsonb_build_object(
    'brandName',        'Kirtee & Associates',
    'tagline',          'Architectural Lighting',
    'logoUrl',          '',
    'logoAlt',          '',
    'logoSize',         'medium',
    'showNameWithLogo', false
  )
)
ON CONFLICT (key) DO NOTHING;

-- 2) Public storage bucket "media" for uploaded logos and images.
--    (Public = anyone can VIEW the files, which the website needs; uploads still need the secret key.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3) Check the result: you should see 'site_brand' and the 'media' bucket.
SELECT key, value FROM site_settings WHERE key = 'site_brand';
SELECT id, public FROM storage.buckets WHERE id = 'media';
