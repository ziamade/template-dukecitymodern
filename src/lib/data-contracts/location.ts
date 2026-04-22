/**
 * Template-side clone of `packages/shared/src/data-contracts/location.ts`.
 * SOURCE: ../../../../ziamade/packages/shared/src/data-contracts/location.ts
 *
 * The block between `// SOURCE-BEGIN` and `// SOURCE-END` below is
 * byte-identical to the source and is asserted by the platform-repo
 * drift-guard test.
 */

import { z } from 'astro/zod';

// SOURCE-BEGIN
export const LocationSchema = z.object({
  address: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().optional(),
  country: z.string().default('US'),
  mapLink: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type LocationData = z.infer<typeof LocationSchema>;
// SOURCE-END
