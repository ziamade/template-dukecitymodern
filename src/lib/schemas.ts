/**
 * Zod schemas for all data files.
 *
 * Schemas are intentionally permissive (`.optional()`, `.loose()`)
 * because client data varies widely across sites. The goal is runtime
 * validation with useful error messages, not strict enforcement.
 *
 * Uses `astro/zod` — Astro bundles Zod, no extra dependency needed.
 */
import { z } from 'astro/zod';

// ---------------------------------------------------------------------------
// Shared / reusable schemas
// ---------------------------------------------------------------------------

/** CSS color value — hex (#fff, #aabbcc), rgb(), rgba(), hsl(), hsla(), or CSS named color */
const cssColor = z.string().refine(
  (val) =>
    /^(#[0-9a-fA-F]{3,8}|rgba?\([\d\s,.%]+\)|hsla?\([\d\s,.%deg]+\)|[a-zA-Z]+)$/i.test(
      val,
    ),
  {
    message:
      'Must be a valid CSS color value (hex, rgb, rgba, hsl, hsla, or CSS named color)',
  },
);

/** Font name — letters, numbers, spaces, hyphens, and apostrophes only */
const fontName = z.string().refine(
  (val) => /^[a-zA-Z0-9\s\-']+$/.test(val),
  {
    message:
      'Font name must contain only letters, numbers, spaces, hyphens, and apostrophes',
  },
);

// ---------------------------------------------------------------------------
// client.json
// ---------------------------------------------------------------------------

export const clientSchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  // Actual data has foundingYear as a string ("2015"), but types.ts said number|null.
  // Accept both for maximum compatibility.
  foundingYear: z.union([z.string(), z.number()]).nullable().optional(),
  license: z.string().optional(),
  insured: z.boolean().optional(),
  serviceArea: z.string().optional(),
  industry: z.string().optional(),
  // delivery is null in many client repos
  delivery: z.union([z.record(z.string(), z.string()), z.null()]).optional(),
  orderUrl: z.string().optional(),
  socials: z.record(z.string(), z.string()).optional(),
  domain: z.string().optional(),
  logoUrl: z.string().optional(),
  authorPhoto: z.string().optional(),
}).loose();

// ---------------------------------------------------------------------------
// brand.json
// ---------------------------------------------------------------------------

export const colorPaletteSchema = z.object({
  // Core 6 — required, these define the palette
  bg: cssColor,
  surface: cssColor,
  surfaceAlt: cssColor,
  text: cssColor,
  textMuted: cssColor,
  accent: cssColor,
  // Derived 4 — optional, auto-computed from core 6 by paletteToCSS() when omitted
  accentDim: cssColor.optional(),
  accentGlow: cssColor.optional(),
  border: cssColor.optional(),
  borderSubtle: cssColor.optional(),
}).loose();

export const namePartSchema = z.object({
  text: z.string(),
  font: z.enum(['name', 'heading', 'body']).or(z.string()),
  color: z.enum(['accent', 'primary', 'text', 'textMuted', 'gradient']).or(z.string()),
}).loose();

export const nameTreatmentSchema = z.object({
  parts: z.array(namePartSchema),
  layout: z.enum(['inline', 'stacked']).optional(),
}).loose();

export const brandSchema = z.object({
  palette: colorPaletteSchema,
  nameFont: fontName,
  headingFont: fontName,
  bodyFont: fontName,
  monoFont: fontName.nullish(),
  nameTreatment: nameTreatmentSchema.optional(),
}).loose();

// ---------------------------------------------------------------------------
// theme.json
// ---------------------------------------------------------------------------

export const sectionEntrySchema = z.object({
  id: z.string(),
  variant: z.union([z.string(), z.number()]).optional(),
  component: z.string().optional(),
}).loose();

/** Helper: accept known enum values with a string fallback for forward compat */
const enumOr = <T extends [string, ...string[]]>(values: T) =>
  z.enum(values).or(z.string());

export const layoutTokensSchema = z.object({
  cardRadius: enumOr(['sharp', 'soft', 'round']).optional(),
  sectionGap: enumOr(['tight', 'normal', 'spacious']).optional(),
  buttonStyle: enumOr(['rounded', 'pill', 'square']).optional(),
  headerStyle: enumOr(['solid', 'glass', 'transparent']).optional(),
  cardStyle: enumOr(['bordered', 'shadow', 'flat', 'elevated', 'luxury']).optional(),
  typographyScale: enumOr(['compact', 'standard', 'editorial', 'display']).optional(),
  imageStyle: enumOr(['rounded', 'sharp', 'masked']).optional(),
  sectionPattern: enumOr(['none', 'alternating', 'gradient', 'wave']).optional(),
  headerPosition: enumOr(['sticky', 'static', 'hidden-on-scroll']).optional(),
  motionIntensity: enumOr(['none', 'subtle', 'standard', 'dramatic']).optional(),
  atmosphereLevel: enumOr(['none', 'minimal', 'rich', 'cinematic']).optional(),
  heroStyle: enumOr(['split', 'overlay', 'video', 'minimal']).optional(),
  buttonVariant: enumOr(['solid', 'ghost', 'tactile']).optional(),
  dividerStyle: enumOr(['line', 'glow', 'fade', 'none']).optional(),
  logoSize: enumOr(['sm', 'md', 'lg']).optional(),
  shadowStyle: enumOr(['subtle', 'standard', 'dramatic']).optional(),
  hoverIntensity: enumOr(['none', 'subtle', 'standard']).optional(),
  gradientStyle: enumOr(['none', 'subtle', 'accent-tint']).optional(),
  overlayDarkness: enumOr(['light', 'medium', 'heavy']).optional(),
  glassOpacity: enumOr(['subtle', 'standard', 'heavy']).optional(),
  borderWeight: enumOr(['none', 'subtle', 'standard']).optional(),
}).loose();

const ctaOverrideSchema = z.object({
  text: z.string().optional(),
  href: z.string().optional(),
}).loose();

const actionBarSchema = z.object({
  hidden: z.boolean().optional(),
  links: z.array(z.object({
    href: z.string(),
    icon: z.string(),
    text: z.string(),
  })).optional(),
}).loose();

export const themeSchema = z.object({
  sections: z.array(sectionEntrySchema).optional(),
  sectionOrder: z.array(z.string()).optional(),
  accentStyle: z.string().optional(),
  faviconShape: z.string().optional(),
  industry: z.string().optional(),
  layout: layoutTokensSchema.optional(),
  marqueeItems: z.array(z.string()).optional(),
  // Fields accessed by components via theme.nav / .cta / .heroCta / .actionBar
  // nav may contain nested objects (e.g. { labels: { hero: "Home" } })
  nav: z.record(z.string(), z.unknown()).optional(),
  cta: ctaOverrideSchema.optional(),
  heroCta: ctaOverrideSchema.optional(),
  actionBar: actionBarSchema.optional(),
}).loose();

// ---------------------------------------------------------------------------
// contact.json
// ---------------------------------------------------------------------------

export const contactSchema = z.object({
  email: z.string(),
  phoneForTel: z.string(),
  phone: z.string().optional(),
}).loose();

// ---------------------------------------------------------------------------
// location.json
// ---------------------------------------------------------------------------

export const locationSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
  mapLink: z.string(),
  lat: z.number().nullish(),
  lng: z.number().nullish(),
}).loose();

// ---------------------------------------------------------------------------
// hero.json
// ---------------------------------------------------------------------------

export const heroSchema = z.object({
  heroImage: z.string(),
  heroTagline: z.string(),
  heroSubtitle: z.string(),
  fallbackImage: z.string().optional(),
  heroVideo: z.string().optional(),
  videoUrl: z.string().optional(),
  videoPoster: z.string().optional(),
  cta: ctaOverrideSchema.optional(),
}).loose();

// ---------------------------------------------------------------------------
// seo.json
// ---------------------------------------------------------------------------

export const seoSchema = z.object({
  pageTitle: z.string(),
  metaDescription: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage: z.string(),
  canonicalUrl: z.string(),
}).loose();

// ---------------------------------------------------------------------------
// schema.json (JSON-LD — free-form)
// ---------------------------------------------------------------------------

export const jsonLdSchema = z.record(z.string(), z.unknown());

// ---------------------------------------------------------------------------
// hours.json
// ---------------------------------------------------------------------------

export const hoursDaySchema = z.object({
  day: z.string(),
  open: z.string().nullish(),
  close: z.string().nullish(),
}).loose();

export const hoursSchema = z.object({
  days: z.array(hoursDaySchema),
  // `secondaryHours` is nullable-by-design per the Pipeline Data Contract
  // ("delivery/takeout if available"). The template's `normalizeHours()`
  // helper in `hours-parser.ts` always fills in either a Record or an explicit
  // `null` — never `undefined` — so `.optional()` alone would reject every
  // fixture build where no secondary hours exist. See platform#649.
  secondaryHours: z.record(z.string(), z.unknown()).nullable().optional(),
}).loose();

// ---------------------------------------------------------------------------
// testimonials.json
// ---------------------------------------------------------------------------

export const testimonialSchema = z.object({
  text: z.string(),
  author: z.string(),
  initials: z.string().optional(),
  role: z.string().optional(),
  rating: z.number().optional(),
  source: z.string().optional(),
  url: z.string().optional(),
}).loose();

export const testimonialsSchema = z.object({
  items: z.array(testimonialSchema).optional(),
  reviewCount: z.number().nullable().optional(),
  averageRating: z.number().nullable().optional(),
  allReviewsUrl: z.string().optional().default(''),
  // Legacy field names (backward compat)
  totalReviewCount: z.number().optional(),
  totalReviews: z.number().optional(),
}).loose();

// ---------------------------------------------------------------------------
// faq.json
// ---------------------------------------------------------------------------

export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  source: z.string().optional(),
}).loose();

export const faqSchema = z.object({
  items: z.array(faqItemSchema),
}).loose();

// ---------------------------------------------------------------------------
// about.json
// ---------------------------------------------------------------------------

export const aboutSchema = z.object({
  heading: z.string(),
  text: z.string(),
  image: z.string().optional(),
}).loose();

// ---------------------------------------------------------------------------
// gallery.json
// ---------------------------------------------------------------------------

export const galleryImageSchema = z.object({
  url: z.string(),
  alt: z.string(),
  fallbackUrl: z.string().optional(),
}).loose();

export const gallerySchema = z.object({
  beholdFeedId: z.string().optional(),
  images: z.array(galleryImageSchema),
}).loose();

// ---------------------------------------------------------------------------
// menu.json
// ---------------------------------------------------------------------------

export const menuItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string().optional(),
  featured: z.boolean().optional(),
  photo: z.string().nullable().optional(),
}).loose();

export const menuCategorySchema = z.object({
  name: z.string(),
  items: z.array(menuItemSchema),
}).loose();

export const menuSchema = z.object({
  categories: z.array(menuCategorySchema),
}).loose();

// ---------------------------------------------------------------------------
// projects.json
// ---------------------------------------------------------------------------

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  before: z.string(),
  after: z.string(),
  during: z.string().optional(),
  service: z.string(),
}).loose();

export const projectsSchema = z.object({
  projects: z.array(projectSchema),
}).loose();

// ---------------------------------------------------------------------------
// alert.json
// ---------------------------------------------------------------------------

export const alertSchema = z.object({
  enabled: z.boolean(),
  text: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).loose();

// ---------------------------------------------------------------------------
// analytics.json
// ---------------------------------------------------------------------------

export const analyticsSchema = z.object({
  umamiWebsiteId: z.string(),
  umamiScriptUrl: z.string(),
}).loose();

// ---------------------------------------------------------------------------
// trustbar.json
// ---------------------------------------------------------------------------

export const trustbarItemSchema = z.object({
  number: z.union([z.string(), z.number()]),
  label: z.string(),
}).loose();

export const trustbarSchema = z.object({
  items: z.array(trustbarItemSchema),
}).loose();

// ---------------------------------------------------------------------------
// team.json
// ---------------------------------------------------------------------------

const teamHoursDaySchema = z.object({
  day: z.string(),
  open: z.string().nullish(),
  close: z.string().nullish(),
});

export const teamMemberSchema = z.object({
  name: z.string(),
  brandName: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  photo: z.string().optional(),
  bookingUrl: z.string().optional(),
  bookingLabel: z.string().optional(),
  hours: z.union([z.string(), z.array(teamHoursDaySchema)]).optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  pricing: z.array(z.object({
    service: z.string(),
    price: z.number(),
    duration: z.string().optional(),
  })).optional(),
  specialties: z.array(z.string()).optional(),
  order: z.number().optional(),
}).loose();

export const teamSchema = z.object({
  items: z.array(teamMemberSchema),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
}).loose();

// ---------------------------------------------------------------------------
// cta.json
// ---------------------------------------------------------------------------

export const ctaSchema = z.object({
  text: z.string(),
  buttonText: z.string(),
  buttonHref: z.string(),
  enabled: z.boolean().optional(),
}).loose();

// ---------------------------------------------------------------------------
// book.json
// ---------------------------------------------------------------------------

export const bookSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  blurb: z.string().optional(),
  coverImage: z.string().optional(),
  backCoverImage: z.string().optional(),
  purchaseUrl: z.string().optional(),
  purchaseLabel: z.string().optional(),
  formats: z.array(z.string()).optional(),
  publishDate: z.string().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
}).loose();

// ---------------------------------------------------------------------------
// attributes.json (free-form Places API data)
// ---------------------------------------------------------------------------

export const attributesSchema = z.record(z.string(), z.unknown());

// ---------------------------------------------------------------------------
// google-links.json (all fields optional — can be empty object)
// ---------------------------------------------------------------------------

export const googleLinksSchema = z.object({
  directions: z.string().optional(),
  writeReview: z.string().optional(),
  allReviews: z.string().optional(),
  photos: z.string().optional(),
  place: z.string().optional(),
}).loose();

// ---------------------------------------------------------------------------
// _sources.json (internal, free-form)
// ---------------------------------------------------------------------------

export const sourcesSchema = z.record(z.string(), z.unknown());

// ---------------------------------------------------------------------------
// Optional data files (loaded via import.meta.glob in components)
// ---------------------------------------------------------------------------

/** preview.json — present = preview mode */
export const previewSchema = z.object({
  businessName: z.string(),
  slug: z.string(),
}).loose();

/** tour.json — driver.js guided tour overlay */
export const tourStepSchema = z.object({
  target: z.string(),
  title: z.string(),
  body: z.string(),
}).loose();

export const tourSchema = z.object({
  steps: z.array(tourStepSchema),
  businessName: z.string().optional(),
}).loose();

/** process.json — custom process steps (falls back to hardcoded defaults) */
export const processStepSchema = z.object({
  number: z.union([z.string(), z.number()]).optional(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
}).loose();

export const processSchema = z.object({
  heading: z.string().optional(),
  eyebrow: z.string().optional(),
  steps: z.array(processStepSchema),
}).loose();

/** differentiator.json — competitive advantages (us vs them panels) */
const diffPanelSchema = z.object({
  title: z.string().optional(),
  features: z.array(z.string()),
  image: z.string().optional(),
  accent: z.boolean().optional(),
}).loose();

export const differentiatorSchema = z.object({
  heading: z.string().optional(),
  eyebrow: z.string().optional(),
  us: diffPanelSchema.optional(),
  them: diffPanelSchema.optional(),
  items: z.array(z.record(z.string(), z.unknown())).optional(),
}).loose();

// ---------------------------------------------------------------------------
// Product schema (content collection, not JSON data file)
// ---------------------------------------------------------------------------

export const productPricingSchema = z.object({
  label: z.string(),
  price: z.number(),
  note: z.string().optional(),
}).loose();

export const productSchema = z.object({
  name: z.string(),
  subtitle: z.string().optional(),
  detail: z.string().optional(),
  badge: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  specs: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()).optional(),
  pricing: z.array(productPricingSchema).optional(),
}).loose();

/** _template-manifest.json — machine-readable list of valid tokens/IDs */
export const templateManifestSchema = z.object({
  version: z.string(),
  description: z.string(),
  capabilities: z.record(z.string(), z.unknown()),
}).loose();

