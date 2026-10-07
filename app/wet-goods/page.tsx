import React from 'react';
import type { Metadata } from 'next';
import { getProductsByType } from '@/lib/data/products';
import { ArtemideCategoryView } from '@/components/products/ArtemideCategoryView';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'WET GOODS | Exterior & Subterranean Systems',
  description:
    'Architectural exterior, in-ground subterranean luminaires, and underwater optical projectors built with continuous IP68 submersion sealing, IK10 impact resistance, and marine-grade alloys.',
  openGraph: {
    title: 'WET GOODS | ZENVORA Architectural Collection',
    description:
      'Architectural exterior, in-ground subterranean luminaires, and underwater optical projectors built with continuous IP68 submersion sealing, IK10 impact resistance, and marine-grade alloys.',
  },
};

export default function WetGoodsPage() {
  const wetProducts = getProductsByType('wet');

  return (
    <>
      <ArtemideCategoryView
        title="WET GOODS"
        categoryType="wet"
        description="Architectural exterior, in-ground subterranean luminaires, and underwater optical projectors built with continuous IP68 submersion sealing, IK10 impact resistance, and marine-grade alloys. Engineered to withstand extreme atmospheric conditions while delivering uncompromising optical precision."
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
