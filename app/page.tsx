import React from 'react';
import { HeroSwipeSection } from '@/components/home/HeroSwipeSection';
import { DifferenceSection } from '@/components/home/DifferenceSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { FlosBespokeProcessSection } from '@/components/home/FlosBespokeProcessSection';
import { ProjectsSwipeSection } from '@/components/home/ProjectsSwipeSection';
import { ProjectCtaSection } from '@/components/home/ProjectCtaSection';
import {
  getSetting,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROJECTS,
  DEFAULT_PHILOSOPHY,
  DEFAULT_WHY_CHOOSE_US,
  DEFAULT_PROCESS,
  DEFAULT_PROJECT_CTA,
  DEFAULT_PROJECT_SETTINGS,
  HeroSlideConfig,
  ProjectConfig,
  PhilosophyConfig,
  WhyChooseUsConfig,
  ProcessConfig,
  ProjectCtaConfig,
  ProjectSettings,
} from '@/lib/site-settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [heroSlides, projects, philosophy, whyChooseUs, process, projectCta, projectSettings] = await Promise.all([
    getSetting<HeroSlideConfig[]>('hero_slides', DEFAULT_HERO_SLIDES),
    getSetting<ProjectConfig[]>('site_projects', DEFAULT_PROJECTS),
    getSetting<PhilosophyConfig>('home_philosophy', DEFAULT_PHILOSOPHY),
    getSetting<WhyChooseUsConfig>('home_why_choose_us', DEFAULT_WHY_CHOOSE_US),
    getSetting<ProcessConfig>('home_process', DEFAULT_PROCESS),
    getSetting<ProjectCtaConfig>('home_project_cta', DEFAULT_PROJECT_CTA),
    getSetting<ProjectSettings>('project_settings', DEFAULT_PROJECT_SETTINGS),
  ]);

  return (
    <>
      {/* 1. Hero Section with Touch & Drag Right/Left Image Swiping */}
      <HeroSwipeSection initialSlides={heroSlides} />

      {/* 2. The Kirtee & Associates Philosophy: 4 Strategic Pillars */}
      <DifferenceSection config={philosophy} />

      {/* 3. Why Choose Us: 4 Strategic Architectural & Engineering Value Pillars */}
      <WhyChooseUsSection config={whyChooseUs} />

      {/* 4. Flos Bespoke Process: Design Thinking, Prototyping, Realization, Installation */}
      <FlosBespokeProcessSection config={process} />

      {/* 5. Featured Projects: Swipeable Architectural Showcase */}
      {projectSettings?.showOnWebsite ? (
        <ProjectsSwipeSection initialProjects={projects} settings={projectSettings} />
      ) : null}

      {/* 6. Specification Consultation CTA */}
      <ProjectCtaSection config={projectCta} />
    </>
  );
}

