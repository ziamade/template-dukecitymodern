import { describe, it, expect } from 'vitest';
import { menu, team } from '../lib/data';

/**
 * Issue #90: menu.json and team.json are optional client-data files.
 * Non-restaurant fixtures (pwtint, martinezwelding) ship without menu.json;
 * non-team fixtures (dcdrentals) ship without team.json.
 *
 * `src/lib/data.ts` loads them via `import.meta.glob` so the build succeeds
 * either way. These tests guard the public contract: regardless of whether
 * the source files exist, the exported `menu` and `team` constants always
 * expose a safely-shaped object so consumers (MenuSection, Team) keep working.
 */
describe('optional menu + team data exports', () => {
  it('menu always exposes a categories array', () => {
    expect(menu).toBeDefined();
    expect(Array.isArray(menu.categories)).toBe(true);
  });

  it('team always exposes an items array', () => {
    expect(team).toBeDefined();
    expect(Array.isArray(team.items)).toBe(true);
  });
});
