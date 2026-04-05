import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentsDir = resolve(__dirname, '../../components');

function readComponent(name: string): string {
  return readFileSync(resolve(componentsDir, name), 'utf-8');
}

describe('focus-visible states on interactive elements', () => {
  describe('ServiceCards', () => {
    const src = readComponent('ServiceCards.astro');

    it('has :focus-visible for .services-list-item', () => {
      expect(src).toContain('.services-list-item:focus-visible');
    });

    it('has :focus-visible for .service-icon-card', () => {
      expect(src).toContain('.service-icon-card:focus-visible');
    });

    it('has :focus-visible for .service-compact-item', () => {
      expect(src).toContain('.service-compact-item:focus-visible');
    });
  });

  describe('Reviews', () => {
    const src = readComponent('Reviews.astro');

    it('has :focus-visible for .reviews-cta-btn', () => {
      expect(src).toContain('.reviews-cta-btn:focus-visible');
    });

    it('has :focus-visible for .reviews-count a', () => {
      expect(src).toContain('.reviews-count a:focus-visible');
    });
  });

  describe('PhotoGallery', () => {
    const src = readComponent('PhotoGallery.astro');

    it('has :focus-visible for .lightbox-close', () => {
      expect(src).toContain('.lightbox-close:focus-visible');
    });

    it('has :focus-visible for .lightbox-prev', () => {
      expect(src).toContain('.lightbox-prev:focus-visible');
    });

    it('has :focus-visible for .lightbox-next', () => {
      expect(src).toContain('.lightbox-next:focus-visible');
    });
  });

  describe('StickyHeader', () => {
    const src = readComponent('StickyHeader.astro');

    it('has :focus-visible for .header-brand', () => {
      expect(src).toContain('.header-brand:focus-visible');
    });

    it('has :focus-visible for .header-nav-link', () => {
      expect(src).toContain('.header-nav-link:focus-visible');
    });

    it('has :focus-visible for .mobile-nav-link', () => {
      expect(src).toContain('.mobile-nav-link:focus-visible');
    });

    it('has :focus-visible for .header-hamburger', () => {
      expect(src).toContain('.header-hamburger:focus-visible');
    });

    it('has :hover for .header-hamburger', () => {
      expect(src).toContain('.header-hamburger:hover');
    });

    it('has :focus-visible for .mobile-nav-cta', () => {
      expect(src).toContain('.mobile-nav-cta:focus-visible');
    });

    it('has :hover for .mobile-nav-cta', () => {
      expect(src).toContain('.mobile-nav-cta:hover');
    });
  });

  describe('StickyActionBar', () => {
    const src = readComponent('StickyActionBar.astro');

    it('has :focus-visible for .action-btn', () => {
      expect(src).toContain('.action-btn:focus-visible');
    });

    it('has :hover for .action-btn', () => {
      expect(src).toContain('.action-btn:hover');
    });

    it('uses negative outline-offset for action-btn (fixed bar)', () => {
      expect(src).toContain('outline-offset: -2px');
    });
  });

  describe('consistent pattern', () => {
    const allSrcs = [
      readComponent('ServiceCards.astro'),
      readComponent('Reviews.astro'),
      readComponent('PhotoGallery.astro'),
      readComponent('StickyHeader.astro'),
      readComponent('StickyActionBar.astro'),
    ];

    it('all components use outline: 2px solid var(--accent) for focus-visible', () => {
      for (const src of allSrcs) {
        expect(src).toContain('outline: 2px solid var(--accent)');
      }
    });
  });
});
