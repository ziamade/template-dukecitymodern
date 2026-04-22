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
  secondaryHours: z.record(z.string(), z.unknown()).optional(),
});

export type HoursDay = z.infer<typeof HoursDaySchema>;
export type HoursData = z.infer<typeof HoursSchema>;
// SOURCE-END
