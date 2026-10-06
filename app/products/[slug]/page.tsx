import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts, getRelatedProducts } from '@/lib/data/products';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductSpecsTable } from '@/components/products/ProductSpecsTable';
import { ProductDownloads } from '@/components/products/ProductDownloads';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Badge } from '@/components/ui/Badge';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import { ArrowLeft, ArrowUpRight, Share2, Check } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allProducts = getAllProducts();
  return allProducts.map((product) => ({
    slug: product.slug,
  }));
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
    <div
      style={{
        paddingTop: 'calc(var(--header-height) + 2rem)',
        paddingBottom: '6rem',
        backgroundColor: 'var(--color-bg-primary)',
        flexGrow: 1,
      }}
    >
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-text-muted)',
            marginBottom: '2rem',
          }}
        >
          <Link href="/" style={{ color: 'var(--color-text-secondary)' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/products" style={{ color: 'var(--color-text-secondary)' }}>
            Catalogue
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-accent)' }}>{product.name}</span>
        </nav>

        {/* Product Overview Header & Split Gallery */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
            marginBottom: '5rem',
          }}
        >
          {/* Left Column: Visual Gallery */}
          <div>
            <ProductGallery heroImage={product.heroImage} gallery={product.gallery} />
          </div>

          {/* Right Column: Specification Synopsis & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Badge variant="accent">{product.category.name}</Badge>
              {product.subcategory && <Badge>{product.subcategory}</Badge>}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  lineHeight: '1.15',
                }}
              >
                {product.name}
              </h1>
            </div>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.06em',
                marginBottom: '1.25rem',
              }}
            >
              Order Code / SKU: {product.sku}
            </span>

            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--color-text-primary)',
                lineHeight: '1.7',
                marginBottom: '1.5rem',
              }}
            >
              {product.shortDescription}
            </p>

            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
                marginBottom: '2rem',
              }}
            >
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--color-accent)',
                  marginBottom: '0.75rem',
                }}
              >
                Engineering Highlights
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.tags?.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-secondary)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    <Check size={12} color="var(--color-accent)" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Project Consultation Action */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: 'auto' }}>
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="btn btn-primary"
                style={{ flexGrow: 1 }}
              >
                <span>Request Specification &amp; IES Package</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Section: Comprehensive Technical Narrative & Full Description */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '4rem',
            marginBottom: '4rem',
          }}
        >
          <div className="container-editorial" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <span className="eyebrow">Design Narrative</span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--font-size-h3)',
                marginBottom: '1.5rem',
              }}
            >
              Architectural &amp; Optical Concept
            </h2>
            <div
              style={{
                fontSize: '1rem',
                lineHeight: '1.8',
                color: 'var(--color-text-secondary)',
                whiteSpace: 'pre-line',
              }}
            >
              {product.fullDescription}
            </div>
          </div>
        </div>

        {/* Section: Technical Specifications Table */}
        <div
          id="specifications"
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '4rem',
            marginBottom: '4rem',
          }}
        >
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="eyebrow">Technical Parameters</span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--font-size-h3)',
              }}
            >
              Photometric, Electrical &amp; Mechanical Data
            </h2>
          </div>

          <ProductSpecsTable specifications={product.specifications} />
        </div>

        {/* Section: Downloadable Documentation */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '4rem',
            marginBottom: '5rem',
          }}
        >
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="eyebrow">Technical Assets</span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--font-size-h3)',
              }}
            >
              Datasheets, Photometrics &amp; BIM Models
            </h2>
          </div>

          <ProductDownloads downloads={product.downloads} />
        </div>

        {/* Section: Related Architectural Luminaires */}
        {relatedProducts.length > 0 && (
          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: '4rem',
            }}
          >
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="eyebrow">Complementary Instruments</span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--font-size-h3)',
                }}
              >
                Related Architectural Families
              </h2>
            </div>

            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>

      {/* JSON-LD Schemas */}
      <JsonLd type="product" product={product} />
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Catalogue', url: `${siteConfig.url}/products` },
          { name: product.name, url: `${siteConfig.url}/products/${product.slug}` },
        ]}
      />
    </div>
  );
}
