import { describe, it, expect } from 'vitest';
import { paletteToCSS } from '../brand';

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

  it('includes all core palette vars', () => {
    const css = paletteToCSS(darkPalette as any);
    expect(css).toContain('--bg:');
    expect(css).toContain('--surface:');
    expect(css).toContain('--accent:');
    expect(css).toContain('--text:');
  });
});
