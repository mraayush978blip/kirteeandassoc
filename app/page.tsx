import React from 'react';
import { HeroSwipeSection } from '@/components/home/HeroSwipeSection';
import { DifferenceSection } from '@/components/home/DifferenceSection';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { BespokeInteractiveSection } from '@/components/home/BespokeInteractiveSection';
import { ProjectsSwipeSection } from '@/components/home/ProjectsSwipeSection';
import { StatsSection } from '@/components/home/StatsSection';
import { ProjectCtaSection } from '@/components/home/ProjectCtaSection';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section with Touch & Drag Right/Left Image Swiping */}
      <HeroSwipeSection />

      {/* 2. The Zenvora Difference: 4 Strategic Editorial Pillars */}
      <DifferenceSection />

      {/* 3. Our Collections: Dry Goods & Wet Goods */}
      <CollectionsSection />

      {/* 4. Bespoke by Design: 4-Step Process & Interactive Annotated Luminaire */}
      <BespokeInteractiveSection />

      {/* 5. Featured Projects: Spaces That Inspire (Swipeable Carousel) */}
      <ProjectsSwipeSection />

      {/* 6. Architectural Scale: Curved Gallery Image & Global Statistics */}
      <StatsSection />

      {/* 7. Specification Partnership CTA Showcase */}
      <ProjectCtaSection />
    </>
  );
}
