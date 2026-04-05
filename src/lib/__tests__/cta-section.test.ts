import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ctaPath = resolve(__dirname, '../../components/CTASection.astro');
const ctaSrc = readFileSync(ctaPath, 'utf-8');

describe('CTASection component', () => {
  it('has data-variant attribute on the section element', () => {
    expect(ctaSrc).toContain('data-variant={variant}');
  });

  it('scoped CSS contains [data-variant="dark"] rules', () => {
    expect(ctaSrc).toContain('[data-variant="dark"]');
  });

  it('dark variant uses section-pad custom property for padding', () => {
    expect(ctaSrc).toContain('var(--section-pad,');
  });

  it('dark variant has larger button padding', () => {
    // Default button uses 0.625rem 1.5rem; dark variant should use 1rem 2.5rem
    expect(ctaSrc).toContain('padding: 1rem 2.5rem');
  });

  it('dark variant uses color-mix dark background', () => {
    expect(ctaSrc).toContain('color-mix(in oklch, var(--bg) 90%, black)');
  });

  it('dark variant uses light surface text color', () => {
    expect(ctaSrc).toContain('color: var(--surface)');
  });

  it('dark variant button uses accent background', () => {
    expect(ctaSrc).toContain('background: var(--accent)');
  });

  it('dark variant button hover uses shadow-glow', () => {
    expect(ctaSrc).toContain('var(--shadow-glow)');
  });

  it('dark variant text uses title-size custom property', () => {
    expect(ctaSrc).toContain('var(--title-size,');
  });

  it('dark variant text has max-width of 40ch', () => {
    expect(ctaSrc).toContain('max-width: 40ch');
  });
});
