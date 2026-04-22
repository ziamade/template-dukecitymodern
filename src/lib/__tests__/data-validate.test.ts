import { describe, it, expect } from 'vitest';
import { z } from 'astro/zod';
import { validate } from '../data-validate';

/**
 * Regression test for platform#649.
 *
 * Template-side zod validation used to log a warning and silently fall
 * back to raw data when a pipeline-produced file failed its schema.
 * This let the 2026-04-22 shakeout ship 9 separate data-contract gaps
 * with no visual signal. The build MUST now throw loudly so the
 * pipeline sees a non-zero exit and the site never deploys.
 */
describe('validate (platform#649)', () => {
  const minimalSchema = z.object({
    heroImage: z.string(),
    heroTagline: z.string(),
  });

  it('returns parsed data when input matches the schema', () => {
    const raw = { heroImage: '/x.jpg', heroTagline: 'hello' };
    const out = validate(minimalSchema, raw, 'hero.json');
    expect(out).toEqual(raw);
  });

  it('throws when a required field is missing (no silent fallback)', () => {
    const raw = { heroImage: '/x.jpg' }; // missing heroTagline
    expect(() => validate(minimalSchema, raw, 'hero.json')).toThrow();
  });

  it('throws when a field has the wrong type', () => {
    const raw = { heroImage: 123, heroTagline: 'hello' };
    expect(() => validate(minimalSchema, raw, 'hero.json')).toThrow();
  });

  it('error message names the failing file so operators can find it', () => {
    const raw = { heroImage: '/x.jpg' };
    expect(() => validate(minimalSchema, raw, 'hero.json')).toThrow(/hero\.json/);
  });

  it('error message includes at least one issue path so the bad field is identifiable', () => {
    const raw = { heroImage: '/x.jpg' }; // missing heroTagline
    try {
      validate(minimalSchema, raw, 'hero.json');
      throw new Error('expected validate() to throw');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      expect(message).toMatch(/heroTagline/);
    }
  });
});
