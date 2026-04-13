/**
 * Section registry — maps section IDs to component names and resolves
 * data-driven overrides. No industry detection logic belongs here.
 */

/** Default component name for each section ID */
export const DEFAULT_COMPONENTS: Record<string, string> = {
  hero: 'Hero',
  trust: 'TrustBar',
  services: 'ServiceCards',
  projects: 'ProjectGallery',
  process: 'ProcessSteps',
  gallery: 'PhotoGallery',
  menu: 'MenuSection',
  reviews: 'Reviews',
  faq: 'FAQ',
  contact: 'QuoteForm',
  about: 'AboutMap',
  hours: 'HoursDisplay',
  beforeAfter: 'BeforeAfter',
  differentiator: 'Differentiator',
  facility: 'Facility',
  marquee: 'Marquee',
  team: 'Team',
  products: 'Products',
  cta: 'CTASection',
  book: 'BookShowcase',
};

/** Component variant overrides (variant string → component name) */
export const VARIANT_OVERRIDES: Record<string, Record<string, string>> = {
  trust: { stats: 'TrustStats' },
  contact: { 'order-visit': 'OrderVisit' },
  about: { 'author-bio': 'AuthorBio' },
  differentiator: { 'service-options': 'ServiceOptions' },
};

/** Default nav labels for each section */
const DEFAULT_NAV_LABELS: Record<string, string> = {
  hero: '',
  trust: '',
  services: 'Services',
  projects: 'Our Work',
  process: '',
  gallery: 'Photos',
  menu: 'Menu',
  reviews: 'Reviews',
  faq: 'FAQ',
  contact: 'Contact',
  about: 'About',
  hours: 'Hours',
  beforeAfter: '',
  differentiator: '',
  marquee: '',
  team: 'Team',
  products: 'Products',
  cta: '',
  book: 'The Book',
};

/** Sections that are never shown in navigation */
const NAV_EXCLUDED = new Set(['hero', 'trust', 'process', 'beforeAfter', 'differentiator', 'marquee', 'cta', 'facility']);

/**
 * Resolve which component to render for a section.
 * Returns the component name string, or null if unknown.
 */
export function resolveComponent(sectionId: string, variant?: string | number): string | null {
  if (variant !== undefined) {
    const overrides = VARIANT_OVERRIDES[sectionId];
    if (overrides && String(variant) in overrides) {
      return overrides[String(variant)];
    }
  }
  return DEFAULT_COMPONENTS[sectionId] ?? null;
}

/**
 * Merge theme nav label overrides with defaults.
 * NAV_EXCLUDED sections always return empty string.
 */
export function resolveNavLabels(overrides?: Record<string, string>): Record<string, string> {
  const labels = { ...DEFAULT_NAV_LABELS };
  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      if (!NAV_EXCLUDED.has(key)) {
        labels[key] = value;
      }
    }
  }
  // Ensure excluded sections stay empty
  for (const key of NAV_EXCLUDED) {
    labels[key] = '';
  }
  return labels;
}

/**
 * Resolve header CTA button (text + href).
 */
export function resolveCta(override?: { text?: string; href?: string }): { text: string; href: string } {
  return {
    text: override?.text || 'Get Quote',
    href: override?.href || '#contact',
  };
}

/**
 * Resolve hero CTA button (text + href).
 */
export function resolveHeroCta(override?: { text?: string; href?: string }): { text: string; href: string } {
  return {
    text: override?.text || 'Get Your Free Quote',
    href: override?.href || '#contact',
  };
}
