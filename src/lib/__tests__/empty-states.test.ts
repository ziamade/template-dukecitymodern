import { describe, it, expect } from 'vitest';

/**
 * Branded empty-state logic lives in src/pages/index.astro as a
 * shouldShowEmptyState() helper. These tests mirror that helper so the
 * rules stay machine-verified without needing to render an Astro page.
 *
 * If the real index.astro logic changes shape, rebuild this oracle to
 * match — the test is the regression anchor, not the production code.
 */

type TestimonialsLike = {
  reviewCount?: number | null;
  averageRating?: number | null;
  items?: Array<unknown>;
};
type GalleryLike = { images?: Array<unknown>; beholdFeedId?: string };
type MenuLike = { categories?: Array<{ items?: Array<unknown> }> };
type FaqLike = { items?: Array<unknown> };

function shouldShowEmptyState(
  id: string,
  data: {
    testimonials?: TestimonialsLike;
    gallery?: GalleryLike;
    menu?: MenuLike;
    faq?: FaqLike;
  },
): boolean {
  const hasReviews = (data.testimonials?.reviewCount ?? 0) > 0 ||
    (data.testimonials?.averageRating ?? 0) > 0;
  const hasGalleryData = (data.gallery?.images?.length ?? 0) > 0 ||
    Boolean(data.gallery?.beholdFeedId);
  const hasMenuData = (data.menu?.categories?.length ?? 0) > 0 &&
    (data.menu?.categories ?? []).some(c => (c.items?.length ?? 0) > 0);
  const hasFaqData = (data.faq?.items?.length ?? 0) > 0;
  const hasTestimonialItems = (data.testimonials?.items?.length ?? 0) > 0;

  switch (id) {
    case 'reviews':      return !hasReviews;
    case 'gallery':      return !hasGalleryData;
    case 'menu':         return !hasMenuData;
    case 'faq':          return !hasFaqData;
    case 'testimonials': return !hasTestimonialItems && !hasReviews;
    default:             return false;
  }
}

describe('empty-state rendering rules', () => {
  describe('reviews', () => {
    it('shows placeholder when reviewCount and averageRating are both 0', () => {
      expect(shouldShowEmptyState('reviews', {
        testimonials: { reviewCount: 0, averageRating: 0 },
      })).toBe(true);
    });

    it('shows placeholder when testimonials is missing entirely', () => {
      expect(shouldShowEmptyState('reviews', {})).toBe(true);
    });

    it('omits placeholder when reviewCount > 0', () => {
      expect(shouldShowEmptyState('reviews', {
        testimonials: { reviewCount: 42, averageRating: 0 },
      })).toBe(false);
    });

    it('omits placeholder when averageRating > 0 even with reviewCount 0', () => {
      expect(shouldShowEmptyState('reviews', {
        testimonials: { reviewCount: 0, averageRating: 4.8 },
      })).toBe(false);
    });
  });

  describe('gallery', () => {
    it('shows placeholder when images array is empty and no behold feed', () => {
      expect(shouldShowEmptyState('gallery', { gallery: { images: [] } })).toBe(true);
    });

    it('omits placeholder when images are present', () => {
      expect(shouldShowEmptyState('gallery', {
        gallery: { images: [{ url: 'a' }] },
      })).toBe(false);
    });

    it('omits placeholder when behold feed is configured but no static images', () => {
      expect(shouldShowEmptyState('gallery', {
        gallery: { images: [], beholdFeedId: 'abc' },
      })).toBe(false);
    });
  });

  describe('menu', () => {
    it('shows placeholder when categories array is empty', () => {
      expect(shouldShowEmptyState('menu', { menu: { categories: [] } })).toBe(true);
    });

    it('shows placeholder when categories exist but every category is itemless', () => {
      expect(shouldShowEmptyState('menu', {
        menu: { categories: [{ items: [] }, { items: [] }] },
      })).toBe(true);
    });

    it('omits placeholder when at least one category has items', () => {
      expect(shouldShowEmptyState('menu', {
        menu: { categories: [{ items: [] }, { items: [{ name: 'Taco' }] }] },
      })).toBe(false);
    });
  });

  describe('faq', () => {
    it('shows placeholder when items array is empty', () => {
      expect(shouldShowEmptyState('faq', { faq: { items: [] } })).toBe(true);
    });

    it('omits placeholder when items are present', () => {
      expect(shouldShowEmptyState('faq', {
        faq: { items: [{ q: 'a', a: 'b' }] },
      })).toBe(false);
    });
  });

  describe('testimonials', () => {
    it('shows placeholder when items is empty and no review aggregate', () => {
      expect(shouldShowEmptyState('testimonials', {
        testimonials: { items: [], reviewCount: 0 },
      })).toBe(true);
    });

    it('omits placeholder when item array has entries', () => {
      expect(shouldShowEmptyState('testimonials', {
        testimonials: { items: [{ text: 'great' }] },
      })).toBe(false);
    });

    it('omits placeholder when aggregate reviews exist (even without items)', () => {
      expect(shouldShowEmptyState('testimonials', {
        testimonials: { items: [], reviewCount: 12, averageRating: 4.5 },
      })).toBe(false);
    });
  });

  describe('unknown section ids', () => {
    it('never shows placeholder for sections outside the opt-in list', () => {
      expect(shouldShowEmptyState('hero', {})).toBe(false);
      expect(shouldShowEmptyState('contact', {})).toBe(false);
      expect(shouldShowEmptyState('team', {})).toBe(false);
    });
  });
});
