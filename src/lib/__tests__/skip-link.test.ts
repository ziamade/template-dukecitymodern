import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Integration-style: verify the skip link and main landmark exist in BaseLayout source
const baseLayoutPath = resolve(__dirname, '../../layouts/BaseLayout.astro');
const baseLayoutSrc = readFileSync(baseLayoutPath, 'utf-8');

const baseCssPath = resolve(__dirname, '../../styles/base.css');
const baseCssSrc = readFileSync(baseCssPath, 'utf-8');

describe('skip navigation link', () => {
  it('BaseLayout contains skip link targeting #main-content', () => {
    expect(baseLayoutSrc).toContain('href="#main-content"');
    expect(baseLayoutSrc).toContain('class="skip-link"');
    expect(baseLayoutSrc).toContain('Skip to main content');
  });

  it('BaseLayout contains main element with id="main-content"', () => {
    expect(baseLayoutSrc).toContain('id="main-content"');
    expect(baseLayoutSrc).toContain('<main');
  });

  it('skip link appears before main content in source order', () => {
    const skipIdx = baseLayoutSrc.indexOf('class="skip-link"');
    const mainIdx = baseLayoutSrc.indexOf('id="main-content"');
    expect(skipIdx).toBeGreaterThan(-1);
    expect(mainIdx).toBeGreaterThan(-1);
    expect(skipIdx).toBeLessThan(mainIdx);
  });

  it('base.css has skip-link styles with :focus state', () => {
    expect(baseCssSrc).toContain('.skip-link');
    expect(baseCssSrc).toContain('.skip-link:focus');
    expect(baseCssSrc).toContain('z-index: 10000');
  });
});
