import React from 'react';
import type { Metadata } from 'next';
import { getAllProducts, categories } from '@/lib/data/products';
import { ProductCatalogView } from '@/components/products/ProductCatalogView';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Architectural Luminaire Catalogue',
  description: 'Explore the complete portfolio of architectural luminaires, in-ground grazers, optical downlights, and exterior fixtures by Kirtee & Associates.',
  openGraph: {
    title: 'Architectural Luminaire Catalogue | Kirtee & Associates',
    description: 'Explore the complete portfolio of architectural luminaires, in-ground grazers, optical downlights, and exterior fixtures.',
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialCategory = typeof resolvedSearchParams?.category === 'string' ? resolvedSearchParams.category : 'all';
  const allProducts = getAllProducts();

  return (
    <div
      style={{
        paddingTop: 'calc(var(--header-height) + 3rem)',
        paddingBottom: '6rem',
        backgroundColor: 'var(--color-bg-primary)',
        flexGrow: 1,
      }}
    >
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '3rem' }}>
          <span className="eyebrow">Product Portfolio</span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-size-h2)',
              marginBottom: '1rem',
            }}
          >
            Architectural Luminaire Instruments
          </h1>
          <p style={{ maxWidth: '680px', fontSize: '1.0625rem', color: 'var(--color-text-secondary)' }}>
            Each optical family is engineered for seamless architectural integration, exceptional color rendering (CRI 95+), and enduring mechanical resilience.
          </p>
        </div>

        {/* Interactive Catalogue View */}
        <ProductCatalogView
          initialProducts={allProducts}
          categories={categories}
          initialCategory={initialCategory}
        />
      </div>

      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Catalogue', url: `${siteConfig.url}/products` },
        ]}
      />
    </div>
  );
}
