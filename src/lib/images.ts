/**
 * Build-time image resolver.
 *
 * Eagerly globs all images in src/assets/images/ at build time and provides
 * a resolver that maps data-file paths (e.g. "/assets/images/hero.jpg") to
 * Astro ImageMetadata objects for use with <Picture>.
 *
 * External URLs and missing files return null, so components can fall back
 * to a plain <img> with onerror handler.
 */

import type { ImageMetadata } from 'astro';

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,gif,svg}',
  { eager: true },
);

/**
 * Resolve a data-file image path to an Astro ImageMetadata object.
 * Returns null for external URLs, empty strings, or missing local files.
 */
export function resolveImage(path: string | undefined | null): ImageMetadata | null {
  if (!path || path.startsWith('http')) return null;

  // Data files reference images as /assets/images/...
  // Glob keys are /src/assets/images/...
  const key = path.startsWith('/assets/images/')
    ? '/src' + path
    : path.startsWith('/src/assets/images/')
      ? path
      : null;

  if (!key) return null;
  return imageModules[key]?.default ?? null;
}
