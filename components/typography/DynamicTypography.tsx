import React from 'react';
import { TypographyConfig, DEFAULT_TYPOGRAPHY } from '@/lib/site-settings-types';

interface DynamicTypographyProps {
  typography?: TypographyConfig;
}

const letterSpacingMap = {
  tight: '-0.025em',
  normal: '0em',
  wide: '0.06em',
  'ultra-wide': '0.14em',
  'extra-wide': '0.22em',
};

const headingScaleMap = {
  compact: {
    h1: 'clamp(2.1rem, 4.5vw, 3.8rem)',
    h2: 'clamp(1.7rem, 3.2vw, 2.5rem)',
    h3: 'clamp(1.3rem, 2.2vw, 1.8rem)',
  },
  normal: {
    h1: 'clamp(2.5rem, 5.5vw, 4.5rem)',
    h2: 'clamp(2rem, 3.8vw, 3rem)',
    h3: 'clamp(1.5rem, 2.5vw, 2.125rem)',
  },
  large: {
    h1: 'clamp(2.85rem, 6.2vw, 5.2rem)',
    h2: 'clamp(2.3rem, 4.2vw, 3.4rem)',
    h3: 'clamp(1.7rem, 2.8vw, 2.4rem)',
  },
  grand: {
    h1: 'clamp(3.3rem, 7.2vw, 6rem)',
    h2: 'clamp(2.6rem, 4.8vw, 3.8rem)',
    h3: 'clamp(1.9rem, 3.2vw, 2.7rem)',
  },
};

export const DynamicTypography: React.FC<DynamicTypographyProps> = ({ typography = DEFAULT_TYPOGRAPHY }) => {
  const typo = { ...DEFAULT_TYPOGRAPHY, ...typography };

  const getFontName = (font: string, custom?: string) => {
    if (font === 'Custom' && custom && custom.trim()) {
      return custom.trim();
    }
    return font || 'Inter';
  };

  const heading = getFontName(typo.headingFont, typo.headingCustomFont);
  const subheading = getFontName(typo.subheadingFont, typo.subheadingCustomFont);
  const body = getFontName(typo.bodyFont, typo.bodyCustomFont);
  const brand = getFontName(typo.brandFont, typo.brandCustomFont);
  const nav = getFontName(typo.navFont, typo.navCustomFont);
  const accent = getFontName(typo.accentFont, typo.accentCustomFont);

  // Build unique Google Fonts query
  const uniqueFonts = new Set<string>();
  [heading, subheading, body, brand, nav, accent].forEach((f) => {
    if (f && !['system-ui', '-apple-system', 'sans-serif', 'serif', 'monospace'].includes(f.toLowerCase())) {
      uniqueFonts.add(f.trim());
    }
  });

  const googleFontsQuery = Array.from(uniqueFonts)
    .map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400`)
    .join('&');

  const headingSpacing = letterSpacingMap[typo.headingLetterSpacing] || '0em';
  const subheadingSpacing = letterSpacingMap[typo.subheadingLetterSpacing] || '0em';
  const brandSpacing = letterSpacingMap[typo.brandLetterSpacing] || '0.14em';
  const navSpacing = letterSpacingMap[typo.navLetterSpacing] || '0.14em';
  const accentSpacing = letterSpacingMap[typo.accentLetterSpacing] || '0.22em';

  const scales = headingScaleMap[typo.headingScale] || headingScaleMap.normal;

  return (
    <>
      {uniqueFonts.size > 0 && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?${googleFontsQuery}&display=swap`}
        />
      )}
      <style
        id="dynamic-typography-styles"
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-serif: "${heading}", "Cinzel", Georgia, serif;
              --font-sans: "${body}", "Inter", -apple-system, sans-serif;
              --font-subheading: "${subheading}", "Inter", sans-serif;
              --font-brand: "${brand}", "Inter", sans-serif;
              --font-nav: "${nav}", "Inter", sans-serif;
              --font-mono: "${accent}", "JetBrains Mono", monospace;

              --font-size-h1: ${scales.h1};
              --font-size-h2: ${scales.h2};
              --font-size-h3: ${scales.h3};
              --heading-weight: ${typo.headingWeight || '500'};
              --heading-spacing: ${headingSpacing};
              --heading-transform: ${typo.headingTransform || 'none'};

              --subheading-weight: ${typo.subheadingWeight || '600'};
              --subheading-spacing: ${subheadingSpacing};

              --base-font-size: ${typo.bodyBaseSize || '16px'};
              --body-line-height: ${typo.bodyLineHeight || '1.5'};

              --brand-spacing: ${brandSpacing};
              --nav-font-size: ${typo.navSize || '12px'};
              --nav-spacing: ${navSpacing};
              --accent-spacing: ${accentSpacing};
            }

            html {
              font-size: var(--base-font-size, 16px) !important;
            }

            body {
              font-family: var(--font-sans) !important;
              line-height: var(--body-line-height, 1.5) !important;
            }

            h1, h2 {
              font-family: var(--font-serif) !important;
              font-weight: var(--heading-weight) !important;
              letter-spacing: var(--heading-spacing) !important;
              text-transform: var(--heading-transform) !important;
            }

            h3, h4 {
              font-family: var(--font-subheading) !important;
              font-weight: var(--subheading-weight) !important;
              letter-spacing: var(--subheading-spacing) !important;
            }

            .brand-title {
              font-family: var(--font-brand) !important;
              letter-spacing: var(--brand-spacing) !important;
            }

            .desktop-nav a {
              font-family: var(--font-nav) !important;
              font-size: var(--nav-font-size) !important;
              letter-spacing: var(--nav-spacing) !important;
            }

            .accent-mono, code, .eyebrow-text {
              font-family: var(--font-mono) !important;
              letter-spacing: var(--accent-spacing) !important;
            }
          `,
        }}
      />
    </>
  );
};
