// src/lib/icons.ts — Shared SVG icon loader
// Centralizes the icon glob so it's processed once by Vite, not per-component.

const _icons = import.meta.glob('/src/assets/svgs/icons/*.svg', {
  query: '?raw', import: 'default', eager: true,
});

/** Get an SVG icon by filename (without extension). Returns empty string if not found. */
export function getIcon(name: string): string {
  return (_icons[`/src/assets/svgs/icons/${name}.svg`] as string) || '';
}
