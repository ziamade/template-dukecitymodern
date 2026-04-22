import { describe, it, expect } from 'vitest';
import { hoursSchema } from '../schemas';

/**
 * Regression test for platform#649 round 2.
 *
 * The pipeline's template-side hours normalizer (`normalizeHours()` in
 * `src/lib/hours-parser.ts`) always sets `secondaryHours` to either a
 * `Record<string, unknown>` or an explicit `null`, never `undefined`.
 * Meanwhile, `build-from-fixture.ts` in the pipeline package only writes
 * the `secondaryHours` key to `hours.json` when the business actually has
 * delivery/takeout hours. For the 3 fixture builds (pwtint, martinezwelding,
 * dcdrentals) the key is absent, `normalizeHours()` fills in `null`, and the
 * schema used to reject that because `secondaryHours` was `.optional()` only
 * (accepts `undefined`, not `null`). Result: every CI fixture build failed
 * with `expected record, received null`.
 *
 * Contract: per the root CLAUDE.md "Pipeline Data Contract", `secondaryHours`
 * is "delivery/takeout if available" — nullable by design. Widening from
 * `.optional()` to `.nullable().optional()` aligns the schema with the
 * documented contract.
 */
describe('hoursSchema.secondaryHours (platform#649 round 2)', () => {
  const baseDay = { day: 'Monday', open: '9:00 AM', close: '5:00 PM' };

  it('accepts a record of secondary hours (restaurant with delivery)', () => {
    const input = {
      days: [baseDay],
      secondaryHours: { delivery: ['Mon: 5 PM – 9 PM'] },
    };
    const out = hoursSchema.parse(input);
    expect(out.secondaryHours).toEqual({ delivery: ['Mon: 5 PM – 9 PM'] });
  });

  it('accepts secondaryHours omitted entirely', () => {
    const input = { days: [baseDay] };
    const out = hoursSchema.parse(input);
    expect(out.secondaryHours).toBeUndefined();
  });

  it('accepts secondaryHours: null (post-normalizeHours with no secondary data)', () => {
    // This is the exact shape that killed CI on PR #94 round 1.
    const input = { days: [baseDay], secondaryHours: null };
    expect(() => hoursSchema.parse(input)).not.toThrow();
  });

  it('accepts secondaryHours: {} (empty record — shipped fixture shape)', () => {
    // src/data/hours.json on master currently ships with `"secondaryHours": {}`.
    const input = { days: [baseDay], secondaryHours: {} };
    const out = hoursSchema.parse(input);
    expect(out.secondaryHours).toEqual({});
  });

  it('rejects secondaryHours that is neither record nor null nor undefined', () => {
    const input = { days: [baseDay], secondaryHours: 'open 24 hours' };
    expect(() => hoursSchema.parse(input)).toThrow();
  });
});
