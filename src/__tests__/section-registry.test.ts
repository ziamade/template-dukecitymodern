import { describe, it, expect } from 'vitest';
import {
  resolveComponent,
  resolveNavLabels,
  resolveCta,
  resolveHeroCta,
} from '../lib/section-registry';

describe('resolveComponent', () => {
  it('returns the default component for a section id', () => {
    expect(resolveComponent('services')).toBe('ServiceCards');
    expect(resolveComponent('reviews')).toBe('Reviews');
    expect(resolveComponent('about')).toBe('AboutMap');
    expect(resolveComponent('contact')).toBe('QuoteForm');
  });

  it('resolves all 19 default section IDs', () => {
    const expected: Record<string, string> = {
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
      marquee: 'Marquee',
      team: 'Team',
      products: 'Products',
      cta: 'CTASection',
      book: 'BookShowcase',
    };
    for (const [id, component] of Object.entries(expected)) {
      expect(resolveComponent(id)).toBe(component);
    }
  });

  it('component override in SectionEntry takes precedence', () => {
    expect(resolveComponent('contact', 'order-visit')).toBe('OrderVisit');
    expect(resolveComponent('about', 'author-bio')).toBe('AuthorBio');
  });

  it('returns null for unknown section id', () => {
    expect(resolveComponent('unknown-section')).toBeNull();
  });

  it('trust variant "stats" resolves to TrustStats', () => {
    expect(resolveComponent('trust', 'stats')).toBe('TrustStats');
  });

  it('trust default resolves to TrustBar', () => {
    expect(resolveComponent('trust')).toBe('TrustBar');
  });

  it('ignores unknown variant and returns default', () => {
    expect(resolveComponent('trust', 'nonexistent')).toBe('TrustBar');
    expect(resolveComponent('contact', 'nonexistent')).toBe('QuoteForm');
  });

  it('handles numeric variant by stringifying', () => {
    // variant can be string | number per the signature
    expect(resolveComponent('trust', 0)).toBe('TrustBar');
  });
});

describe('resolveNavLabels', () => {
  it('returns default labels for standard sections', () => {
    const labels = resolveNavLabels();
    expect(labels.services).toBe('Services');
    expect(labels.reviews).toBe('Reviews');
    expect(labels.contact).toBe('Contact');
    expect(labels.about).toBe('About');
  });

  it('theme overrides merge with defaults', () => {
    const labels = resolveNavLabels({ reviews: 'Praise', contact: 'Order' });
    expect(labels.reviews).toBe('Praise');
    expect(labels.contact).toBe('Order');
    expect(labels.services).toBe('Services'); // non-overridden stays default
  });

  it('hero and trust are always empty (not in nav)', () => {
    const labels = resolveNavLabels({ hero: 'Hero', trust: 'Trust' });
    expect(labels.hero).toBe('');
    expect(labels.trust).toBe('');
  });

  it('all NAV_EXCLUDED sections stay empty even with overrides', () => {
    const excluded = ['hero', 'trust', 'process', 'beforeAfter', 'differentiator', 'marquee', 'cta'];
    const overrides = Object.fromEntries(excluded.map(k => [k, 'Should Not Appear']));
    const labels = resolveNavLabels(overrides);
    for (const key of excluded) {
      expect(labels[key]).toBe('');
    }
  });

  it('navigable sections have non-empty default labels', () => {
    const labels = resolveNavLabels();
    const navigable = ['services', 'projects', 'gallery', 'menu', 'reviews', 'faq', 'contact', 'about', 'hours', 'team', 'products', 'book'];
    for (const key of navigable) {
      expect(labels[key]).not.toBe('');
    }
  });
});

describe('resolveCta', () => {
  it('defaults to Get Quote / #contact', () => {
    const cta = resolveCta();
    expect(cta.text).toBe('Get Quote');
    expect(cta.href).toBe('#contact');
  });

  it('accepts theme override', () => {
    const cta = resolveCta({ text: 'Order Now', href: '#menu' });
    expect(cta.text).toBe('Order Now');
    expect(cta.href).toBe('#menu');
  });
});

describe('resolveHeroCta', () => {
  it('defaults to Get Your Free Quote / #contact', () => {
    const heroCta = resolveHeroCta();
    expect(heroCta.text).toBe('Get Your Free Quote');
    expect(heroCta.href).toBe('#contact');
  });

  it('accepts theme override', () => {
    const heroCta = resolveHeroCta({ text: 'View Our Menu', href: '#menu' });
    expect(heroCta.text).toBe('View Our Menu');
    expect(heroCta.href).toBe('#menu');
  });
});
