import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import {
  getSetting,
  saveSetting,
  invalidateSettingsCache,
  isAllowedSettingKey,
  sanitizeTypography,
  sanitizeBrand,
  isSafeLogoUrl,
  getBrand,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROJECTS,
  DEFAULT_CONTACT,
  DEFAULT_PROJECT_SETTINGS,
  DEFAULT_PHILOSOPHY,
  DEFAULT_WHY_CHOOSE_US,
  DEFAULT_PROCESS,
  DEFAULT_PROJECT_CTA,
  DEFAULT_TYPOGRAPHY,
  HeroSlideConfig,
  ProjectConfig,
  ContactConfig,
  ProjectSettings,
  PhilosophyConfig,
  WhyChooseUsConfig,
  ProcessConfig,
  ProjectCtaConfig,
  TypographyConfig,
} from '@/lib/site-settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key') || 'all';

    if (key === 'hero_slides') {
      const slides = await getSetting<HeroSlideConfig[]>('hero_slides', DEFAULT_HERO_SLIDES);
      return NextResponse.json({ success: true, data: slides }, { headers: NO_CACHE_HEADERS });
    }

    if (key === 'projects') {
      const projects = await getSetting<ProjectConfig[]>('site_projects', DEFAULT_PROJECTS);
      const settings = await getSetting<ProjectSettings>('project_settings', DEFAULT_PROJECT_SETTINGS);
      return NextResponse.json({ success: true, data: { projects, settings } }, { headers: NO_CACHE_HEADERS });
    }

    if (key === 'contact') {
      const contact = await getSetting<ContactConfig>('site_contact', DEFAULT_CONTACT);
      return NextResponse.json({ success: true, data: contact }, { headers: NO_CACHE_HEADERS });
    }

    if (key === 'project_settings') {
      const settings = await getSetting<ProjectSettings>('project_settings', DEFAULT_PROJECT_SETTINGS);
      return NextResponse.json({ success: true, data: settings }, { headers: NO_CACHE_HEADERS });
    }

    if (key === 'philosophy' || key === 'home_philosophy') {
      const philosophy = await getSetting<PhilosophyConfig>('home_philosophy', DEFAULT_PHILOSOPHY);
      return NextResponse.json({ success: true, data: philosophy }, { headers: NO_CACHE_HEADERS });
    }

    if (key === 'why_choose_us' || key === 'home_why_choose_us') {
      const whyChooseUs = await getSetting<WhyChooseUsConfig>('home_why_choose_us', DEFAULT_WHY_CHOOSE_US);
      return NextResponse.json({ success: true, data: whyChooseUs }, { headers: NO_CACHE_HEADERS });
    }

    if (key === 'process' || key === 'home_process') {
      const process = await getSetting<ProcessConfig>('home_process', DEFAULT_PROCESS);
      return NextResponse.json({ success: true, data: process }, { headers: NO_CACHE_HEADERS });
    }

    if (key === 'project_cta' || key === 'home_project_cta') {
      const projectCta = await getSetting<ProjectCtaConfig>('home_project_cta', DEFAULT_PROJECT_CTA);
      return NextResponse.json({ success: true, data: projectCta }, { headers: NO_CACHE_HEADERS });
    }

    if (key === 'brand' || key === 'site_brand') {
      return NextResponse.json({ success: true, data: await getBrand() }, { headers: NO_CACHE_HEADERS });
    }

    if (key === 'typography' || key === 'site_typography') {
      const typography = await getSetting<TypographyConfig>('site_typography', DEFAULT_TYPOGRAPHY);
      return NextResponse.json({ success: true, data: typography }, { headers: NO_CACHE_HEADERS });
    }

    // Default 'all'
    const [heroSlides, projects, projectSettings, contact, philosophy, whyChooseUs, process, projectCta] =
      await Promise.all([
        getSetting<HeroSlideConfig[]>('hero_slides', DEFAULT_HERO_SLIDES),
        getSetting<ProjectConfig[]>('site_projects', DEFAULT_PROJECTS),
        getSetting<ProjectSettings>('project_settings', DEFAULT_PROJECT_SETTINGS),
        getSetting<ContactConfig>('site_contact', DEFAULT_CONTACT),
        getSetting<PhilosophyConfig>('home_philosophy', DEFAULT_PHILOSOPHY),
        getSetting<WhyChooseUsConfig>('home_why_choose_us', DEFAULT_WHY_CHOOSE_US),
        getSetting<ProcessConfig>('home_process', DEFAULT_PROCESS),
        getSetting<ProjectCtaConfig>('home_project_cta', DEFAULT_PROJECT_CTA),
      ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          heroSlides,
          projects,
          projectSettings,
          contact,
          philosophy,
          whyChooseUs,
          process,
          projectCta,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    let body: { key?: unknown; value?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
    const { key } = body;
    let { value } = body;

    if (!key || value === undefined || value === null) {
      return NextResponse.json({ success: false, message: 'Missing key or value' }, { status: 400 });
    }
    if (!isAllowedSettingKey(key)) {
      return NextResponse.json({ success: false, message: `Unknown setting key "${String(key)}"` }, { status: 400 });
    }
    // Basic shape check: list-type settings must be arrays, the rest objects
    const arrayKeys = ['hero_slides', 'site_projects'];
    if (arrayKeys.includes(key) !== Array.isArray(value) || typeof value !== 'object') {
      return NextResponse.json({ success: false, message: `Invalid value shape for "${key}"` }, { status: 400 });
    }
    if (key === 'site_typography') value = sanitizeTypography(value);
    if (key === 'site_brand') {
      const v = value as Record<string, unknown>;
      if (typeof v.logoUrl === 'string' && !isSafeLogoUrl(v.logoUrl.trim())) {
        return NextResponse.json({ success: false, message: 'Logo URL must start with / or https://' }, { status: 400 });
      }
      if (typeof v.brandName !== 'string' || !v.brandName.trim()) {
        return NextResponse.json({ success: false, message: 'Brand name cannot be empty.' }, { status: 400 });
      }
      value = sanitizeBrand(value);
    }

    const result = await saveSetting(key, value);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error || 'Failed to save' }, { status: 500 });
    }
    invalidateSettingsCache(key);

    // Instantly invalidate server cache so that homepage & public routes reflect changes immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/contact');
      revalidatePath('/dry-goods');
      revalidatePath('/wet-goods');
    } catch (e) {
      console.warn('[Cache Revalidation Warning]:', e);
    }

    return NextResponse.json({ success: true, key, warning: result.warning });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
