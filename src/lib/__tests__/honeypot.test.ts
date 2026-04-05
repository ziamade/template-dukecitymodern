import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const quoteFormPath = resolve(__dirname, '../../components/QuoteForm.astro');
const quoteFormSrc = readFileSync(quoteFormPath, 'utf-8');

describe('QuoteForm honeypot accessibility', () => {
  it('honeypot container has aria-hidden="true"', () => {
    // Find the honeypot section
    const honeypotIdx = quoteFormSrc.indexOf('name="website"');
    expect(honeypotIdx).toBeGreaterThan(-1);
    // The parent div should have aria-hidden
    const regionBefore = quoteFormSrc.substring(Math.max(0, honeypotIdx - 200), honeypotIdx);
    expect(regionBefore).toContain('aria-hidden="true"');
  });

  it('honeypot input has tabindex="-1"', () => {
    const match = quoteFormSrc.match(/name="website"[^>]*/);
    expect(match).not.toBeNull();
    expect(match![0]).toContain('tabindex="-1"');
  });

  it('honeypot uses height:0 hiding instead of left:-9999px', () => {
    const honeypotIdx = quoteFormSrc.indexOf('name="website"');
    const regionBefore = quoteFormSrc.substring(Math.max(0, honeypotIdx - 200), honeypotIdx);
    expect(regionBefore).toContain('height:0');
    expect(regionBefore).toContain('overflow:hidden');
    expect(regionBefore).not.toContain('left:-9999px');
  });

  it('honeypot has a label element', () => {
    const honeypotIdx = quoteFormSrc.indexOf('name="website"');
    const regionBefore = quoteFormSrc.substring(Math.max(0, honeypotIdx - 200), honeypotIdx);
    expect(regionBefore).toContain('<label');
    expect(regionBefore).toContain('for="website"');
  });
});
