import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const galleryPath = resolve(__dirname, '../../components/PhotoGallery.astro');
const gallerySrc = readFileSync(galleryPath, 'utf-8');

describe('PhotoGallery lightbox accessibility', () => {
  it('lightbox has role="dialog" and aria-label', () => {
    expect(gallerySrc).toContain('role="dialog"');
    expect(gallerySrc).toContain('aria-label="Image lightbox"');
  });

  it('lightbox has aria-live announcer element', () => {
    expect(gallerySrc).toContain('aria-live="polite"');
    expect(gallerySrc).toContain('id="lightbox-announcer"');
  });

  it('announcer has sr-only class for visual hiding', () => {
    expect(gallerySrc).toContain('class="sr-only"');
    // Verify sr-only styles exist in the component
    expect(gallerySrc).toContain('.sr-only');
    expect(gallerySrc).toContain('clip: rect(0, 0, 0, 0)');
  });

  it('script updates announcer with image position', () => {
    // The script should contain logic to announce "Image X of Y"
    expect(gallerySrc).toContain('lightbox-announcer');
    expect(gallerySrc).toContain('Image ${index + 1} of ${items.length}');
  });

  it('lightbox has focus trap implementation', () => {
    // Verify focus trap exists (Tab key handling)
    expect(gallerySrc).toContain("e.key === 'Tab'");
    expect(gallerySrc).toContain('e.preventDefault()');
  });
});
