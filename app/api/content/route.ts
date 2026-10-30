import { NextRequest, NextResponse } from 'next/server';
import {
  getSetting,
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

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key') || 'all';

    if (key === 'hero_slides') {
      const slides = await getSetting<HeroSlideConfig[]>('hero_slides', DEFAULT_HERO_SLIDES);
      return NextResponse.json({ success: true, data: slides }, { headers: CACHE_HEADERS });
    }

    if (key === 'projects') {
      const projects = await getSetting<ProjectConfig[]>('site_projects', DEFAULT_PROJECTS);
      const settings = await getSetting<ProjectSettings>('project_settings', DEFAULT_PROJECT_SETTINGS);
      return NextResponse.json({ success: true, data: { projects, settings } }, { headers: CACHE_HEADERS });
    }

    if (key === 'contact') {
      const contact = await getSetting<ContactConfig>('site_contact', DEFAULT_CONTACT);
      return NextResponse.json({ success: true, data: contact }, { headers: CACHE_HEADERS });
    }

    if (key === 'project_settings') {
      const settings = await getSetting<ProjectSettings>('project_settings', DEFAULT_PROJECT_SETTINGS);
      return NextResponse.json({ success: true, data: settings }, { headers: CACHE_HEADERS });
    }

    if (key === 'philosophy' || key === 'home_philosophy') {
      const philosophy = await getSetting<PhilosophyConfig>('home_philosophy', DEFAULT_PHILOSOPHY);
      return NextResponse.json({ success: true, data: philosophy }, { headers: CACHE_HEADERS });
    }

    if (key === 'why_choose_us' || key === 'home_why_choose_us') {
      const whyChooseUs = await getSetting<WhyChooseUsConfig>('home_why_choose_us', DEFAULT_WHY_CHOOSE_US);
      return NextResponse.json({ success: true, data: whyChooseUs }, { headers: CACHE_HEADERS });
    }

    if (key === 'process' || key === 'home_process') {
      const process = await getSetting<ProcessConfig>('home_process', DEFAULT_PROCESS);
      return NextResponse.json({ success: true, data: process }, { headers: CACHE_HEADERS });
    }

    if (key === 'project_cta' || key === 'home_project_cta') {
      const projectCta = await getSetting<ProjectCtaConfig>('home_project_cta', DEFAULT_PROJECT_CTA);
      return NextResponse.json({ success: true, data: projectCta }, { headers: CACHE_HEADERS });
    }

    if (key === 'typography' || key === 'site_typography') {
      const typography = await getSetting<TypographyConfig>('site_typography', DEFAULT_TYPOGRAPHY);
      return NextResponse.json({ success: true, data: typography }, { headers: CACHE_HEADERS });
    }

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
      { headers: CACHE_HEADERS }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: true,
        data: {
          heroSlides: DEFAULT_HERO_SLIDES,
          projects: DEFAULT_PROJECTS,
          projectSettings: DEFAULT_PROJECT_SETTINGS,
          contact: DEFAULT_CONTACT,
          philosophy: DEFAULT_PHILOSOPHY,
          whyChooseUs: DEFAULT_WHY_CHOOSE_US,
          process: DEFAULT_PROCESS,
          projectCta: DEFAULT_PROJECT_CTA,
        },
      },
      { status: 200, headers: CACHE_HEADERS }
    );
  }
}

