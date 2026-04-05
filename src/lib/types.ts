/**
 * TypeScript types for all data shapes.
 *
 * Derived from Zod schemas in ./schemas.ts via z.infer<>.
 * This replaces the previous hand-maintained interfaces and fixes
 * mismatches between the declared types and actual JSON data.
 *
 * Backward-compatible: all previously exported type names are preserved.
 */
import type { z } from 'astro/zod';
import type {
  clientSchema,
  colorPaletteSchema,
  namePartSchema,
  nameTreatmentSchema,
  brandSchema,
  contactSchema,
  locationSchema,
  hoursDaySchema,
  hoursSchema,
  seoSchema,
  layoutTokensSchema,
  sectionEntrySchema,
  themeSchema,
  alertSchema,
  heroSchema,
  testimonialSchema,
  testimonialsSchema,
  faqItemSchema,
  faqSchema,
  galleryImageSchema,
  gallerySchema,
  menuItemSchema,
  menuCategorySchema,
  menuSchema,
  aboutSchema,
  projectSchema,
  projectsSchema,
  productPricingSchema,
  productSchema,
  teamMemberSchema,
  teamSchema,
  tourStepSchema,
  tourSchema,
  trustbarItemSchema,
  trustbarSchema,
  ctaSchema,
  bookSchema,
  analyticsSchema,
  googleLinksSchema,
  attributesSchema,
  sourcesSchema,
  previewSchema,
  processStepSchema,
  processSchema,
  differentiatorSchema,
} from './schemas';

// ---------------------------------------------------------------------------
// Inferred types — derived from Zod schemas (single source of truth)
// ---------------------------------------------------------------------------

export type Client = z.infer<typeof clientSchema>;
export type ColorPalette = z.infer<typeof colorPaletteSchema>;
export type NamePart = z.infer<typeof namePartSchema>;
export type NameTreatment = z.infer<typeof nameTreatmentSchema>;
export type Brand = z.infer<typeof brandSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Location = z.infer<typeof locationSchema>;
export type HoursDay = z.infer<typeof hoursDaySchema>;
export type Hours = z.infer<typeof hoursSchema>;
export type SEO = z.infer<typeof seoSchema>;
export type LayoutTokens = z.infer<typeof layoutTokensSchema>;
export type SectionEntry = z.infer<typeof sectionEntrySchema>;
export type Theme = z.infer<typeof themeSchema>;
export type Alert = z.infer<typeof alertSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Testimonials = z.infer<typeof testimonialsSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type Gallery = z.infer<typeof gallerySchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type Menu = z.infer<typeof menuSchema>;
export type About = z.infer<typeof aboutSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Projects = z.infer<typeof projectsSchema>;
export type ProductPricing = z.infer<typeof productPricingSchema>;
export type Product = z.infer<typeof productSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type Team = z.infer<typeof teamSchema>;
export type TourStep = z.infer<typeof tourStepSchema>;
export type TourData = z.infer<typeof tourSchema>;
export type TrustbarItem = z.infer<typeof trustbarItemSchema>;
export type Trustbar = z.infer<typeof trustbarSchema>;
export type CTA = z.infer<typeof ctaSchema>;
export type Book = z.infer<typeof bookSchema>;
export type Analytics = z.infer<typeof analyticsSchema>;
export type GoogleLinks = z.infer<typeof googleLinksSchema>;
export type Attributes = z.infer<typeof attributesSchema>;
export type Sources = z.infer<typeof sourcesSchema>;
export type PreviewData = z.infer<typeof previewSchema>;
export type ProcessStep = z.infer<typeof processStepSchema>;
export type Process = z.infer<typeof processSchema>;
export type Differentiator = z.infer<typeof differentiatorSchema>;
