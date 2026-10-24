export interface DesignSystemTokens {
  colors: {
    primaryBackground: string;
    secondaryBackground: string;
    surface: string;
    surfaceElevated: string;
    primaryText: string;
    secondaryText: string;
    mutedText: string;
    accent: string;
    accentHover: string;
    border: string;
    borderFocus: string;
    buttonBackground: string;
    buttonText: string;
    buttonHover: string;
    buttonActive: string;
  };
  typography: {
    primaryFont: string;
    serifFont: string;
    accentFont: string;
    initialWeights: string[];
    lineHeights: {
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
    };
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    laptop: string;
    desktop: string;
    wide: string;
  };
}

export const defaultDesignTokens: DesignSystemTokens = {
  colors: {
    primaryBackground: '#282b32',
    secondaryBackground: '#353943',
    surface: '#30343e',
    surfaceElevated: '#3a3f4b',
    primaryText: '#f8f9fa',
    secondaryText: '#a0a6b1',
    mutedText: '#6e7683',
    accent: '#c5a880',
    accentHover: '#d6bc98',
    border: 'rgba(255, 255, 255, 0.08)',
    borderFocus: '#c5a880',
    buttonBackground: '#c5a880',
    buttonText: '#282b32',
    buttonHover: '#d6bc98',
    buttonActive: '#b5976e',
  },
  typography: {
    primaryFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serifFont: '"Cinzel", "Playfair Display", Georgia, serif',
    accentFont: '"Cinzel", Georgia, serif',
    initialWeights: ['300', '400', '500', '600', '700'],
    lineHeights: {
      tight: '1.1',
      snug: '1.25',
      normal: '1.6',
      relaxed: '1.8',
    },
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1536px',
  },
};
