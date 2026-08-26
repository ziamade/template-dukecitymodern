import { describe, it, expect } from 'vitest';
import { themeSchema } from '../lib/schemas';

describe('theme.layout.logoOnly', () => {
  it('parses when present', () => {
    const parsed = themeSchema.parse({ layout: { logoOnly: true } });
    expect(parsed.layout?.logoOnly).toBe(true);
  });

  it('is optional — existing themes without it still parse', () => {
    const parsed = themeSchema.parse({ layout: { logoSize: 'lg' } });
    expect(parsed.layout?.logoOnly).toBeUndefined();
  });

  it('rejects a non-boolean rather than coercing a truthy string', () => {
    expect(() => themeSchema.parse({ layout: { logoOnly: 'yes' } })).toThrow();
  });
});

describe('theme.sectionCopy', () => {
  it('parses per-section heading and eyebrow overrides', () => {
    const parsed = themeSchema.parse({
      sectionCopy: { services: { heading: 'Classes & Programs', eyebrow: 'What we offer' } },
    });
    expect(parsed.sectionCopy?.services.heading).toBe('Classes & Programs');
    expect(parsed.sectionCopy?.services.eyebrow).toBe('What we offer');
  });

  it('is optional', () => {
    expect(themeSchema.parse({}).sectionCopy).toBeUndefined();
  });

  it('rejects a non-string heading', () => {
    expect(() => themeSchema.parse({ sectionCopy: { services: { heading: 7 } } })).toThrow();
  });
});
