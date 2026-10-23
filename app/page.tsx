import React from 'react';
import { HeroSwipeSection } from '@/components/home/HeroSwipeSection';
import { DifferenceSection } from '@/components/home/DifferenceSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { FlosBespokeProcessSection } from '@/components/home/FlosBespokeProcessSection';
import { ProjectsSwipeSection } from '@/components/home/ProjectsSwipeSection';
import { ProjectCtaSection } from '@/components/home/ProjectCtaSection';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section with Touch & Drag Right/Left Image Swiping */}
      <HeroSwipeSection />

      {/* 2. The Kirtee & Associates Philosophy: 4 Strategic Pillars */}
      <DifferenceSection />

      {/* 3. Why Choose Us: 4 Strategic Architectural & Engineering Value Pillars */}
      <WhyChooseUsSection />

      {/* 5. Flos Bespoke Process: Design Thinking, Prototyping, Realization, Installation */}
      <FlosBespokeProcessSection />

      {/* 6. Featured Projects: Swipeable Architectural Showcase */}
      <ProjectsSwipeSection />

      {/* 7. Specification Consultation CTA */}
      <ProjectCtaSection />
    </>
  );
}
