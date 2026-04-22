/**
 * Template-side clone of `packages/shared/src/data-contracts/brand.ts`.
 * SOURCE: ../../../../ziamade/packages/shared/src/data-contracts/brand.ts
 *
 * The block between `// SOURCE-BEGIN` and `// SOURCE-END` below is
 * byte-identical to the source and is asserted by the platform-repo
 * drift-guard test.
 */

import { z } from 'astro/zod';

// SOURCE-BEGIN
export const BrandPaletteSchema = z.object({
  bg: z.string().min(1),
  surface: z.string().min(1),
  surfaceAlt: z.string().min(1),
  text: z.string().min(1),
  textMuted: z.string().min(1),
  accent: z.string().min(1),
  // Derived colors — optional, auto-computed downstream when omitted.
  accentDim: z.string().optional(),
  accentGlow: z.string().optional(),
  border: z.string().optional(),
  borderSubtle: z.string().optional(),
});

export const BrandNamePartSchema = z.object({
  text: z.string().min(1),
  font: z.string().min(1),
  color: z.string().min(1),
});

export const BrandNameTreatmentSchema = z.object({
  parts: z.array(BrandNamePartSchema).min(1),
  layout: z.enum(['inline', 'stacked']).optional(),
});

export const BrandSchema = z.object({
  palette: BrandPaletteSchema,
  nameFont: z.string().min(1),
  headingFont: z.string().min(1),
  bodyFont: z.string().min(1),
  monoFont: z.string().nullish(),
  nameTreatment: BrandNameTreatmentSchema.optional(),
});

export type BrandPalette = z.infer<typeof BrandPaletteSchema>;
export type BrandNamePart = z.infer<typeof BrandNamePartSchema>;
export type BrandNameTreatment = z.infer<typeof BrandNameTreatmentSchema>;
export type BrandData = z.infer<typeof BrandSchema>;
// SOURCE-END
