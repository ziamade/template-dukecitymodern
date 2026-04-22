/**
 * Template-side clone of `packages/shared/src/data-contracts/contact.ts`.
 * SOURCE: ../../../../ziamade/packages/shared/src/data-contracts/contact.ts
 *
 * The block between `// SOURCE-BEGIN` and `// SOURCE-END` below is
 * byte-identical to the source and is asserted by the platform-repo
 * drift-guard test.
 */

import { z } from 'astro/zod';

// SOURCE-BEGIN
export const ContactSchema = z.object({
  phone: z.string().optional(),
  phoneForTel: z.string().optional(),
  email: z.string().optional(),
  orderUrl: z.string().optional(),
  bookingUrl: z.string().optional(),
});

export type ContactData = z.infer<typeof ContactSchema>;
// SOURCE-END
