import { describe, it, expect } from 'vitest';
import {
  menu,
  team,
  cta,
  book,
  attributes,
  googleLinks,
} from '../lib/data';

/**
 * Issue #90: pipeline-conditional client-data files must not break the Astro
 * build when they're absent. Per the Pipeline Data Contract, the following
 * files are emitted only under specific conditions:
 *   - menu.json          — restaurants only
 *   - team.json          — team-led businesses only
 *   - cta.json           — authors only
 *   - book.json          — authors only
 *   - attributes.json    — Places v2 with attributes
 *   - google-links.json  — only written if links exist
 *   - verification.json  — verify-business skill / NM only (already loaded
 *                          via `import.meta.glob` in its consumer; not
 *                          surfaced through `src/lib/data.ts`).
 *
 * `src/lib/data.ts` loads each via `import.meta.glob` so the build succeeds
 * either way. These tests guard the public contract: regardless of whether
 * the source files exist, the exported constants always expose a safely-shaped
 * object so consumers (MenuSection / Team / CTASection / BookShowcase /
 * Reviews) keep rendering — or short-circuit cleanly — without crashing.
 *
 * The assertions below intentionally describe the *fallback shape* the
 * consumer expects when the file is absent. When the file IS present (as in
 * any fixture-backed test run), the validated/typed value strictly extends
 * the fallback, so each assertion still holds.
 */
describe('optional pipeline-conditional data exports', () => {
  it('menu always exposes a categories array', () => {
    expect(menu).toBeDefined();
    expect(Array.isArray(menu.categories)).toBe(true);
  });

  it('team always exposes an items array', () => {
    expect(team).toBeDefined();
    expect(Array.isArray(team.items)).toBe(true);
  });

  it('cta always exposes a defined object (consumer guards with truthy fields)', () => {
    expect(cta).toBeDefined();
    // CTASection.astro destructures { text, buttonText, buttonHref, enabled }
    // and renders nothing when any are falsy — so undefined / empty string
    // values are an acceptable fallback shape, but the object itself must
    // exist so the destructure does not throw.
    expect(typeof cta).toBe('object');
    expect(cta).not.toBeNull();
  });

  it('book always exposes a defined object (consumer guards with title + cover/description)', () => {
    expect(book).toBeDefined();
    expect(typeof book).toBe('object');
    expect(book).not.toBeNull();
    // BookShowcase.astro reads book?.title etc. and only renders when
    // hasBook = !!(title && (coverImage || description)). Optional access
    // means an empty-shape fallback is sufficient.
  });

  it('attributes always exposes a defined object', () => {
    expect(attributes).toBeDefined();
    expect(typeof attributes).toBe('object');
    expect(attributes).not.toBeNull();
  });

  it('googleLinks always exposes a defined object (consumer uses optional chaining)', () => {
    expect(googleLinks).toBeDefined();
    expect(typeof googleLinks).toBe('object');
    expect(googleLinks).not.toBeNull();
    // Reviews.astro reads googleLinks?.allReviews, so undefined fields are fine.
  });
});
