import { describe, it, expect } from 'vitest';
import { menuSchema } from '../lib/schemas';

const CATEGORIES = [{ name: 'Classes', items: [{ name: 'Drop-in', price: '$15' }] }];

describe('menuSchema copy overrides', () => {
  it('parses a restaurant menu with no overrides', () => {
    const parsed = menuSchema.parse({ categories: CATEGORIES });
    expect(parsed.heading).toBeUndefined();
    expect(parsed.cta).toBeUndefined();
    expect(parsed.categories).toHaveLength(1);
  });

  it('accepts heading, eyebrow and note overrides', () => {
    const parsed = menuSchema.parse({
      categories: CATEGORIES,
      heading: 'Classes & Pricing',
      eyebrow: 'What it costs',
      note: 'Classes are paid per calendar month.',
    });
    expect(parsed.heading).toBe('Classes & Pricing');
    expect(parsed.eyebrow).toBe('What it costs');
    expect(parsed.note).toBe('Classes are paid per calendar month.');
  });

  it('accepts a cta override that replaces the Order Online default', () => {
    const parsed = menuSchema.parse({
      categories: CATEGORIES,
      cta: { text: 'Sign the Waiver', href: 'https://example.com/w', note: 'Saves time at the door.' },
    });
    expect(parsed.cta).toEqual({
      text: 'Sign the Waiver',
      href: 'https://example.com/w',
      note: 'Saves time at the door.',
    });
  });

  it('rejects a non-string heading rather than silently dropping it', () => {
    expect(() => menuSchema.parse({ categories: CATEGORIES, heading: 42 })).toThrow();
  });
});
