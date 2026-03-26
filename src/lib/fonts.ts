// src/lib/fonts.ts — Self-hosted font registry and @font-face CSS generation
import type { Brand } from './types';

interface FontEntry {
  /** CSS font-family name */
  family: string;
  /** CSS fallback stack (e.g., "sans-serif", "serif", "cursive") */
  fallback: string;
  /** File(s) in public/fonts/ */
  files: Array<{
    path: string;
    weight: string;   // e.g., "400", "400 900" (variable range)
    style: string;    // "normal" or "italic"
  }>;
}

/**
 * Registry of all self-hosted fonts available in public/fonts/.
 * Keyed by the exact font-family name as it appears in brand.json.
 */
const FONT_REGISTRY: Record<string, FontEntry> = {
  // ── Google Variable Fonts ──────────────────────────────────────────────
  'Source Sans 3': {
    family: 'Source Sans 3',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/source-sans-3-variable.woff2', weight: '200 900', style: 'normal' }],
  },
  'Teko': {
    family: 'Teko',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/teko-variable.woff2', weight: '300 700', style: 'normal' }],
  },
  'Hanken Grotesk': {
    family: 'Hanken Grotesk',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/hanken-grotesk-variable.woff2', weight: '100 900', style: 'normal' }],
  },
  'Bricolage Grotesque': {
    family: 'Bricolage Grotesque',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/bricolage-grotesque-variable.woff2', weight: '200 800', style: 'normal' }],
  },
  'Libre Franklin': {
    family: 'Libre Franklin',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/libre-franklin-variable.woff2', weight: '100 900', style: 'normal' }],
  },
  'Sora': {
    family: 'Sora',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/sora-variable.woff2', weight: '100 800', style: 'normal' }],
  },
  'Outfit': {
    family: 'Outfit',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/outfit-variable.woff2', weight: '100 900', style: 'normal' }],
  },
  'Schibsted Grotesk': {
    family: 'Schibsted Grotesk',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/schibsted-grotesk-variable.woff2', weight: '400 900', style: 'normal' }],
  },
  'Fraunces': {
    family: 'Fraunces',
    fallback: 'serif',
    files: [{ path: '/fonts/fraunces-variable.woff2', weight: '100 900', style: 'normal' }],
  },
  'Nunito Sans': {
    family: 'Nunito Sans',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/nunito-sans-variable.woff2', weight: '200 1000', style: 'normal' }],
  },
  'DM Sans': {
    family: 'DM Sans',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/dm-sans-variable.woff2', weight: '100 1000', style: 'normal' }],
  },
  'Lora': {
    family: 'Lora',
    fallback: 'serif',
    files: [{ path: '/fonts/lora-variable.woff2', weight: '400 700', style: 'normal' }],
  },
  'Plus Jakarta Sans': {
    family: 'Plus Jakarta Sans',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/plus-jakarta-sans-variable.woff2', weight: '200 800', style: 'normal' }],
  },
  'Figtree': {
    family: 'Figtree',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/figtree-variable.woff2', weight: '300 900', style: 'normal' }],
  },
  'Caveat': {
    family: 'Caveat',
    fallback: 'cursive',
    files: [{ path: '/fonts/caveat-variable.woff2', weight: '400 700', style: 'normal' }],
  },
  'Unbounded': {
    family: 'Unbounded',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/unbounded-variable.woff2', weight: '200 900', style: 'normal' }],
  },
  'Archivo Narrow': {
    family: 'Archivo Narrow',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/archivo-narrow-variable.woff2', weight: '400 700', style: 'normal' }],
  },
  'Cinzel': {
    family: 'Cinzel',
    fallback: 'serif',
    files: [{ path: '/fonts/cinzel-variable.woff2', weight: '400 900', style: 'normal' }],
  },
  'Playfair Display': {
    family: 'Playfair Display',
    fallback: 'serif',
    files: [{ path: '/fonts/playfair-display-variable.woff2', weight: '400 900', style: 'normal' }],
  },
  'Cormorant Garamond': {
    family: 'Cormorant Garamond',
    fallback: 'serif',
    files: [{ path: '/fonts/cormorant-garamond-variable.woff2', weight: '300 700', style: 'normal' }],
  },
  'Space Grotesk': {
    family: 'Space Grotesk',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/space-grotesk-variable.woff2', weight: '300 700', style: 'normal' }],
  },
  'Lexend': {
    family: 'Lexend',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/lexend-variable.woff2', weight: '100 900', style: 'normal' }],
  },
  'Josefin Sans': {
    family: 'Josefin Sans',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/josefin-sans-variable.woff2', weight: '100 700', style: 'normal' }],
  },

  // ── Google Static Fonts ────────────────────────────────────────────────
  'Barlow Condensed': {
    family: 'Barlow Condensed',
    fallback: 'sans-serif',
    files: [
      { path: '/fonts/barlow-condensed-400.woff2', weight: '400', style: 'normal' },
      { path: '/fonts/barlow-condensed-600.woff2', weight: '600', style: 'normal' },
      { path: '/fonts/barlow-condensed-700.woff2', weight: '700', style: 'normal' },
    ],
  },
  'Instrument Serif': {
    family: 'Instrument Serif',
    fallback: 'serif',
    files: [{ path: '/fonts/instrument-serif-400.woff2', weight: '400', style: 'normal' }],
  },
  'Bebas Neue': {
    family: 'Bebas Neue',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/bebas-neue-400.woff2', weight: '400', style: 'normal' }],
  },
  'Archivo Black': {
    family: 'Archivo Black',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/archivo-black-400.woff2', weight: '400', style: 'normal' }],
  },
  'Russo One': {
    family: 'Russo One',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/russo-one-400.woff2', weight: '400', style: 'normal' }],
  },
  'Righteous': {
    family: 'Righteous',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/righteous-400.woff2', weight: '400', style: 'normal' }],
  },
  'Bungee': {
    family: 'Bungee',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/bungee-400.woff2', weight: '400', style: 'normal' }],
  },
  'Alfa Slab One': {
    family: 'Alfa Slab One',
    fallback: 'serif',
    files: [{ path: '/fonts/alfa-slab-one-400.woff2', weight: '400', style: 'normal' }],
  },
  'Pacifico': {
    family: 'Pacifico',
    fallback: 'cursive',
    files: [{ path: '/fonts/pacifico-400.woff2', weight: '400', style: 'normal' }],
  },
  'Sacramento': {
    family: 'Sacramento',
    fallback: 'cursive',
    files: [{ path: '/fonts/sacramento-400.woff2', weight: '400', style: 'normal' }],
  },
  'Permanent Marker': {
    family: 'Permanent Marker',
    fallback: 'cursive',
    files: [{ path: '/fonts/permanent-marker-400.woff2', weight: '400', style: 'normal' }],
  },

  // ── Fontshare Variable Fonts ───────────────────────────────────────────
  'Clash Display': {
    family: 'Clash Display',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/clash-display-variable.woff2', weight: '200 700', style: 'normal' }],
  },
  'Satoshi': {
    family: 'Satoshi',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/satoshi-variable.woff2', weight: '300 900', style: 'normal' }],
  },
  'General Sans': {
    family: 'General Sans',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/general-sans-variable.woff2', weight: '200 700', style: 'normal' }],
  },
  'Cabinet Grotesk': {
    family: 'Cabinet Grotesk',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/cabinet-grotesk-variable.woff2', weight: '100 900', style: 'normal' }],
  },
  'Zodiak': {
    family: 'Zodiak',
    fallback: 'serif',
    files: [{ path: '/fonts/zodiak-variable.woff2', weight: '200 800', style: 'normal' }],
  },
  'Panchang': {
    family: 'Panchang',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/panchang-variable.woff2', weight: '200 800', style: 'normal' }],
  },
  'Boska': {
    family: 'Boska',
    fallback: 'serif',
    files: [{ path: '/fonts/boska-variable.woff2', weight: '200 900', style: 'normal' }],
  },
  'Gambetta': {
    family: 'Gambetta',
    fallback: 'serif',
    files: [{ path: '/fonts/gambetta-variable.woff2', weight: '200 900', style: 'normal' }],
  },
  'Chillax': {
    family: 'Chillax',
    fallback: 'sans-serif',
    files: [{ path: '/fonts/chillax-variable.woff2', weight: '200 700', style: 'normal' }],
  },

  // ── Legacy fonts (for backward compatibility with existing brand.json) ─
  'Oswald': {
    family: 'Oswald',
    fallback: 'sans-serif',
    // Not self-hosted — fall back to system fonts. Existing sites should
    // be migrated to a real pairing, but this prevents build failures.
    files: [],
  },
  'Roboto Slab': {
    family: 'Roboto Slab',
    fallback: 'serif',
    files: [],
  },
  'Inter': {
    family: 'Inter',
    fallback: 'sans-serif',
    files: [],
  },
  'Open Sans': {
    family: 'Open Sans',
    fallback: 'sans-serif',
    files: [],
  },
};

/**
 * Look up a font entry. Returns undefined if not in registry,
 * which means the font will just use its fallback stack.
 */
export function getFontEntry(family: string): FontEntry | undefined {
  return FONT_REGISTRY[family];
}

/**
 * Generate @font-face CSS declarations for the fonts in a brand config.
 * Only emits declarations for fonts that have self-hosted files.
 * Deduplicates when nameFont === headingFont or headingFont === bodyFont.
 */
export function buildFontFaceCSS(brand: Brand): string {
  const families = new Set<string>();
  families.add(brand.nameFont);
  families.add(brand.headingFont);
  families.add(brand.bodyFont);

  const blocks: string[] = [];

  for (const family of Array.from(families)) {
    const entry = FONT_REGISTRY[family];
    if (!entry || entry.files.length === 0) continue;

    for (const file of entry.files) {
      blocks.push(`@font-face {
  font-family: '${entry.family}';
  src: url('${file.path}') format('woff2');
  font-weight: ${file.weight};
  font-style: ${file.style};
  font-display: swap;
}`);
    }
  }

  return blocks.join('\n\n');
}
