import { describe, it, expect } from 'vitest';
import { getFontEntry, buildFontFaceCSS } from '../fonts';
import type { Brand } from '../types';

describe('getFontEntry', () => {
  it('returns entry for a registered Google variable font', () => {
    const entry = getFontEntry('Source Sans 3');
    expect(entry).toBeDefined();
    expect(entry!.fallback).toBe('sans-serif');
    expect(entry!.files).toHaveLength(1);
    expect(entry!.files[0].weight).toBe('200 900');
  });

  it('returns entry for a static font with multiple weights', () => {
    const entry = getFontEntry('Barlow Condensed');
    expect(entry).toBeDefined();
    expect(entry!.files).toHaveLength(3);
    expect(entry!.files.map(f => f.weight)).toEqual(['400', '600', '700']);
  });

  it('returns entry for a Fontshare variable font', () => {
    const entry = getFontEntry('Clash Display');
    expect(entry).toBeDefined();
    expect(entry!.files[0].path).toContain('clash-display');
  });

  it('returns entry for legacy fonts with empty files', () => {
    const entry = getFontEntry('Oswald');
    expect(entry).toBeDefined();
    expect(entry!.files).toHaveLength(0);
    expect(entry!.fallback).toBe('sans-serif');
  });

  it('returns undefined for unregistered fonts', () => {
    expect(getFontEntry('Comic Sans MS')).toBeUndefined();
  });

  it('has correct fallback categories for serif fonts', () => {
    for (const name of ['Fraunces', 'Lora', 'Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Zodiak', 'Boska', 'Gambetta']) {
      expect(getFontEntry(name)?.fallback).toBe('serif');
    }
  });

  it('has correct fallback for cursive fonts', () => {
    for (const name of ['Caveat', 'Pacifico', 'Sacramento', 'Permanent Marker']) {
      expect(getFontEntry(name)?.fallback).toBe('cursive');
    }
  });

  it('all files use woff2 format', () => {
    const allFonts = [
      'Source Sans 3', 'Teko', 'Hanken Grotesk', 'Bricolage Grotesque',
      'Barlow Condensed', 'Instrument Serif', 'Clash Display', 'Satoshi',
    ];
    for (const name of allFonts) {
      const entry = getFontEntry(name)!;
      for (const file of entry.files) {
        expect(file.path).toMatch(/\.woff2$/);
      }
    }
  });
});

describe('buildFontFaceCSS', () => {
  const makeBrand = (nameFont: string, headingFont: string, bodyFont: string) =>
    ({ nameFont, headingFont, bodyFont }) as Brand;

  it('generates @font-face for all three brand fonts', () => {
    const css = buildFontFaceCSS(makeBrand('Clash Display', 'Satoshi', 'General Sans'));
    expect(css).toContain("font-family: 'Clash Display'");
    expect(css).toContain("font-family: 'Satoshi'");
    expect(css).toContain("font-family: 'General Sans'");
  });

  it('deduplicates when nameFont === headingFont', () => {
    const css = buildFontFaceCSS(makeBrand('Satoshi', 'Satoshi', 'General Sans'));
    const matches = css.match(/font-family: 'Satoshi'/g);
    expect(matches).toHaveLength(1);
  });

  it('deduplicates when all three fonts are the same', () => {
    const css = buildFontFaceCSS(makeBrand('Satoshi', 'Satoshi', 'Satoshi'));
    const matches = css.match(/font-family: 'Satoshi'/g);
    expect(matches).toHaveLength(1);
  });

  it('generates multiple @font-face blocks for static fonts with multiple weights', () => {
    const css = buildFontFaceCSS(makeBrand('Barlow Condensed', 'Bebas Neue', 'Source Sans 3'));
    const barlowBlocks = css.match(/@font-face\s*\{[^}]*Barlow Condensed[^}]*\}/g);
    expect(barlowBlocks).toHaveLength(3); // 400, 600, 700
  });

  it('skips legacy fonts with no files', () => {
    const css = buildFontFaceCSS(makeBrand('Oswald', 'Roboto Slab', 'Inter'));
    expect(css).toBe('');
  });

  it('includes font-display: swap', () => {
    const css = buildFontFaceCSS(makeBrand('Satoshi', 'Clash Display', 'General Sans'));
    expect(css).toContain('font-display: swap');
  });

  it('includes format woff2', () => {
    const css = buildFontFaceCSS(makeBrand('Satoshi', 'Clash Display', 'General Sans'));
    expect(css).toContain("format('woff2')");
  });

  it('handles mix of self-hosted and legacy fonts', () => {
    const css = buildFontFaceCSS(makeBrand('Oswald', 'Clash Display', 'Inter'));
    expect(css).toContain("font-family: 'Clash Display'");
    expect(css).not.toContain('Oswald');
    expect(css).not.toContain('Inter');
  });
});
