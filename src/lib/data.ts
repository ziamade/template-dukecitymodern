/**
 * Centralized validated data imports.
 *
 * Every required JSON data file is imported here, validated through its
 * Zod schema, and re-exported as a properly typed constant.
 *
 * Optional data files (tour.json, preview.json, process.json,
 * differentiator.json) are NOT imported here — they use import.meta.glob
 * in components. Their schemas are exported from ./schemas.ts for inline
 * validation.
 */
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
import rawMenu from '../data/menu.json';
import rawProjects from '../data/projects.json';
import rawAlert from '../data/alert.json';
import rawAnalytics from '../data/analytics.json';
import rawTrustbar from '../data/trustbar.json';
import rawTeam from '../data/team.json';
import rawCta from '../data/cta.json';
import rawBook from '../data/book.json';
import rawAttributes from '../data/attributes.json';
import rawGoogleLinks from '../data/google-links.json';
import rawSources from '../data/_sources.json';
import rawTemplateManifest from '../data/_template-manifest.json';

// Validated + typed exports
export const client = clientSchema.parse(rawClient);
export const brand = brandSchema.parse(rawBrand);
export const theme = themeSchema.parse(rawTheme);
export const contact = contactSchema.parse(rawContact);
export const location = locationSchema.parse(rawLocation);
export const hero = heroSchema.parse(rawHero);
export const seo = seoSchema.parse(rawSeo);
export const schemaJson = jsonLdSchema.parse(rawSchema);
export const hours = hoursSchema.parse(rawHours);
export const testimonials = testimonialsSchema.parse(rawTestimonials);
export const faq = faqSchema.parse(rawFaq);
export const about = aboutSchema.parse(rawAbout);
export const gallery = gallerySchema.parse(rawGallery);
export const menu = menuSchema.parse(rawMenu);
export const projects = projectsSchema.parse(rawProjects);
export const alert = alertSchema.parse(rawAlert);
export const analytics = analyticsSchema.parse(rawAnalytics);
export const trustbar = trustbarSchema.parse(rawTrustbar);
export const team = teamSchema.parse(rawTeam);
export const cta = ctaSchema.parse(rawCta);
export const book = bookSchema.parse(rawBook);
export const attributes = attributesSchema.parse(rawAttributes);
export const googleLinks = googleLinksSchema.parse(rawGoogleLinks);
export const sources = sourcesSchema.parse(rawSources);
export const templateManifest = templateManifestSchema.parse(rawTemplateManifest);
