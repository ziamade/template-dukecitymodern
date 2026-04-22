import { describe, it, expect } from 'vitest';
import { generateThemeCSS } from '../brand';

/**
 * Foundation token layer tests.
 *
 * Cover the three brand knobs introduced for the foundations polish wave:
 *   - brand.typography.baseSize — scalar override for --text-base
 *   - brand.spacing.density     — "compact" | "comfortable" | "airy"
 *   - brand.radius.style        — "sharp" | "rounded" | "soft"
 *
 * Contract: all three are optional. When omitted, the generated CSS must
 * not emit any related override (backward compat with existing client
 * repos — the defaults live in tokens.css).
 */

const basePalette = {
  bg: '#0a0a0a',
  surface: '#141414',
  surfaceAlt: '#1a1a1a',
  text: '#f5f5f5',
  textMuted: '#999999',
  accent: '#e8a87c',
};

const baseBrand = {
  palette: basePalette,
  nameFont: 'Inter',
  headingFont: 'Inter',
  bodyFont: 'Inter',
} as any;

describe('generateThemeCSS — brand knobs', () => {
  it('omits typography override when typography.baseSize absent', () => {
    const css = generateThemeCSS(baseBrand);
    expect(css).not.toContain('--text-base:');
  });

  it('emits --text-base override when typography.baseSize is set', () => {
    const css = generateThemeCSS({ ...baseBrand, typography: { baseSize: '1.0625rem' } });
    expect(css).toContain('--text-base: 1.0625rem');
  });

  it('css-sanitizes typography.baseSize', () => {
    // Should strip dangerous chars that could break out of the CSS value context.
    // Known-bad payload: '1rem;evil{}' — the `;`, `{`, and `}` escape chars must
    // be stripped so the final line reads `--text-base: 1remevil;` rather than
    // `--text-base: 1rem;evil{};`.
    const css = generateThemeCSS({ ...baseBrand, typography: { baseSize: '1rem;evil{}' } });
    expect(css).toMatch(/--text-base: 1remevil;/);
    // And importantly: no injection escape payload survives on the value line.
    expect(css).not.toMatch(/--text-base:[^;]*;evil/);
  });

  it('omits spacing override when spacing.density absent', () => {
    const css = generateThemeCSS(baseBrand);
    expect(css).not.toContain('--density-multiplier');
  });

  it('emits density=comfortable (1.0) explicitly when spacing.density is "comfortable"', () => {
    const css = generateThemeCSS({ ...baseBrand, spacing: { density: 'comfortable' } });
    expect(css).toContain('--density-multiplier: 1');
  });

  it('emits density=compact (0.85)', () => {
    const css = generateThemeCSS({ ...baseBrand, spacing: { density: 'compact' } });
    expect(css).toContain('--density-multiplier: 0.85');
  });

  it('emits density=airy (1.15)', () => {
    const css = generateThemeCSS({ ...baseBrand, spacing: { density: 'airy' } });
    expect(css).toContain('--density-multiplier: 1.15');
  });

  it('ignores unknown density value (backward-compat for forward-invalid knobs)', () => {
    const css = generateThemeCSS({ ...baseBrand, spacing: { density: 'nonsense' as any } });
    expect(css).not.toContain('--density-multiplier');
  });

  it('omits radius override when radius.style absent', () => {
    const css = generateThemeCSS(baseBrand);
    // None of the radius token overrides should appear
    expect(css).not.toMatch(/--radius-sm:\s*\d/);
    expect(css).not.toMatch(/--radius-md:\s*\d/);
    expect(css).not.toMatch(/--radius-lg:\s*\d/);
  });

  it('emits sharp radius scale', () => {
    const css = generateThemeCSS({ ...baseBrand, radius: { style: 'sharp' } });
    expect(css).toContain('--radius-sm: 0');
    expect(css).toContain('--radius-md: 2px');
    expect(css).toContain('--radius-lg: 4px');
    expect(css).toContain('--radius-pill: 9999px');
  });

  it('emits rounded radius scale (explicit default)', () => {
    const css = generateThemeCSS({ ...baseBrand, radius: { style: 'rounded' } });
    expect(css).toContain('--radius-sm: 0.25rem');
    expect(css).toContain('--radius-md: 0.5rem');
    expect(css).toContain('--radius-lg: 1rem');
    expect(css).toContain('--radius-pill: 9999px');
  });

  it('emits soft radius scale', () => {
    const css = generateThemeCSS({ ...baseBrand, radius: { style: 'soft' } });
    expect(css).toContain('--radius-sm: 0.5rem');
    expect(css).toContain('--radius-md: 1rem');
    expect(css).toContain('--radius-lg: 1.5rem');
    expect(css).toContain('--radius-pill: 9999px');
  });

  it('supports all three knobs simultaneously', () => {
    const css = generateThemeCSS({
      ...baseBrand,
      typography: { baseSize: '1.125rem' },
      spacing: { density: 'airy' },
      radius: { style: 'soft' },
    });
    expect(css).toContain('--text-base: 1.125rem');
    expect(css).toContain('--density-multiplier: 1.15');
    expect(css).toContain('--radius-sm: 0.5rem');
  });
});
