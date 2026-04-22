/**
 * Template-side clone of `packages/shared/src/data-contracts/hours.ts`.
 * SOURCE: ../../../../ziamade/packages/shared/src/data-contracts/hours.ts
 *
 * The block between `// SOURCE-BEGIN` and `// SOURCE-END` below is
 * byte-identical to the source and is asserted by the platform-repo
 * drift-guard test.
 */

import { z } from 'astro/zod';

// SOURCE-BEGIN
export const HoursDaySchema = z.object({
  day: z.string().min(1),
  open: z.string().nullish(),
  close: z.string().nullish(),
  closed: z.boolean().optional(),
});

export const HoursSchema = z.object({
  days: z.array(HoursDaySchema),
  // `secondaryHours` is nullable-by-design per the Pipeline Data Contract
  // ("delivery/takeout if available"). The template's `normalizeHours()`
  // helper in `hours-parser.ts` always fills in either a Record or an
  // explicit `null` — never `undefined` — so `.optional()` alone would
  // reject every fixture build where no secondary hours exist. See #94
  // (template fail-loud) / #649 (platform precedent).
  secondaryHours: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type HoursDay = z.infer<typeof HoursDaySchema>;
export type HoursData = z.infer<typeof HoursSchema>;
// SOURCE-END
