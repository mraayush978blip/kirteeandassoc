import React from 'react';
import { Product } from '@/types/product';
import { siteConfig } from '@/config/site';

export interface JsonLdProps {
  type: 'website' | 'organization' | 'product' | 'breadcrumb';
  product?: Product;
  breadcrumbs?: { name: string; url: string }[];
}

export const JsonLd: React.FC<JsonLdProps> = ({ type, product, breadcrumbs }) => {
  let schemaData: Record<string, unknown> = {};

  if (type === 'organization' || type === 'website') {
    schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${siteConfig.url}/#organization`,
          name: siteConfig.name,
          url: siteConfig.url,
          logo: `${siteConfig.url}/images/logo.png`,
          telephone: siteConfig.formattedPhone,
          email: siteConfig.email,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: siteConfig.formattedPhone,
            contactType: 'technical specification & sales',
            contactOption: 'TollFree',
            availableLanguage: ['English', 'Hindi'],
          },
          sameAs: [
            siteConfig.social.instagram,
            siteConfig.social.linkedin,
            siteConfig.social.youtube,
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${siteConfig.url}/#website`,
          url: siteConfig.url,
          name: siteConfig.name,
          description: siteConfig.description,
          publisher: {
            '@id': `${siteConfig.url}/#organization`,
          },
        },
      ],
    };
  } else if (type === 'product' && product) {
    schemaData = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: [product.heroImage.url, ...product.gallery.map((g) => g.url)],
      description: product.shortDescription,
      sku: product.sku,
      mpn: product.sku,
      brand: {
        '@type': 'Brand',
        name: siteConfig.name,
      },
      category: product.category.name,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        price: '0.00',
        priceValidUntil: '2026-12-31',
        description: 'Commercial pricing provided upon architectural specification and quantity quotation request.',
      },
    };
  } else if (type === 'breadcrumb' && breadcrumbs) {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
