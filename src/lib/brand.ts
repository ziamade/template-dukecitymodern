// src/lib/brand.ts
import type { Brand, ColorPalette } from './types';

/**
 * Generate CSS custom properties from a single color palette.
 * v4: Single palette, no light/dark toggle.
 */
export function paletteToCSS(palette: ColorPalette): string {
  const vars: string[] = [];

  // Core palette
  vars.push(`  --bg: ${palette.bg};`);
  vars.push(`  --background: ${palette.bg};`); // alias for backward compat
  vars.push(`  --surface: ${palette.surface};`);
  vars.push(`  --surfaceAlt: ${palette.surfaceAlt};`);
  vars.push(`  --text: ${palette.text};`);
  vars.push(`  --textMuted: ${palette.textMuted};`);
  vars.push(`  --accent: ${palette.accent};`);
  vars.push(`  --accentDim: ${palette.accentDim};`);
  vars.push(`  --accentGlow: ${palette.accentGlow};`);
  vars.push(`  --border: ${palette.border};`);

  // Optional
  if (palette.borderSubtle) {
    vars.push(`  --borderSubtle: ${palette.borderSubtle};`);
  } else {
    vars.push(`  --borderSubtle: ${palette.border};`);
  }

  // Derived glass surfaces (theme-agnostic)
  vars.push(`  --surface-glass: rgba(255, 255, 255, 0.03);`);
  vars.push(`  --surface-glass-hover: rgba(255, 255, 255, 0.06);`);

  return vars.join('\n');
}

/**
 * Generate the full CSS block for the site's single palette + fonts.
 * v4: No light/dark modes, no data-theme, no @media prefers-color-scheme.
 */
export function generateThemeCSS(brand: Brand): string {
  const paletteCSS = paletteToCSS(brand.palette);
  const monoFont = brand.monoFont
    ? `'${brand.monoFont}', 'JetBrains Mono', monospace`
    : `'JetBrains Mono', 'SF Mono', monospace`;

  return `
:root {
${paletteCSS}
  --font-name: '${brand.nameFont}', var(--font-heading), sans-serif;
  --font-heading: '${brand.headingFont}', sans-serif;
  --font-body: '${brand.bodyFont}', system-ui, sans-serif;
  --font-mono: ${monoFont};
}`.trim();
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
    display: {
      base: 'clamp(1rem, 0.95rem + 0.3vw, 1.125rem)',
      h1: 'clamp(2.5rem, 2rem + 4vw, 5rem)',
      h2: 'clamp(2rem, 1.5rem + 2vw, 3.5rem)',
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

// buildFontURL() removed — replaced by self-hosted fonts in src/lib/fonts.ts
// Use buildFontFaceCSS(brand) from '../lib/fonts' instead.
