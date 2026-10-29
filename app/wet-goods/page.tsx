import React from 'react';
import type { Metadata } from 'next';
import { getProductsFromDb } from '@/lib/db';
import { ArtemideCategoryView } from '@/components/products/ArtemideCategoryView';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'WET GOODS | Architectural Submerged & Outdoor Systems',
  description:
    'Architectural outdoor, submerged, and weatherproof luminaires engineered for extreme environmental durability, facade grazing, and subterranean reveals.',
  openGraph: {
    title: 'WET GOODS | Kirtee & Associates Architectural Collection',
    description:
      'Architectural outdoor, submerged, and weatherproof luminaires engineered for extreme environmental durability, facade grazing, and subterranean reveals.',
  },
};

export default async function WetGoodsPage() {
  const allProducts = await getProductsFromDb();
  const wetProducts = allProducts.filter((p) => p.status === 'published' && p.catalogType === 'wet');

  return (
    <>
      <ArtemideCategoryView
        title="WET GOODS"
        categoryType="wet"
        description="Architectural outdoor, submerged, and weatherproof luminaires engineered for extreme environmental durability, facade grazing, and subterranean reveals."
        products={wetProducts}
      />
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Wet Goods', url: `${siteConfig.url}/wet-goods` },
        ]}
      />
    </>
  );
}
