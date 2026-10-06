import React from 'react';
import { initialHomePageData } from '@/lib/data/cms';
import { getFeaturedProducts } from '@/lib/data/products';
import { HeroSection } from '@/components/home/HeroSection';
import { BrandIntroSection } from '@/components/home/BrandIntroSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { StorytellingSection } from '@/components/home/StorytellingSection';
import { CtaSection } from '@/components/home/CtaSection';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection data={initialHomePageData.hero} />

      {/* 2. Brand Intro & Philosophy */}
      <BrandIntroSection data={initialHomePageData.intro} />

      {/* 3. Featured Master Families */}
      <FeaturedProductsSection
        data={initialHomePageData.featuredProducts}
        products={featuredProducts}
      />

      {/* 4. Storytelling / Bespoke Commissions */}
      <StorytellingSection data={initialHomePageData.storytelling} />

      {/* 5. Direct Specification Consultation CTA */}
      <CtaSection data={initialHomePageData.cta} />
    </>
  );
}
