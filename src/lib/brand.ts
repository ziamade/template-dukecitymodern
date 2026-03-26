// src/lib/brand.ts
import type { Brand, ColorPalette } from './types';

/**
 * Generate CSS custom properties from a color palette.
 * Used in BaseLayout to inject :root and [data-theme="dark"] styles.
 */
export function paletteToCSS(palette: ColorPalette): string {
  return Object.entries(palette)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
}

/**
 * Generate the full CSS block for both light and dark palettes,
 * plus font custom properties.
 */
export function generateThemeCSS(brand: Brand, defaultMode: 'light' | 'dark'): string {
  const lightPalette = paletteToCSS(brand.light);
  const darkPalette = paletteToCSS(brand.dark);

  // Default mode palette goes in :root
  // Alternate mode goes in [data-theme] and @media query
  const defaultPalette = defaultMode === 'dark' ? darkPalette : lightPalette;
  const alternatePalette = defaultMode === 'dark' ? lightPalette : darkPalette;
  const alternateTheme = defaultMode === 'dark' ? 'light' : 'dark';

  return `
:root {
${defaultPalette}
  --font-name: '${brand.nameFont}', var(--font-heading), sans-serif;
  --font-heading: '${brand.headingFont}', sans-serif;
  --font-body: '${brand.bodyFont}', system-ui, sans-serif;
}

@media (prefers-color-scheme: ${alternateTheme}) {
  :root:not([data-theme]) {
${alternatePalette}
  }
}

[data-theme="${alternateTheme}"] {
${alternatePalette}
}
`.trim();
}

/**
 * Map semantic layout tokens to CSS custom properties.
 * Returns empty string if no layout tokens are present.
 */
export function generateLayoutCSS(layout?: Record<string, string>): string {
  if (!layout) return '';

  const RADIUS_MAP: Record<string, string> = {
    sharp: '0',
    soft: '0.5rem',
    round: '0.75rem',
  };
  const GAP_MAP: Record<string, string> = {
    tight: 'clamp(2rem, 3vw, 4rem)',
    normal: 'clamp(3rem, 5vw, 6rem)',
    spacious: 'clamp(4rem, 7vw, 8rem)',
  };
  const BUTTON_MAP: Record<string, string> = {
    rounded: '0.5rem',
    pill: '2rem',
    square: '0',
  };
  const IMG_RADIUS_MAP: Record<string, string> = {
    rounded: '0.75rem',
    sharp: '0',
    masked: '0.375rem',
  };
  const TYPO_SCALE: Record<string, { base: string; h1: string; h2: string }> = {
    compact: {
      base: 'clamp(0.9rem, 0.875rem + 0.2vw, 1rem)',
      h1: 'clamp(1.75rem, 1.25rem + 2vw, 2.75rem)',
      h2: 'clamp(1.25rem, 1rem + 1vw, 1.75rem)',
    },
    editorial: {
      base: 'clamp(1.05rem, 1rem + 0.3vw, 1.25rem)',
      h1: 'clamp(2.25rem, 1.75rem + 3vw, 4rem)',
      h2: 'clamp(1.75rem, 1.5rem + 1.5vw, 2.75rem)',
    },
  };

  const vars: string[] = [];

  if (layout.cardRadius && RADIUS_MAP[layout.cardRadius]) {
    vars.push(`  --card-radius: ${RADIUS_MAP[layout.cardRadius]};`);
  }
  if (layout.sectionGap && GAP_MAP[layout.sectionGap]) {
    vars.push(`  --section-gap: ${GAP_MAP[layout.sectionGap]};`);
  }
  if (layout.buttonStyle && BUTTON_MAP[layout.buttonStyle]) {
    vars.push(`  --btn-radius: ${BUTTON_MAP[layout.buttonStyle]};`);
  }
  if (layout.imageStyle && IMG_RADIUS_MAP[layout.imageStyle]) {
    vars.push(`  --img-radius: ${IMG_RADIUS_MAP[layout.imageStyle]};`);
  }
  if (layout.typographyScale && TYPO_SCALE[layout.typographyScale]) {
    const scale = TYPO_SCALE[layout.typographyScale];
    vars.push(`  --font-size-base: ${scale.base};`);
    vars.push(`  --font-size-h1: ${scale.h1};`);
    vars.push(`  --font-size-h2: ${scale.h2};`);
  }

  return vars.length > 0 ? `:root {\n${vars.join('\n')}\n}` : '';
}

/**
 * Build Google Fonts URL with name font subsetted to business name.
 * When nameFont === headingFont, skip the subsetted request to avoid
 * Google Fonts serving conflicting @font-face declarations for the
 * same family (subsetted glyphs vs full character set).
 */
export function buildFontURL(brand: Brand, businessName: string): string {
  const nameParam = encodeURIComponent(businessName);
  const parts: string[] = [];

  if (brand.nameFont === brand.headingFont) {
    // Same font for name and headings — load once with full weights
    parts.push(`family=${encodeURIComponent(brand.headingFont)}:wght@400;600;700`);
  } else {
    // Different fonts — subset the name font, full weights for headings
    parts.push(`family=${encodeURIComponent(brand.nameFont)}&text=${nameParam}`);
    parts.push(`family=${encodeURIComponent(brand.headingFont)}:wght@400;600;700`);
  }

  // Only add body font if it's different from heading font
  if (brand.bodyFont !== brand.headingFont) {
    parts.push(`family=${encodeURIComponent(brand.bodyFont)}:wght@400;500;600`);
  }

  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}
