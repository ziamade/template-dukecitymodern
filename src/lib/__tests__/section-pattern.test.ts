import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const tokensCssPath = resolve(__dirname, '../../styles/tokens.css');
const tokensCss = readFileSync(tokensCssPath, 'utf-8');

describe('section-pattern alternating CSS rules', () => {
  it('has [data-section-pattern="alternating"] rules', () => {
    expect(tokensCss).toContain('[data-section-pattern="alternating"]');
  });

  it('sets --surface background on even sections', () => {
    expect(tokensCss).toMatch(
      /\[data-section-pattern="alternating"\]\s+\.section:nth-child\(even\)\s*\{[^}]*background:\s*var\(--surface\)/
    );
  });

  it('sets --bg background on odd sections', () => {
    expect(tokensCss).toMatch(
      /\[data-section-pattern="alternating"\]\s+\.section:nth-child\(odd\)\s*\{[^}]*background:\s*var\(--bg/
    );
  });

  it('removes border-top for alternating pattern section siblings', () => {
    expect(tokensCss).toMatch(
      /\[data-section-pattern="alternating"\]\s+\.section\s*\+\s*\.section\s*\{[^}]*border-top:\s*none/
    );
  });

  it('removes box-shadow for alternating pattern section siblings', () => {
    expect(tokensCss).toMatch(
      /\[data-section-pattern="alternating"\]\s+\.section\s*\+\s*\.section\s*\{[^}]*box-shadow:\s*none/
    );
  });
});
