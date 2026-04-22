/**
 * Template-side clone of `packages/shared/src/data-contracts/cta.ts`.
 * SOURCE: ../../../../ziamade/packages/shared/src/data-contracts/cta.ts
 *
 * The block between `// SOURCE-BEGIN` and `// SOURCE-END` below is
 * byte-identical to the source and is asserted by the platform-repo
 * drift-guard test.
 */

import { z } from 'astro/zod';

// SOURCE-BEGIN
export const CtaSchema = z.object({
  heading: z.string().optional(),
  text: z.string().min(1),
  buttonText: z.string().min(1),
  buttonHref: z.string().min(1),
  enabled: z.boolean().optional(),
});

export type CtaData = z.infer<typeof CtaSchema>;
// SOURCE-END
