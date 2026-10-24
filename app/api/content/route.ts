import { NextRequest, NextResponse } from 'next/server';
import {
  getSetting,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROJECTS,
  DEFAULT_CONTACT,
  DEFAULT_PROJECT_SETTINGS,
  HeroSlideConfig,
  ProjectConfig,
  ContactConfig,
  ProjectSettings,
} from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key') || 'all';

    if (key === 'hero_slides') {
      const slides = await getSetting<HeroSlideConfig[]>('hero_slides', DEFAULT_HERO_SLIDES);
      return NextResponse.json({ success: true, data: slides });
    }

    if (key === 'projects') {
      const projects = await getSetting<ProjectConfig[]>('site_projects', DEFAULT_PROJECTS);
      const settings = await getSetting<ProjectSettings>('project_settings', DEFAULT_PROJECT_SETTINGS);
      return NextResponse.json({ success: true, data: { projects, settings } });
    }

    if (key === 'contact') {
      const contact = await getSetting<ContactConfig>('site_contact', DEFAULT_CONTACT);
      return NextResponse.json({ success: true, data: contact });
    }

    if (key === 'project_settings') {
      const settings = await getSetting<ProjectSettings>('project_settings', DEFAULT_PROJECT_SETTINGS);
      return NextResponse.json({ success: true, data: settings });
    }

    const [heroSlides, projects, projectSettings, contact] = await Promise.all([
      getSetting<HeroSlideConfig[]>('hero_slides', DEFAULT_HERO_SLIDES),
      getSetting<ProjectConfig[]>('site_projects', DEFAULT_PROJECTS),
      getSetting<ProjectSettings>('project_settings', DEFAULT_PROJECT_SETTINGS),
      getSetting<ContactConfig>('site_contact', DEFAULT_CONTACT),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        heroSlides,
        projects,
        projectSettings,
        contact,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: true,
        data: {
          heroSlides: DEFAULT_HERO_SLIDES,
          projects: DEFAULT_PROJECTS,
          projectSettings: DEFAULT_PROJECT_SETTINGS,
          contact: DEFAULT_CONTACT,
        },
      },
      { status: 200 }
    );
  }
}
