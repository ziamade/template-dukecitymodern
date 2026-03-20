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
 * Build Google Fonts URL with name font subsetted to business name.
 */
export function buildFontURL(brand: Brand, businessName: string): string {
  const nameParam = encodeURIComponent(businessName);
  const parts = [
    `family=${encodeURIComponent(brand.nameFont)}&text=${nameParam}`,
    `family=${encodeURIComponent(brand.headingFont)}:wght@400;600;700`,
    `family=${encodeURIComponent(brand.bodyFont)}:wght@400;500;600`,
  ];
  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}
