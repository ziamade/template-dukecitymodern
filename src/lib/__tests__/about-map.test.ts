import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const aboutPath = resolve(__dirname, '../../components/AboutMap.astro');
const aboutSrc = readFileSync(aboutPath, 'utf-8');

describe('AboutMap component', () => {
  it('.about-text-content has max-width: 65ch', () => {
    expect(aboutSrc).toContain('max-width: 65ch');
  });

  it('scoped CSS contains .about-placeholder class', () => {
    expect(aboutSrc).toContain('.about-placeholder');
  });

  it('placeholder has border-radius: 50%', () => {
    expect(aboutSrc).toContain('border-radius: 50%');
  });

  it('placeholder background gradient uses var(--accent)', () => {
    expect(aboutSrc).toContain('var(--accent)');
  });

  it('template has conditional rendering for about-placeholder', () => {
    expect(aboutSrc).toContain('about-placeholder');
    expect(aboutSrc).toContain('!aboutImage && !logoUrl');
  });

  /**
   * Regression tests for platform#681 / template#99.
   *
   * Platform PR #688 populates `about.image` with a curated "about hero"
   * photo (people / job-site shots, never the hero photo). The About
   * component must render that image when present and fall back to the
   * logo when absent. Pre-#688 client sites have no `about.image`, so
   * the logo fallback is what keeps them visually identical.
   */
  describe('about.image consumer (platform#681)', () => {
    it('reads about.image from the data module', () => {
      expect(aboutSrc).toContain("const aboutImage = about.image || '';");
    });

    it('renders the about-portrait block when aboutImage is present', () => {
      expect(aboutSrc).toContain('{aboutImage && (');
      expect(aboutSrc).toContain('class="about-portrait"');
      expect(aboutSrc).toContain('src={aboutImage}');
    });

    it('falls back to logo only when aboutImage is absent', () => {
      // The fallback branch must gate on `!aboutImage` so existing sites
      // without the new field still render the brand logo placeholder.
      expect(aboutSrc).toContain('{!aboutImage && logoUrl && (');
      expect(aboutSrc).toContain('class="about-logo"');
    });

    it('keeps the initials placeholder when neither image nor logo exist', () => {
      // Pre-existing fallback chain stays intact: about.image → logo →
      // initials placeholder. Track A canonical aboutSchema allows image
      // to be absent, so this chain must hold.
      expect(aboutSrc).toContain('!aboutImage && !logoUrl');
      expect(aboutSrc).toContain('about-placeholder-initials');
    });
  });
});
