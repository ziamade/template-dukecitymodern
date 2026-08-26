import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { generateLayoutCSS } from '../lib/brand';

const TOKENS = readFileSync(
  resolve(import.meta.dirname, '../styles/tokens.css'),
  'utf8',
);

describe('generateLayoutCSS cascade', () => {
  it('emits a doubled :root selector so it outranks tokens.css defaults', () => {
    const css = generateLayoutCSS({ cardRadius: 'round' });
    expect(css.startsWith(':root:root {')).toBe(true);
  });

  it('returns empty string when no recognized tokens are set', () => {
    expect(generateLayoutCSS({})).toBe('');
    expect(generateLayoutCSS(undefined)).toBe('');
    expect(generateLayoutCSS({ cardRadius: 'not-a-real-value' })).toBe('');
  });

  // Regression guard for the silent-no-op bug: every var this function can emit
  // also has a plain `:root` default in tokens.css. Astro orders the bundled
  // stylesheet after the inline <style>, so equal specificity meant tokens.css
  // always won. If someone reverts the selector, this fails.
  it.each([
    ['cardRadius', 'round', '--card-radius'],
    ['buttonStyle', 'pill', '--btn-radius'],
    ['imageStyle', 'rounded', '--img-radius'],
    ['shadowStyle', 'dramatic', '--shadow-card'],
    ['overlayDarkness', 'heavy', '--overlay-darkness'],
  ])('%s emits %s at higher specificity than the tokens.css default', (key, value, cssVar) => {
    const css = generateLayoutCSS({ [key]: value });
    expect(css).toContain(cssVar);
    // Confirm the collision this test exists to protect against is real.
    expect(TOKENS).toContain(`${cssVar}:`);
    expect(css.split('\n')[0]).toBe(':root:root {');
  });

  it('overlayDarkness heavy resolves to 0.7, not the 0.5 default', () => {
    expect(generateLayoutCSS({ overlayDarkness: 'heavy' })).toContain('--overlay-darkness: 0.7');
  });
});
