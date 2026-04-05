import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const aboutPath = resolve(__dirname, '../../components/AboutMap.astro');
const aboutSrc = readFileSync(aboutPath, 'utf-8');

describe('AboutMap component', () => {
  it('.about-text-content has max-width: 65ch', () => {
    expect(aboutSrc).toContain('max-width: 65ch');
  });

  it('scoped CSS contains .about-placeholder class', () => {
    expect(aboutSrc).toContain('.about-placeholder');
  });

  it('placeholder has border-radius: 50%', () => {
    expect(aboutSrc).toContain('border-radius: 50%');
  });

  it('placeholder background gradient uses var(--accent)', () => {
    expect(aboutSrc).toContain('var(--accent)');
  });

  it('template has conditional rendering for about-placeholder', () => {
    expect(aboutSrc).toContain('about-placeholder');
    expect(aboutSrc).toContain('!aboutImage && !logoUrl');
  });
});
