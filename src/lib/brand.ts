// src/lib/brand.ts
import type { Brand, ColorPalette } from './types';

/**
 * Strip characters that could break out of a CSS property value context.
 * Defense-in-depth: schemas validate first, this catches anything that slips through.
 */
function cssSafe(val: string): string {
  return val.replace(/[{}<>;"'\\]/g, '');
}

/** Parse a hex color to [r, g, b] (0-255). Returns null for non-hex inputs. */
function parseHex(hex: string): [number, number, number] | null {
  const match = hex.match(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
  if (!match) return null;
  const h = match[1];
  const full = h.length === 3
    ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/**
 * Determine if a hex color is "light" using perceived brightness.
 * Used to flip glass surface base color for light vs dark palettes.
 */
function isLightColor(hex: string): boolean {
  const rgb = parseHex(hex);
  if (!rgb) return false;
  // ITU-R BT.601 luma
  return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.5;
}

/**
 * WCAG 2.1 relative luminance from a hex color.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * Returns NaN for non-hex inputs.
 */
function getRelativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return NaN;
  const linearize = (c: number) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * linearize(rgb[0] / 255) + 0.7152 * linearize(rgb[1] / 255) + 0.0722 * linearize(rgb[2] / 255);
}

/**
 * WCAG 2.1 contrast ratio between two hex colors.
 * Returns a value between 1 and 21, or NaN if either input is not valid hex.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Derive accentDim (accent at 0.6 opacity) from a hex accent color. */
function deriveAccentDim(accentHex: string): string {
  const rgb = parseHex(accentHex);
  if (!rgb) return 'rgba(128, 128, 128, 0.6)';
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6)`;
}

/** Derive accentGlow (accent at 0.2 opacity) from a hex accent color. */
function deriveAccentGlow(accentHex: string): string {
  const rgb = parseHex(accentHex);
  if (!rgb) return 'rgba(128, 128, 128, 0.2)';
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.2)`;
}

/** Derive border color from bg — darken for light palettes, lighten for dark. */
function deriveBorder(bgHex: string): string {
  const rgb = parseHex(bgHex);
  if (!rgb) return '#E0E0E0';
  const light = isLightColor(bgHex);
  const factor = light ? 0.85 : 1.4;
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v * factor)));
  return `#${clamp(rgb[0]).toString(16).padStart(2, '0')}${clamp(rgb[1]).toString(16).padStart(2, '0')}${clamp(rgb[2]).toString(16).padStart(2, '0')}`;
}

/** Derive borderSubtle — midpoint between bg and border. */
function deriveBorderSubtle(bgHex: string, borderHex: string): string {
  const bgRgb = parseHex(bgHex);
  const borderRgb = parseHex(borderHex);
  if (!bgRgb || !borderRgb) return borderHex;
  const mid = (a: number, b: number) => Math.round((a + b) / 2);
  return `#${mid(bgRgb[0], borderRgb[0]).toString(16).padStart(2, '0')}${mid(bgRgb[1], borderRgb[1]).toString(16).padStart(2, '0')}${mid(bgRgb[2], borderRgb[2]).toString(16).padStart(2, '0')}`;
}

/**
 * Generate CSS custom properties from a single color palette.
 * v4: Single palette, no light/dark toggle.
 * Accepts either the full 10-key palette or just the 6 core colors
 * (bg, surface, surfaceAlt, text, textMuted, accent) — derived colors
 * are auto-computed when omitted.
 */
export function paletteToCSS(palette: ColorPalette): string {
  const vars: string[] = [];

  // Derive optional colors from core 6
  const accentDim = palette.accentDim ?? deriveAccentDim(palette.accent);
  const accentGlow = palette.accentGlow ?? deriveAccentGlow(palette.accent);
  const border = palette.border ?? deriveBorder(palette.bg);
  const borderSubtle = palette.borderSubtle ?? deriveBorderSubtle(palette.bg, border);

  // Core palette
  vars.push(`  --bg: ${cssSafe(palette.bg)};`);
  vars.push(`  --background: ${cssSafe(palette.bg)};`); // alias for backward compat
  vars.push(`  --surface: ${cssSafe(palette.surface)};`);
  vars.push(`  --surfaceAlt: ${cssSafe(palette.surfaceAlt)};`);
  vars.push(`  --text: ${cssSafe(palette.text)};`);
  vars.push(`  --textMuted: ${cssSafe(palette.textMuted)};`);
  vars.push(`  --accent: ${cssSafe(palette.accent)};`);
  vars.push(`  --accentDim: ${cssSafe(accentDim)};`);
  vars.push(`  --accentGlow: ${cssSafe(accentGlow)};`);
  vars.push(`  --border: ${cssSafe(border)};`);
  vars.push(`  --borderSubtle: ${cssSafe(borderSubtle)};`);

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
 * Foundations-polish knobs (issue #79). Each returns 0..n CSS lines appended
 * inside the same `:root { ... }` block emitted by generateThemeCSS().
 *
 * All three are fully optional — when absent, the defaults baked into
 * tokens.css take over, preserving backward-compat with client repos that
 * pre-date the foundations-polish wave.
 */

/** Typography knob → --text-base override (ratio stays driven by tokens.css). */
function generateTypographyCSS(brand: Brand): string[] {
  const baseSize = brand.typography?.baseSize;
  if (typeof baseSize !== 'string' || !baseSize.trim()) return [];
  return [`  --text-base: ${cssSafe(baseSize)};`];
}

/** Spacing knob → --density-multiplier driving the whole spacing scale. */
function generateSpacingCSS(brand: Brand): string[] {
  const density = brand.spacing?.density;
  const MAP: Record<string, string> = {
    compact: '0.85',
    comfortable: '1',
    airy: '1.15',
  };
  const multiplier = MAP[density];
  return multiplier ? [`  --density-multiplier: ${multiplier};`] : [];
}

/** Radius knob → named radius scale. Whole scale switches atomically. */
function generateRadiusCSS(brand: Brand): string[] {
  const style = brand.radius?.style;
  const SCALES: Record<string, { sm: string; md: string; lg: string; pill: string }> = {
    sharp:   { sm: '0',        md: '2px',    lg: '4px',      pill: '9999px' },
    rounded: { sm: '0.25rem',  md: '0.5rem', lg: '1rem',     pill: '9999px' },
    soft:    { sm: '0.5rem',   md: '1rem',   lg: '1.5rem',   pill: '9999px' },
  };
  const scale = SCALES[style];
  if (!scale) return [];
  return [
    `  --radius-sm: ${scale.sm};`,
    `  --radius-md: ${scale.md};`,
    `  --radius-lg: ${scale.lg};`,
    `  --radius-pill: ${scale.pill};`,
  ];
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

  // Build-time WCAG AA contrast check
  if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(brand.palette.accent) &&
      /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(brand.palette.bg)) {
    const ratio = getContrastRatio(brand.palette.accent, brand.palette.bg);
    if (ratio < 4.5) {
      console.warn(
        `[brand] Low contrast: accent (${brand.palette.accent}) on bg (${brand.palette.bg}) = ${ratio.toFixed(2)}:1. WCAG AA requires 4.5:1.`
      );
    }
  }

  const knobLines = [
    ...generateTypographyCSS(brand),
    ...generateSpacingCSS(brand),
    ...generateRadiusCSS(brand),
  ];
  const knobBlock = knobLines.length > 0 ? '\n' + knobLines.join('\n') : '';

  return `
:root {
${paletteCSS}
  --font-name: '${safeName}', var(--font-heading), sans-serif;
  --font-heading: '${safeHeading}', sans-serif;
  --font-body: '${safeBody}', system-ui, sans-serif;
  --font-mono: ${monoFont};${knobBlock}
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
    standard: {
      base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
      h1: 'clamp(2rem, 1.5rem + 2.5vw, 3.25rem)',
      h2: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)',
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

  // Simple tokens: one layout key → one CSS var
  const SIMPLE_TOKENS: Array<{ key: string; map: Record<string, string>; cssVar: string }> = [
    { key: 'cardRadius',      map: RADIUS_MAP,       cssVar: '--card-radius' },
    { key: 'sectionGap',      map: GAP_MAP,          cssVar: '--section-gap' },
    { key: 'buttonStyle',     map: BUTTON_MAP,       cssVar: '--btn-radius' },
    { key: 'imageStyle',      map: IMG_RADIUS_MAP,   cssVar: '--img-radius' },
    { key: 'shadowStyle',     map: SHADOW_MAP,       cssVar: '--shadow-card' },
    { key: 'overlayDarkness', map: OVERLAY_MAP,      cssVar: '--overlay-darkness' },
    { key: 'glassOpacity',    map: GLASS_MAP,        cssVar: '--glass-opacity' },
    { key: 'borderWeight',    map: BORDER_WEIGHT_MAP,cssVar: '--border-weight' },
  ];

  const vars: string[] = [];

  for (const { key, map, cssVar } of SIMPLE_TOKENS) {
    const val = map[layout[key]];
    if (val) vars.push(`  ${cssVar}: ${val};`);
  }

  // Multi-var tokens: one layout key → multiple CSS vars
  if (layout.typographyScale && TYPO_SCALE[layout.typographyScale]) {
    const scale = TYPO_SCALE[layout.typographyScale];
    vars.push(`  --font-size-base: ${scale.base};`);
    vars.push(`  --font-size-h1: ${scale.h1};`);
    vars.push(`  --font-size-h2: ${scale.h2};`);
  }
  if (layout.hoverIntensity && HOVER_SCALE_MAP[layout.hoverIntensity]) {
    vars.push(`  --hover-scale: ${HOVER_SCALE_MAP[layout.hoverIntensity]};`);
    vars.push(`  --hover-shadow: ${HOVER_SHADOW_MAP[layout.hoverIntensity]};`);
  }

  // `:root:root` (specificity 0,2,0), not `:root`. Astro emits the bundled
  // stylesheet <link> AFTER this inline <style>, so an equal-specificity
  // `:root` block loses the cascade to the `:root` defaults in tokens.css and
  // every token that has a default there silently does nothing. That was
  // cardRadius, buttonStyle, imageStyle, shadowStyle and overlayDarkness —
  // five of the layout knobs theme.json exposes, all inert. Doubling the
  // pseudo-class wins on specificity instead of relying on source order.
  return vars.length > 0 ? `:root:root {\n${vars.join('\n')}\n}` : '';
}

// buildFontURL() removed — replaced by self-hosted fonts in src/lib/fonts.ts
// Use buildFontFaceCSS(brand) from '../lib/fonts' instead.
