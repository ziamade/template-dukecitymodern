/**
 * Fixture definitions — each describes a complete data configuration
 * and what sections/features should be present in the built output.
 */

export interface FixtureDefinition {
  name: string;
  description: string;
  expectedSections: string[];
  absentSections: string[];
  heroStyle: 'split' | 'overlay' | 'video' | 'minimal';
  serviceVariant: 'cards' | 'icon-grid' | 'compact' | 'none';
  galleryVariant: 'masonry' | 'scroll' | 'none';
  isRestaurant: boolean;
  hasGallery: boolean;
  hasProjects: boolean;
  hasReviews: boolean;
  hasFAQ: boolean;
  hasAlert: boolean;
  hasBeforeAfter: boolean;
  hasDifferentiator: boolean;
  hasMenu: boolean;
  hasMarquee: boolean;
}

export const FIXTURES: FixtureDefinition[] = [
  {
    name: 'standard-service',
    description: 'F1: Service business, split hero, cards, masonry gallery, full data',
    heroStyle: 'split',
    serviceVariant: 'cards',
    galleryVariant: 'masonry',
    expectedSections: ['hero', 'trust', 'services', 'projects', 'process', 'gallery', 'reviews', 'faq', 'contact', 'about', 'hours'],
    absentSections: ['menu'],
    isRestaurant: false,
    hasGallery: true,
    hasProjects: true,
    hasReviews: true,
    hasFAQ: true,
    hasAlert: false,
    hasBeforeAfter: true,
    hasDifferentiator: true,
    hasMenu: false,
    hasMarquee: true,
  },
  {
    name: 'overlay-rich',
    description: 'F2: Service, overlay hero, icon-grid, scroll gallery, cinematic, tactile',
    heroStyle: 'overlay',
    serviceVariant: 'icon-grid',
    galleryVariant: 'scroll',
    expectedSections: ['hero', 'trust', 'services', 'gallery', 'reviews', 'faq', 'contact', 'about'],
    absentSections: ['menu', 'projects'],
    isRestaurant: false,
    hasGallery: true,
    hasProjects: false,
    hasReviews: true,
    hasFAQ: true,
    hasAlert: true,
    hasBeforeAfter: false,
    hasDifferentiator: false,
    hasMenu: false,
    hasMarquee: true,
  },
  {
    name: 'minimal-clean',
    description: 'F3: Minimal hero, compact services, no gallery/projects, no motion',
    heroStyle: 'minimal',
    serviceVariant: 'compact',
    galleryVariant: 'none',
    expectedSections: ['hero', 'trust', 'services', 'faq', 'contact', 'about'],
    absentSections: ['menu', 'gallery', 'projects', 'reviews'],
    isRestaurant: false,
    hasGallery: false,
    hasProjects: false,
    hasReviews: false,
    hasFAQ: true,
    hasAlert: false,
    hasBeforeAfter: false,
    hasDifferentiator: false,
    hasMenu: false,
    hasMarquee: false,
  },
  {
    name: 'restaurant',
    description: 'F4: Restaurant, overlay hero, menu, OrderVisit, scroll gallery',
    heroStyle: 'overlay',
    serviceVariant: 'none',
    galleryVariant: 'scroll',
    expectedSections: ['hero', 'menu', 'gallery', 'reviews', 'hours', 'about', 'contact'],
    absentSections: ['services', 'projects', 'process'],
    isRestaurant: true,
    hasGallery: true,
    hasProjects: false,
    hasReviews: true,
    hasFAQ: true,
    hasAlert: false,
    hasBeforeAfter: false,
    hasDifferentiator: false,
    hasMenu: true,
    hasMarquee: true,
  },
  {
    name: 'video-hero',
    description: 'F5: Video hero, icon-grid, trust=stats, editorial, masked images',
    heroStyle: 'video',
    serviceVariant: 'icon-grid',
    galleryVariant: 'none',
    expectedSections: ['hero', 'trust', 'services', 'reviews', 'faq', 'contact', 'about', 'hours'],
    absentSections: ['menu', 'gallery'],
    isRestaurant: false,
    hasGallery: false,
    hasProjects: false,
    hasReviews: true,
    hasFAQ: true,
    hasAlert: false,
    hasBeforeAfter: false,
    hasDifferentiator: false,
    hasMenu: false,
    hasMarquee: true,
  },
  {
    name: 'empty-states',
    description: 'F6: Minimal hero, empty everything — tests graceful degradation',
    heroStyle: 'minimal',
    serviceVariant: 'cards',
    galleryVariant: 'none',
    expectedSections: ['hero', 'trust', 'services', 'contact', 'about'],
    absentSections: ['menu', 'gallery', 'reviews', 'projects'],
    isRestaurant: false,
    hasGallery: false,
    hasProjects: false,
    hasReviews: false,
    hasFAQ: false,
    hasAlert: false,
    hasBeforeAfter: false,
    hasDifferentiator: false,
    hasMenu: false,
    hasMarquee: false,
  },
  {
    name: 'maximal',
    description: 'F7: Every section on, max items, split hero, cards, masonry',
    heroStyle: 'split',
    serviceVariant: 'cards',
    galleryVariant: 'masonry',
    expectedSections: ['hero', 'trust', 'services', 'projects', 'process', 'gallery', 'reviews', 'faq', 'contact', 'about', 'hours'],
    absentSections: ['menu'],
    isRestaurant: false,
    hasGallery: true,
    hasProjects: true,
    hasReviews: true,
    hasFAQ: true,
    hasAlert: true,
    hasBeforeAfter: true,
    hasDifferentiator: true,
    hasMenu: false,
    hasMarquee: true,
  },
  {
    name: 'edge-cases',
    description: 'F8: Special chars, broken images, very long text, minimal hero, alert',
    heroStyle: 'minimal',
    serviceVariant: 'cards',
    galleryVariant: 'masonry',
    expectedSections: ['hero', 'trust', 'services', 'gallery', 'reviews', 'faq', 'contact', 'about'],
    absentSections: ['menu'],
    isRestaurant: false,
    hasGallery: true,
    hasProjects: false,
    hasReviews: true,
    hasFAQ: true,
    hasAlert: true,
    hasBeforeAfter: false,
    hasDifferentiator: false,
    hasMenu: false,
    hasMarquee: true,
  },
  {
    name: 'light-palette',
    description: 'F9: Light brand colors (white bg, dark text), overlay hero, trust=stats',
    heroStyle: 'overlay',
    serviceVariant: 'cards',
    galleryVariant: 'masonry',
    expectedSections: ['hero', 'trust', 'services', 'reviews', 'faq', 'contact', 'about', 'hours'],
    absentSections: ['menu', 'projects'],
    isRestaurant: false,
    hasGallery: true,
    hasProjects: false,
    hasReviews: true,
    hasFAQ: true,
    hasAlert: false,
    hasBeforeAfter: false,
    hasDifferentiator: false,
    hasMenu: false,
    hasMarquee: true,
  },
  {
    name: 'round-soft',
    description: 'F10: All rounded, pill buttons, editorial, scroll gallery, compact services',
    heroStyle: 'split',
    serviceVariant: 'compact',
    galleryVariant: 'scroll',
    expectedSections: ['hero', 'trust', 'services', 'gallery', 'reviews', 'faq', 'contact', 'about', 'hours'],
    absentSections: ['menu', 'projects'],
    isRestaurant: false,
    hasGallery: true,
    hasProjects: false,
    hasReviews: true,
    hasFAQ: true,
    hasAlert: false,
    hasBeforeAfter: false,
    hasDifferentiator: false,
    hasMenu: false,
    hasMarquee: true,
  },
];

/** Get fixture by name */
export function getFixture(name: string): FixtureDefinition {
  const f = FIXTURES.find((f) => f.name === name);
  if (!f) throw new Error(`Unknown fixture: ${name}. Available: ${FIXTURES.map((f) => f.name).join(', ')}`);
  return f;
}
