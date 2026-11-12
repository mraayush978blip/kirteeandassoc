import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { DynamicTypography } from '@/components/typography/DynamicTypography';
import { getSetting, getBrand, DEFAULT_TYPOGRAPHY, TypographyConfig } from '@/lib/site-settings';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  const name = brand.brandName;
  const defaultTitle = `${name} | ${siteConfig.tagline}`;
  return {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${name}`,
  },
  description: siteConfig.seo.defaultDescription,
  authors: [{ name }],
  creator: name,
  publisher: name,
  keywords: [
    'Architectural Lighting',
    'Bespoke Luminaires',
    'In-Ground Grazers',
    'Recessed Wall Grazers',
    'Low Glare Downlights',
    'Commercial Lighting Specification',
    'Lighting Design India',
  ],
  openGraph: {
    title: defaultTitle,
    description: siteConfig.seo.defaultDescription,
    url: siteConfig.url,
    siteName: name,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${name} Architectural Luminaires`,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [siteConfig.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [typography, brand] = await Promise.all([
    getSetting<TypographyConfig>('site_typography', DEFAULT_TYPOGRAPHY),
    getBrand(),
  ]);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <DynamicTypography typography={typography} />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Header brand={brand} />
        <main id="main-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer brand={brand} />
        <JsonLd type="organization" brandName={brand.brandName} logoUrl={brand.logoUrl} />
      </body>
    </html>
  );
}
