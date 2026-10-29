import React from 'react';
import type { Metadata } from 'next';
import { getProductsFromDb } from '@/lib/db';
import { ArtemideCategoryView } from '@/components/products/ArtemideCategoryView';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'DRY GOODS | Architectural Indoor Systems',
  description:
    'Products that convey innovation and design skills, towards new frontiers of light where the focus is both on the product as such and on operation and information intelligence.',
  openGraph: {
    title: 'DRY GOODS | Kirtee & Associates Architectural Collection',
    description:
      'Products that convey innovation and design skills, towards new frontiers of light where the focus is both on the product as such and on operation and information intelligence.',
  },
};

export default async function DryGoodsPage() {
  const allProducts = await getProductsFromDb();
  const dryProducts = allProducts.filter((p) => p.status === 'published' && p.catalogType === 'dry');

  return (
    <>
      <ArtemideCategoryView
        title="DRY GOODS"
        categoryType="dry"
        description="Products that convey innovation and design skills, towards new frontiers of light where the focus is both on the product as such and on operation and information intelligence. Open and flexible systems capable to address the needs of all spaces, solutions to define a new way to approach and experience light."
        products={dryProducts}
      />
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Dry Goods', url: `${siteConfig.url}/dry-goods` },
        ]}
      />
    </>
  );
}
