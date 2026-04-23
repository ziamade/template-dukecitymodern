import { describe, it, expect } from 'vitest';
import { contactSchema, hoursSchema } from '../schemas';

/**
 * Regression test for platform#675.
 *
 * After #94 (fail-loud zod) + #95 (canonical shared contact schema),
 * the template's contactSchema must accept the pipeline's email-less
 * emit shape. Most ABQ trade businesses (Quality Electric LLC and
 * similar) don't list a public email. `compile-step/contact-json.ts`
 * builds `{ phone, phoneForTel }` with the email key OMITTED (not
 * written as null or empty string) when the business has no email.
 *
 * The canonical ContactSchema in packages/shared/src/data-contracts/
 * contact.ts already declares `email: z.string().optional()`, so this
 * test locks in the behavior so a future "tighten email" refactor
 * can't break trades builds.
 */
describe('contactSchema (platform#675)', () => {
  it('accepts the pipeline email-less emit shape (Quality Electric LLC)', () => {
    // Exact shape emitted by compile-step/contact-json.ts when
    // p.contact.email is falsy — email key omitted entirely.
    const input = { phone: '(505) 699-9746', phoneForTel: '5056999746' };
    const out = contactSchema.parse(input);
    expect(out.phone).toBe('(505) 699-9746');
    expect(out.phoneForTel).toBe('5056999746');
    expect(out.email).toBeUndefined();
  });

  it('accepts email when the business has one (fixture emit shape)', () => {
    const input = {
      phone: '(505) 555-0100',
      phoneForTel: '5055550100',
      email: 'info@example.com',
    };
    const out = contactSchema.parse(input);
    expect(out.email).toBe('info@example.com');
  });

  it('accepts an empty object (nothing gathered yet)', () => {
    // compile-step can emit {} when profile.contact has no fields —
    // see the pipeline test "omits contact.phone / phoneForTel /
    // email when missing" in packages/pipeline/src/__tests__/runner/
    // compile-step.test.ts.
    expect(() => contactSchema.parse({})).not.toThrow();
  });
});

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
