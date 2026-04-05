import { describe, it, expect } from 'vitest';
import { paletteToCSS, getContrastRatio } from '../brand';

// Minimal palettes for testing glass surface detection.
// These satisfy the ColorPalette shape from schemas.ts.

const darkPalette = {
  bg: '#0a0a0a',
  surface: '#141414',
  surfaceAlt: '#1a1a1a',
  text: '#f5f5f5',
  textMuted: '#999999',
  accent: '#e8a87c',
  accentDim: '#b8845e',
  accentGlow: '#e8a87c',
  border: '#2a2a2a',
};

const lightPalette = {
  bg: '#ffffff',
  surface: '#f5f5f5',
  surfaceAlt: '#eeeeee',
  text: '#1a1a1a',
  textMuted: '#666666',
  accent: '#2563eb',
  accentDim: '#1d4ed8',
  accentGlow: '#3b82f6',
  border: '#e5e5e5',
};

const creamPalette = {
  bg: '#faf5ef',
  surface: '#f0ebe3',
  surfaceAlt: '#e8e0d5',
  text: '#2c2419',
  textMuted: '#7a6e5e',
  accent: '#b07d3a',
  accentDim: '#8d6430',
  accentGlow: '#c9933f',
  border: '#d4c9b8',
};

const midGrayPalette = {
  bg: '#3a3a3a',
  surface: '#4a4a4a',
  surfaceAlt: '#555555',
  text: '#f0f0f0',
  textMuted: '#aaaaaa',
  accent: '#ff6b35',
  accentDim: '#cc5529',
  accentGlow: '#ff8c5a',
  border: '#5a5a5a',
};

describe('paletteToCSS', () => {
  it('uses white-based glass for dark palettes', () => {
    const css = paletteToCSS(darkPalette as any);
    expect(css).toContain('--surface-glass: rgba(255, 255, 255, 0.03)');
    expect(css).toContain('--surface-glass-hover: rgba(255, 255, 255, 0.06)');
  });

  it('uses black-based glass for light palettes', () => {
    const css = paletteToCSS(lightPalette as any);
    expect(css).toContain('--surface-glass: rgba(0, 0, 0, 0.03)');
    expect(css).toContain('--surface-glass-hover: rgba(0, 0, 0, 0.06)');
  });

  it('uses black-based glass for cream/warm light palettes', () => {
    const css = paletteToCSS(creamPalette as any);
    expect(css).toContain('--surface-glass: rgba(0, 0, 0, 0.03)');
  });

  it('uses white-based glass for mid-gray dark palettes', () => {
    const css = paletteToCSS(midGrayPalette as any);
    expect(css).toContain('--surface-glass: rgba(255, 255, 255, 0.03)');
  });

  it('uses black-based glass for 3-digit light hex bg', () => {
    const css = paletteToCSS({ ...lightPalette, bg: '#fff' } as any);
    expect(css).toContain('--surface-glass: rgba(0, 0, 0, 0.03)');
  });

  it('uses white-based glass for non-hex bg (defaults to dark)', () => {
    const css = paletteToCSS({ ...darkPalette, bg: 'rgb(255,255,255)' } as any);
    expect(css).toContain('--surface-glass: rgba(255, 255, 255, 0.03)');
  });

  it('includes all core palette vars', () => {
    const css = paletteToCSS(darkPalette as any);
    expect(css).toContain('--bg:');
    expect(css).toContain('--surface:');
    expect(css).toContain('--accent:');
    expect(css).toContain('--text:');
  });
});

describe('getContrastRatio', () => {
  it('returns 21:1 for black on white', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('returns 1:1 for same color', () => {
    const ratio = getContrastRatio('#ff0000', '#ff0000');
    expect(ratio).toBeCloseTo(1, 1);
  });

  it('correctly computes mid-range contrast', () => {
    // #e8a87c (warm accent) on #0a0a0a (dark bg) — high contrast
    const ratio = getContrastRatio('#e8a87c', '#0a0a0a');
    expect(ratio).toBeGreaterThan(4.5);
  });

  it('detects low contrast', () => {
    // #333333 on #222222 — very low contrast
    const ratio = getContrastRatio('#333333', '#222222');
    expect(ratio).toBeLessThan(4.5);
  });
});
