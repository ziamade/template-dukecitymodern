import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Integration-style: verify the skip link and main landmark exist in source
const baseLayoutPath = resolve(__dirname, '../../layouts/BaseLayout.astro');
const baseLayoutSrc = readFileSync(baseLayoutPath, 'utf-8');

const indexPath = resolve(__dirname, '../../pages/index.astro');
const indexSrc = readFileSync(indexPath, 'utf-8');

const baseCssPath = resolve(__dirname, '../../styles/base.css');
const baseCssSrc = readFileSync(baseCssPath, 'utf-8');

describe('skip navigation link', () => {
  it('BaseLayout contains skip link targeting #main-content', () => {
    expect(baseLayoutSrc).toContain('href="#main-content"');
    expect(baseLayoutSrc).toContain('class="skip-link"');
    expect(baseLayoutSrc).toContain('Skip to main content');
  });

  it('index.astro wraps section content in main landmark', () => {
    expect(indexSrc).toContain('id="main-content"');
    expect(indexSrc).toContain('<main');
  });

  it('main landmark does not wrap header or footer', () => {
    const mainOpenIdx = indexSrc.indexOf('<main');
    const mainCloseIdx = indexSrc.indexOf('</main>');
    const footerIdx = indexSrc.indexOf('<Footer');
    const headerIdx = indexSrc.indexOf('<StickyHeader');
    // Header should be before <main>, footer should be after </main>
    expect(headerIdx).toBeLessThan(mainOpenIdx);
    expect(footerIdx).toBeGreaterThan(mainCloseIdx);
  });

  it('base.css has skip-link styles with :focus state and outline', () => {
    expect(baseCssSrc).toContain('.skip-link');
    expect(baseCssSrc).toContain('.skip-link:focus');
    expect(baseCssSrc).toContain('z-index: 10000');
    expect(baseCssSrc).toContain('outline:');
  });
});
