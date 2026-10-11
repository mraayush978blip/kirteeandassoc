import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts, getRelatedProducts } from '@/lib/data/products';
import { ArtemideProductDetail } from '@/components/products/ArtemideProductDetail';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allProducts = getAllProducts();
  const params = allProducts.map((product) => ({
    slug: product.slug,
  }));
  params.push({ slug: 'outdoor-in-ground-ingraze-frame' });
  return params;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Luminaire Not Found',
    };
  }

  const title = product.seo?.metaTitle || `${product.name} | Kirtee & Associates`;
  const description = product.seo?.metaDescription || product.shortDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.heroImage.url,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <>
      <ArtemideProductDetail product={product} relatedProducts={relatedProducts} />

      {/* Structured SEO Data */}
      <JsonLd type="product" product={product} />
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: siteConfig.url },
          {
            name: product.catalogType === 'wet' ? 'Wet Goods' : 'Dry Goods',
            url: `${siteConfig.url}/${product.catalogType === 'wet' ? 'wet-goods' : 'dry-goods'}`,
          },
          { name: product.name, url: `${siteConfig.url}/products/${product.slug}` },
        ]}
      />
    </>
  );
}
