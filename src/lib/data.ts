/**
 * Centralized validated data imports.
 *
 * Every required JSON data file is imported here, validated through its
 * Zod schema, and re-exported as a properly typed constant.
 *
 * Validation is non-fatal: if a schema fails, the raw data is used
 * as-is and a warning is logged. Client data varies widely across
 * sites, so strict validation must never block a build.
 *
 * Optional data files (tour.json, preview.json, process.json,
 * differentiator.json) are NOT imported here — they use import.meta.glob
 * in components. Their schemas are exported from ./schemas.ts for inline
 * validation.
 *
 * Pipeline-conditional data files are also loaded via import.meta.glob
 * below and re-exported with safe empty defaults so that static
 * `import { menu, team, cta, book, attributes, googleLinks } from
 * '../lib/data'` consumers keep working when the file is absent. Per the
 * Pipeline Data Contract these are emitted only under specific conditions:
 *   - menu.json          — restaurants only
 *   - team.json          — team-led businesses
 *   - cta.json           — authors only
 *   - book.json          — authors only
 *   - attributes.json    — Places v2 with attributes
 *   - google-links.json  — only written if links exist
 */
import type { ZodSchema } from 'astro/zod';
import {
  clientSchema,
  brandSchema,
  themeSchema,
  contactSchema,
  locationSchema,
  heroSchema,
  seoSchema,
  jsonLdSchema,
  hoursSchema,
  testimonialsSchema,
  faqSchema,
  aboutSchema,
  gallerySchema,
  menuSchema,
  projectsSchema,
  alertSchema,
  analyticsSchema,
  trustbarSchema,
  teamSchema,
  ctaSchema,
  bookSchema,
  attributesSchema,
  googleLinksSchema,
  sourcesSchema,
  templateManifestSchema,
} from './schemas';

// Raw JSON imports
import rawClient from '../data/client.json';
import rawBrand from '../data/brand.json';
import rawTheme from '../data/theme.json';
import rawContact from '../data/contact.json';
import rawLocation from '../data/location.json';
import rawHero from '../data/hero.json';
import rawSeo from '../data/seo.json';
import rawSchema from '../data/schema.json';
import rawHours from '../data/hours.json';
import rawTestimonials from '../data/testimonials.json';
import rawFaq from '../data/faq.json';
import rawAbout from '../data/about.json';
import rawGallery from '../data/gallery.json';
import rawProjects from '../data/projects.json';
import rawAlert from '../data/alert.json';
import rawAnalytics from '../data/analytics.json';
import rawTrustbar from '../data/trustbar.json';
import rawSources from '../data/_sources.json';
import rawTemplateManifest from '../data/_template-manifest.json';

// Pipeline-conditional optional files — loaded via import.meta.glob so absent
// files do not break the Astro build. Mirrors the pattern used for tour.json /
// preview.json (BaseLayout.astro) and process.json / differentiator.json (in
// their respective components). The fallback shape for each is the minimum the
// downstream consumer needs to short-circuit cleanly when the file is absent
// (CTASection / BookShowcase / Reviews all guard with truthy checks already).
const menuFiles = import.meta.glob<{ default: unknown }>('../data/menu.json', { eager: true });
const rawMenu: unknown = Object.values(menuFiles)[0]?.default ?? { categories: [] };

const teamFiles = import.meta.glob<{ default: unknown }>('../data/team.json', { eager: true });
const rawTeam: unknown = Object.values(teamFiles)[0]?.default ?? { items: [] };

const ctaFiles = import.meta.glob<{ default: unknown }>('../data/cta.json', { eager: true });
const rawCta: unknown = Object.values(ctaFiles)[0]?.default ?? { text: '', buttonText: '', buttonHref: '', enabled: false };

const bookFiles = import.meta.glob<{ default: unknown }>('../data/book.json', { eager: true });
const rawBook: unknown = Object.values(bookFiles)[0]?.default ?? { title: '' };

const attributesFiles = import.meta.glob<{ default: unknown }>('../data/attributes.json', { eager: true });
const rawAttributes: unknown = Object.values(attributesFiles)[0]?.default ?? {};

const googleLinksFiles = import.meta.glob<{ default: unknown }>('../data/google-links.json', { eager: true });
const rawGoogleLinks: unknown = Object.values(googleLinksFiles)[0]?.default ?? {};

/** Validate with safeParse — warn on failure, never crash the build. */
function validate<T>(schema: ZodSchema<T>, raw: unknown, name: string): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    console.warn(`[data] ${name} failed validation (using raw data):`, JSON.stringify(result.error.issues));
    return raw as T;
  }
  return result.data;
}

// Validated + typed exports
export const client = validate(clientSchema, rawClient, 'client.json');
export const brand = validate(brandSchema, rawBrand, 'brand.json');
export const theme = validate(themeSchema, rawTheme, 'theme.json');
export const contact = validate(contactSchema, rawContact, 'contact.json');
export const location = validate(locationSchema, rawLocation, 'location.json');
export const hero = validate(heroSchema, rawHero, 'hero.json');
export const seo = validate(seoSchema, rawSeo, 'seo.json');
export const schemaJson = validate(jsonLdSchema, rawSchema, 'schema.json');
export const hours = validate(hoursSchema, rawHours, 'hours.json');
export const testimonials = validate(testimonialsSchema, rawTestimonials, 'testimonials.json');
export const faq = validate(faqSchema, rawFaq, 'faq.json');
export const about = validate(aboutSchema, rawAbout, 'about.json');
export const gallery = validate(gallerySchema, rawGallery, 'gallery.json');
export const menu = validate(menuSchema, rawMenu, 'menu.json');
export const projects = validate(projectsSchema, rawProjects, 'projects.json');
export const alert = validate(alertSchema, rawAlert, 'alert.json');
export const analytics = validate(analyticsSchema, rawAnalytics, 'analytics.json');
export const trustbar = validate(trustbarSchema, rawTrustbar, 'trustbar.json');
export const team = validate(teamSchema, rawTeam, 'team.json');
export const cta = validate(ctaSchema, rawCta, 'cta.json');
export const book = validate(bookSchema, rawBook, 'book.json');
export const attributes = validate(attributesSchema, rawAttributes, 'attributes.json');
export const googleLinks = validate(googleLinksSchema, rawGoogleLinks, 'google-links.json');
export const sources = validate(sourcesSchema, rawSources, '_sources.json');
export const templateManifest = validate(templateManifestSchema, rawTemplateManifest, '_template-manifest.json');
