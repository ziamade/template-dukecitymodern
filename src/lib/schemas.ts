/**
 * Zod schemas for all data files.
 *
 * Schemas are intentionally permissive (`.optional()`, `.loose()`)
 * because client data varies widely across sites. The goal is runtime
 * validation with useful error messages, not strict enforcement.
 *
 * Uses `astro/zod` — Astro bundles Zod, no extra dependency needed.
 *
 * Migrated files (see data-contracts/*.ts, platform#640):
 *   hero, brand, contact, location, hours, cta
 * These re-export from `./data-contracts/*.ts`, which are byte-identical
 * clones of the `@ziamade/shared/data-contracts/*.ts` source modules.
 * Any drift is caught by the platform-repo drift-guard test.
 */
import { z } from 'astro/zod';
import { HeroSchema as SharedHeroSchema } from './data-contracts/hero';
import { ContactSchema as SharedContactSchema } from './data-contracts/contact';
import { LocationSchema as SharedLocationSchema } from './data-contracts/location';
import {
  HoursSchema as SharedHoursSchema,
  HoursDaySchema as SharedHoursDaySchema,
} from './data-contracts/hours';
import { CtaSchema as SharedCtaSchema } from './data-contracts/cta';
import {
  BrandSchema as SharedBrandSchema,
  BrandPaletteSchema as SharedBrandPaletteSchema,
  BrandNamePartSchema as SharedBrandNamePartSchema,
  BrandNameTreatmentSchema as SharedBrandNameTreatmentSchema,
} from './data-contracts/brand';

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
// brand.json — canonical schema lives in ./data-contracts/brand.ts
// (platform#640). The canonical shape uses plain z.string() and the
// pipeline validates palette colors upstream.
// ---------------------------------------------------------------------------

// `.loose()` is applied at the template boundary so components can carry
// extra fields (e.g. copywriter-authored callout text, legacy fixture
// attributes) without TypeScript stripping them. The canonical schema
// stays strict on the pipeline side; drift guard compares the base
// module, not the template's looseness wrapper.
export const colorPaletteSchema = SharedBrandPaletteSchema.loose();
export const namePartSchema = SharedBrandNamePartSchema.loose();
export const nameTreatmentSchema = SharedBrandNameTreatmentSchema.loose();

/**
 * Foundations-polish knobs (issue #79). All optional — when absent, tokens.css
 * defaults stand (backward-compat with pre-0.2.x client repos). These are
 * template-only extensions on top of the canonical brand shape (platform#640);
 * the pipeline doesn't emit them yet but template components read them when
 * present.
 */
const typographyKnobSchema = z.object({
  /** Scalar override for --text-base (e.g. "1rem", "1.0625rem"). */
  baseSize: z.string().optional(),
}).loose();

const spacingKnobSchema = z.object({
  /** Global density multiplier applied to the spacing scale. */
  density: z.enum(['compact', 'comfortable', 'airy']).or(z.string()).optional(),
}).loose();

const radiusKnobSchema = z.object({
  /** Switches the whole radius scale between sharp, rounded (default), and soft. */
  style: z.enum(['sharp', 'rounded', 'soft']).or(z.string()).optional(),
}).loose();

// Canonical brand shape + template-only foundations-polish knobs. Same
// `.extend()` pattern Track A uses for contact/hero (platform#640).
export const brandSchema = SharedBrandSchema.extend({
  typography: typographyKnobSchema.optional(),
  spacing: spacingKnobSchema.optional(),
  radius: radiusKnobSchema.optional(),
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
  /** true = the logo asset already spells the business name, so the header
   *  suppresses the BrandName text beside it. Ignored when logoUrl is unset. */
  logoOnly: z.boolean().optional(),
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
  /** Per-section heading/eyebrow overrides, keyed by section id. Lets a site
   *  rename a section whose component hard-codes its own copy. */
  sectionCopy: z.record(z.string(), z.object({
    heading: z.string().optional(),
    eyebrow: z.string().optional(),
  }).loose()).optional(),
}).loose();

// ---------------------------------------------------------------------------
// contact.json — canonical shape lives in ./data-contracts/contact.ts
// All fields optional (platform#640): pipeline omits null rather than
// writing it, so the post-#640 contact.json is always schema-valid.
// ---------------------------------------------------------------------------

// The template extends the canonical contact with form-copy overrides —
// QuoteForm.astro reads these to customize the inquiry form's title,
// description, and message placeholder per site. Fixture-authored,
// not pipeline-emitted; preserved here for type safety.
export const contactSchema = SharedContactSchema.extend({
  formTitle: z.string().optional(),
  formDescription: z.string().optional(),
  messagePlaceholder: z.string().optional(),
}).loose();

// ---------------------------------------------------------------------------
// location.json — canonical shape lives in ./data-contracts/location.ts
// `mapLink` is now always provided by compile-step (platform#640).
// ---------------------------------------------------------------------------

export const locationSchema = SharedLocationSchema.loose();

// ---------------------------------------------------------------------------
// hero.json — canonical shape lives in ./data-contracts/hero.ts
// `heroImage` is now always provided by compile-step (platform#640).
// ---------------------------------------------------------------------------

// The template extends the canonical hero with a nested `cta` override —
// Hero.astro reads `hero.cta.text` / `hero.cta.href` when the site
// author wants a hero-specific call-to-action that differs from the
// global CTA. Not part of the canonical contract (pipeline doesn't
// emit it), but preserved here so the component's types stay useful.
export const heroSchema = SharedHeroSchema.extend({
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
// hours.json — canonical shape lives in ./data-contracts/hours.ts
// Pipeline emits `days[]` directly post-#640 (platform#640). The legacy
// string shape is still tolerated at runtime by `hours-parser.ts`
// `normalizeHours()` for BYO-fixture legacy sites.
// ---------------------------------------------------------------------------

export const hoursDaySchema = SharedHoursDaySchema.loose();
export const hoursSchema = SharedHoursSchema.loose();

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
  /** Qualifier rendered under the category name (ages, hours, who it's for).
   *  Keeps `name` short enough for the category pill nav. */
  description: z.string().optional(),
  items: z.array(menuItemSchema),
}).loose();

/** Optional section-copy overrides so non-restaurant sites can use the price
 *  list without the word "Menu". All optional — omitting them keeps the
 *  restaurant defaults ("Menu" heading, `client.orderUrl` → "Order Online"). */
export const menuCtaSchema = z.object({
  text: z.string().optional(),
  href: z.string().optional(),
  note: z.string().optional(),
}).loose();

export const menuSchema = z.object({
  categories: z.array(menuCategorySchema),
  heading: z.string().optional(),
  eyebrow: z.string().optional(),
  note: z.string().optional(),
  cta: menuCtaSchema.optional(),
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
// cta.json — canonical shape lives in ./data-contracts/cta.ts
// `buttonHref` is always provided by compile-step post-#640 (platform#640).
// ---------------------------------------------------------------------------

export const ctaSchema = SharedCtaSchema.loose();

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

/**
 * process.json — grounded process steps emitted by the platform's
 * `process-author` skill (platform#698). When absent, ProcessSteps.astro
 * falls back to industry-default boilerplate keyed off `theme.json.industry`.
 *
 * The canonical platform schema uses `{title, description, order}` with
 * `order` as a 1-based integer. The template accepts the legacy `number`
 * field too for BYO-fixture sites, and makes `description` optional for
 * resilience against thin fixture data.
 */
export const processStepSchema = z.object({
  number: z.union([z.string(), z.number()]).optional(),
  order: z.number().int().optional(),
  title: z.string(),
  description: z.string().optional(),
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

