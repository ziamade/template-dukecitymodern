/**
 * Template-side clone of `packages/shared/src/data-contracts/hero.ts`.
 * SOURCE: ../../../../ziamade/packages/shared/src/data-contracts/hero.ts
 *
 * The block between `// SOURCE-BEGIN` and `// SOURCE-END` below is
 * byte-identical to the source and is asserted by the platform-repo
 * drift-guard test in
 * `packages/shared/__tests__/data-contracts-drift.test.ts`.
 * If you need to change the shape, change the source module first and
 * regenerate this file.
 */

import { z } from 'astro/zod';

// SOURCE-BEGIN
export const HeroSchema = z.object({
  heroTagline: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroImage: z.string().min(1),
  fallbackImage: z.string().optional(),
  heroVideo: z.string().optional(),
  videoUrl: z.string().optional(),
  videoPoster: z.string().optional(),
});

export type HeroData = z.infer<typeof HeroSchema>;
// SOURCE-END
