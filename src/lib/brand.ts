// src/lib/brand.ts
import type { Brand, ColorPalette } from './types';

/**
 * Strip characters that could break out of a CSS property value context.
 * Defense-in-depth: schemas validate first, this catches anything that slips through.
 */
function cssSafe(val: string): string {
  return val.replace(/[{}<>;"'\\]/g, '');
}

/**
 * Determine if a hex color is "light" using perceived brightness.
 * Used to flip glass surface base color for light vs dark palettes.
 */
function isLightColor(hex: string): boolean {
  // Only handle hex colors; non-hex (rgb(...), named colors) default to dark
  const match = hex.match(/^#?([0-9a-fA-F]{3,6})$/);
  if (!match) return false;

  const h = match[1];
  const full = h.length === 3
    ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  // ITU-R BT.601 luma
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Generate CSS custom properties from a single color palette.
 * v4: Single palette, no light/dark toggle.
 */
export function paletteToCSS(palette: ColorPalette): string {
  const vars: string[] = [];

  // Core palette
  vars.push(`  --bg: ${cssSafe(palette.bg)};`);
  vars.push(`  --background: ${cssSafe(palette.bg)};`); // alias for backward compat
  vars.push(`  --surface: ${cssSafe(palette.surface)};`);
  vars.push(`  --surfaceAlt: ${cssSafe(palette.surfaceAlt)};`);
  vars.push(`  --text: ${cssSafe(palette.text)};`);
  vars.push(`  --textMuted: ${cssSafe(palette.textMuted)};`);
  vars.push(`  --accent: ${cssSafe(palette.accent)};`);
  vars.push(`  --accentDim: ${cssSafe(palette.accentDim)};`);
  vars.push(`  --accentGlow: ${cssSafe(palette.accentGlow)};`);
  vars.push(`  --border: ${cssSafe(palette.border)};`);

  // Optional
  if (palette.borderSubtle) {
    vars.push(`  --borderSubtle: ${cssSafe(palette.borderSubtle)};`);
  } else {
    vars.push(`  --borderSubtle: ${cssSafe(palette.border)};`);
  }

  // Derived glass surfaces — auto-detect light/dark palette
  const glassBase = isLightColor(palette.bg) ? '0, 0, 0' : '255, 255, 255';
  vars.push(`  --surface-glass: rgba(${glassBase}, 0.03);`);
  vars.push(`  --surface-glass-hover: rgba(${glassBase}, 0.06);`);

  // Semantic status tokens (palette-independent defaults, overridable via brand.json)
  vars.push(`  --status-success: #16a34a;`);
  vars.push(`  --status-error: #dc2626;`);
  vars.push(`  --status-warning: #f59e0b;`);
  vars.push(`  --star-color: #f5a623;`);

  return vars.join('\n');
}

/**
 * Generate the full CSS block for the site's single palette + fonts.
 * v4: No light/dark modes, no data-theme, no @media prefers-color-scheme.
 */
export function generateThemeCSS(brand: Brand): string {
  const paletteCSS = paletteToCSS(brand.palette);
  const safeName = cssSafe(brand.nameFont);
  const safeHeading = cssSafe(brand.headingFont);
  const safeBody = cssSafe(brand.bodyFont);
  const monoFont = brand.monoFont
    ? `'${cssSafe(brand.monoFont)}', 'JetBrains Mono', monospace`
    : `'JetBrains Mono', 'SF Mono', monospace`;

  return `
:root {
${paletteCSS}
  --font-name: '${safeName}', var(--font-heading), sans-serif;
  --font-heading: '${safeHeading}', sans-serif;
  --font-body: '${safeBody}', system-ui, sans-serif;
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

  const SHADOW_MAP: Record<string, string> = {
    subtle: '0 1px 3px rgba(0,0,0,0.08)',
    standard: '0 2px 8px rgba(0,0,0,0.12)',
    dramatic: '0 4px 16px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.08)',
  };
  const HOVER_SCALE_MAP: Record<string, string> = {
    none: '1',
    subtle: '1.01',
    standard: '1.03',
  };
  const HOVER_SHADOW_MAP: Record<string, string> = {
    none: 'none',
    subtle: '0 2px 8px rgba(0,0,0,0.1)',
    standard: '0 4px 16px rgba(0,0,0,0.15)',
  };
  const OVERLAY_MAP: Record<string, string> = {
    light: '0.3',
    medium: '0.5',
    heavy: '0.7',
  };
  const GLASS_MAP: Record<string, string> = {
    subtle: '0.03',
    standard: '0.06',
    heavy: '0.12',
  };
  const BORDER_WEIGHT_MAP: Record<string, string> = {
    none: '0',
    subtle: '1px',
    standard: '2px',
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
  if (layout.shadowStyle && SHADOW_MAP[layout.shadowStyle]) {
    vars.push(`  --shadow-card: ${SHADOW_MAP[layout.shadowStyle]};`);
  }
  if (layout.hoverIntensity && HOVER_SCALE_MAP[layout.hoverIntensity]) {
    vars.push(`  --hover-scale: ${HOVER_SCALE_MAP[layout.hoverIntensity]};`);
    vars.push(`  --hover-shadow: ${HOVER_SHADOW_MAP[layout.hoverIntensity]};`);
  }
  if (layout.overlayDarkness && OVERLAY_MAP[layout.overlayDarkness]) {
    vars.push(`  --overlay-darkness: ${OVERLAY_MAP[layout.overlayDarkness]};`);
  }
  if (layout.glassOpacity && GLASS_MAP[layout.glassOpacity]) {
    vars.push(`  --glass-opacity: ${GLASS_MAP[layout.glassOpacity]};`);
  }
  if (layout.borderWeight && BORDER_WEIGHT_MAP[layout.borderWeight]) {
    vars.push(`  --border-weight: ${BORDER_WEIGHT_MAP[layout.borderWeight]};`);
  }

  return vars.length > 0 ? `:root {\n${vars.join('\n')}\n}` : '';
}

// buildFontURL() removed — replaced by self-hosted fonts in src/lib/fonts.ts
// Use buildFontFaceCSS(brand) from '../lib/fonts' instead.
