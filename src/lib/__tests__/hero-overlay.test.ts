import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const heroPath = resolve(__dirname, '../../components/Hero.astro');
const heroSrc = readFileSync(heroPath, 'utf-8');

describe('hero overlay text contrast', () => {
  it('overlay variant uses --hero-overlay-text custom property', () => {
    expect(heroSrc).toContain('--hero-overlay-text');
  });

  it('overlay variant uses --hero-overlay-heading custom property', () => {
    expect(heroSrc).toContain('--hero-overlay-heading');
  });

  it('overlay variant has text-shadow using --overlay-darkness', () => {
    // text-shadow should reference --overlay-darkness for adaptive contrast
    const overlaySection = heroSrc.substring(
      heroSrc.indexOf('.hero--overlay .hero-content'),
      heroSrc.indexOf('.hero--overlay .hero-content') + 300
    );
    expect(overlaySection).toContain('text-shadow');
    expect(overlaySection).toContain('--overlay-darkness');
  });

  it('video variant also uses overlay text tokens', () => {
    const videoContentIdx = heroSrc.indexOf('.hero--video .hero-content');
    expect(videoContentIdx).toBeGreaterThan(-1);
    const videoSection = heroSrc.substring(videoContentIdx, videoContentIdx + 300);
    expect(videoSection).toContain('--hero-overlay-text');
    expect(videoSection).toContain('text-shadow');
  });

  it('no hardcoded #f0eaec or #e0e0e0 in overlay/video sections', () => {
    // These specific hex codes should be replaced by custom property fallbacks
    // They can still appear as fallback values inside var(), but not as standalone color values
    const overlayStart = heroSrc.indexOf('.hero--overlay .hero-content');
    const videoEnd = heroSrc.indexOf('.hero--minimal', overlayStart);
    const overlayVideoSection = heroSrc.substring(overlayStart, videoEnd);

    // Check that hex colors only appear inside var() fallbacks, not as standalone
    const lines = overlayVideoSection.split('\n');
    for (const line of lines) {
      if (line.includes('#f0eaec') || line.includes('#e0e0e0') || line.includes('#d0d0d0')) {
        // These should only appear as var() fallbacks
        expect(line).toContain('var(--');
      }
    }
  });
});
