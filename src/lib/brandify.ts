// src/lib/brandify.ts — Auto-style business name in body copy
import type { Brand, NamePart } from './types';

/**
 * Wrap occurrences of the business name in body text with styled HTML spans.
 * Uses nameTreatment parts when available, falls back to .brand-name class.
 *
 * Usage in Astro: <p set:html={brandify(text, clientName, brand)} />
 */
export function brandify(text: string, clientName: string, brand: Brand): string {
  // Escape the full text first to prevent HTML injection via data files,
  // then replace the escaped business name with styled spans.
  const safe = escapeHtml(text);
  const safeName = escapeHtml(clientName);
  if (!safeName || !safe.includes(safeName)) return safe;

  const treatment = brand.nameTreatment;
  let replacement: string;

  if (treatment && treatment.parts.length > 0) {
    const inner = treatment.parts
      .map(p => {
        const font = SAFE_FONTS.has(p.font) ? p.font : 'body';
        const color = SAFE_COLORS.has(p.color) ? p.color : 'text';
        return `<span class="bn__p bn__p--${font} bn__p--${color}">${escapeHtml(p.text)}</span>`;
      })
      .join('');
    replacement = `<span class="bn bn--inline">${inner}</span>`;
  } else {
    replacement = `<span class="bn bn--inline brand-name">${safeName}</span>`;
  }

  return safe.replaceAll(safeName, replacement);
}

const SAFE_FONTS = new Set(['name', 'heading', 'body']);
const SAFE_COLORS = new Set(['accent', 'primary', 'text', 'textMuted', 'gradient']);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
