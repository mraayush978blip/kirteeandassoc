import React from 'react';
import Link from 'next/link';
import { BrandConfig } from '@/lib/site-settings-types';

const LOGO_HEIGHT: Record<BrandConfig['logoSize'], { header: number; footer: number }> = {
  small: { header: 28, footer: 32 },
  medium: { header: 40, footer: 44 },
  large: { header: 56, footer: 60 },
};

interface Props {
  brand: BrandConfig;
  variant: 'header' | 'footer';
  /** true = dark text on a light background */
  light: boolean;
}

/** The site's logo and/or brand name. One component so header and footer always match. */
export const BrandMark: React.FC<Props> = ({ brand, variant, light }) => {
  const hasLogo = Boolean(brand.logoUrl);
  const showName = !hasLogo || brand.showNameWithLogo;
  const isHeader = variant === 'header';
  const nameColor = light ? '#111827' : '#E9E6DE';

  const content = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
      {hasLogo && (
        // eslint-disable-next-line @next/next/no-img-element -- logo can be any https URL
        <img
          src={brand.logoUrl}
          alt={showName ? '' : brand.logoAlt || brand.brandName}
          style={{ height: `${LOGO_HEIGHT[brand.logoSize][variant]}px`, width: 'auto', maxWidth: '220px', objectFit: 'contain', display: 'block' }}
        />
      )}
      {showName && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 0 }}>
          <span
            className="brand-title"
            style={{
              fontFamily: 'var(--font-brand, var(--font-sans))',
              fontSize: isHeader ? 'clamp(1.05rem, 3.4vw, 1.35rem)' : '1.25rem',
              fontWeight: 700,
              letterSpacing: 'var(--brand-spacing, 0.14em)',
              color: nameColor,
              textTransform: 'uppercase',
              lineHeight: 1.1,
              overflowWrap: 'anywhere',
            }}
          >
            {brand.brandName}
          </span>
          {isHeader && brand.tagline && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.48rem, 1.8vw, 0.5625rem)',
                fontWeight: 500,
                letterSpacing: 'var(--accent-spacing, 0.22em)',
                color: light ? '#6b7280' : '#96938C',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              {brand.tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );

  // Header brand links home; the footer one is plain text/logo
  return isHeader ? (
    <Link href="/" aria-label={`${brand.brandName} home`} style={{ display: 'inline-flex', textDecoration: 'none', minWidth: 0 }}>
      {content}
    </Link>
  ) : (
    content
  );
};
