# template-dukecitymodern — Astro v4 Website Template

## What This Is

Astro 6.x static-site template for ZiaMade client sites. Produces single-page local business websites with data-driven section rendering, CSS custom properties theming, and GSAP animations. Client repos hold data only; this template is fetched at build time.

## Architecture

| Layer | Tool |
|-------|------|
| Framework | Astro 6.x (`output: 'static'`) |
| Styling | Pure CSS with custom properties (no preprocessor) |
| Fonts | Self-hosted woff2 in `public/fonts/`, `@font-face` generated at build time |
| Animations | GSAP + ScrollTrigger + Lenis smooth scroll |
| Images | Astro Image (`astro:assets`), Sharp for AVIF/WebP |
| CMS | Pages CMS (pagescms.org, Git-based, `.pages.yml`) |
| Hosting | Cloudflare Pages (Direct Upload via GitHub Actions + Wrangler) |
| Analytics | Umami (optional, via `analytics.json`) |
| Tour | driver.js (optional, via `tour.json`) |

### Data-Only Client Repos

Client repos contain only data files (`src/data/*.json`, `src/content/`, `src/assets/images/`). On push, their GitHub Actions workflow:

1. Checks out this template at a pinned version tag from `.template-version`
2. Copies client data into the template
3. Builds with `astro build`
4. Deploys to Cloudflare Pages via `wrangler pages deploy`

Never edit components in a client repo build directory. Template fixes go in this repo.

### Directory Structure

```
src/
  components/        # 32 Astro components (sections + layout)
  data/              # JSON data files (27 files)
  layouts/           # BaseLayout.astro (theme CSS injection, meta, scripts)
  lib/               # brand.ts, fonts.ts, images.ts, preview.ts, types.ts, etc.
  pages/             # index.astro (data-driven section renderer)
  scripts/           # animation-controller.ts (GSAP orchestrator)
  styles/            # tokens.css, base.css, layout.css, components.css, atmosphere.css, animations.css, brand-name.css, menu.css
public/
  fonts/             # Self-hosted woff2 font files
  scripts/           # Vanilla JS (open-now, gallery-hint, gallery-lightbox, gallery-slider, menu-scroll, driver.js)
  styles/            # driver.css
tests/visual/        # Playwright visual regression (fixtures x viewports)
```

## Data Files

All data lives in `src/data/`. Files are plain JSON imported at build time. Optional files use `import.meta.glob` with eager loading (not `fs.existsSync`).

| File | Required | Contents |
|------|----------|----------|
| `client.json` | Yes | Business name, industry, slug, foundingYear, license, socials, domain, logoUrl, orderUrl, serviceArea |
| `brand.json` | Yes | Single color palette (`palette.*`), nameFont, headingFont, bodyFont, monoFont, nameTreatment |
| `theme.json` | Yes | Section order + variants, layout tokens, nav labels, CTA overrides, heroCta, actionBar, accentStyle, marqueeItems |
| `contact.json` | Yes | email, phoneForTel |
| `location.json` | Yes | address, city, state, zip, country, mapLink, lat, lng |
| `hero.json` | Yes | heroImage, heroTagline, heroSubtitle, fallbackImage, videoUrl, videoPoster |
| `seo.json` | Yes | pageTitle, metaDescription, ogTitle, ogDescription, ogImage, canonicalUrl |
| `schema.json` | Yes | Full JSON-LD structured data (injected as `<script type="application/ld+json">`) |
| `hours.json` | Yes | days[]: day, open, close (null = closed) |
| `testimonials.json` | Yes | items[]: text, author, initials, role, rating, source, url; reviewCount |
| `trustbar.json` | Yes | items[]: number, label |
| `faq.json` | Yes | items[]: question, answer, source |
| `about.json` | Yes | heading, text |
| `cta.json` | Yes | enabled, text, buttonText, buttonHref |
| `alert.json` | Yes | enabled, text, startDate, endDate (date-gated via `lib/alert.ts`) |
| `gallery.json` | Yes | beholdFeedId (optional), images[]: url, alt, fallbackUrl |
| `menu.json` | Yes | categories[]: name, items[]: name, description, price, featured, photo |
| `projects.json` | Yes | projects[]: title, description, before, after, during, service |
| `team.json` | Yes | items[]: name, brandName, title, bio, photo, bookingUrl, bookingLabel, hours, specialties, order |
| `analytics.json` | Yes | umamiWebsiteId (empty string = disabled), umamiScriptUrl |
| `book.json` | Yes | title, subtitle, description, blurb, coverImage, backCoverImage, purchaseUrl, formats, publishDate, publisher, isbn |
| `attributes.json` | Yes | Places API attributes (serviceFlags, restaurant, atmosphere, etc.) |
| `google-links.json` | Yes | directions, writeReview, allReviews, photos, place |
| `_sources.json` | Internal | Source attribution for data fields (not rendered) |
| `_template-manifest.json` | Internal | Machine-readable list of all valid layout tokens, section IDs, and component overrides |
| `preview.json` | Optional | businessName, slug. Present = preview mode (disclaimer bar, noindex) |
| `tour.json` | Optional | steps[]: target, title, body; businessName. Enables driver.js guided tour overlay |
| `process.json` | Optional | heading, eyebrow, steps[]: number, title, description |

Services: `src/content/services/*.md` (frontmatter: title, description, beforeImage, afterImage, startingPrice, order)

Products: `src/content/products/*.md` (frontmatter: name, subtitle, detail, badge, image, featured, order, tags, pricing[])

## Section System

### How It Works

`index.astro` reads `theme.json` sections array and renders matching components via a registry lookup:

```
theme.json sections[] -> resolveComponent(id, variant) -> Astro component
```

Resolution order: explicit `component` override > variant override > default component for section ID.

### Section Registry

| Section ID | Default Component | Variant Overrides | Data Source |
|------------|-------------------|-------------------|-------------|
| `hero` | Hero | split, overlay, video, minimal | `hero.json` |
| `trust` | TrustBar | stats -> TrustStats | `trustbar.json` |
| `services` | ServiceCards | cards, icon-grid, compact, split | `content/services/*.md` |
| `products` | Products | -- | `content/products/*.md` |
| `projects` | ProjectGallery | -- | `projects.json` |
| `process` | ProcessSteps | -- | `process.json` (optional, hardcoded fallback) |
| `gallery` | PhotoGallery | masonry, scroll | `gallery.json` + optional Behold feed |
| `menu` | MenuSection | -- | `menu.json` |
| `reviews` | Reviews | scroll | `testimonials.json` (skipped if items empty) |
| `faq` | FAQ | -- | `faq.json` |
| `contact` | QuoteForm | order-visit -> OrderVisit | `contact.json` |
| `about` | AboutMap | author-bio -> AuthorBio | `about.json`, `location.json` |
| `hours` | HoursDisplay | -- | `hours.json` |
| `beforeAfter` | BeforeAfter | -- | content collection |
| `differentiator` | Differentiator | -- | content collection |
| `marquee` | Marquee | -- | `theme.json` marqueeItems |
| `team` | Team | -- | `team.json` |
| `cta` | CTASection | -- | `cta.json` |
| `book` | BookShowcase | -- | `book.json` |

### Fallback Section Order

If `theme.json` has no `sections` array, falls back to `sectionOrder[]`, then to:
`hero, trust, services, projects, process, reviews, faq, contact, about`

### Adding a Section

1. Create `src/components/NewSection.astro`
2. Import it in `index.astro` and add to `componentMap`
3. Add the section ID to `defaultComponentMap` in `index.astro`
4. Add to `DEFAULT_COMPONENTS` and `DEFAULT_NAV_LABELS` in `src/lib/section-registry.ts`
5. Add the section ID to `_template-manifest.json` capabilities.sectionIds
6. Add to `theme.json` sections array in the desired position

## Brand/Theme System

### Single Palette (v4)

No light/dark toggle. One palette per site, defined in `brand.json`:

```
palette: { bg, surface, surfaceAlt, text, textMuted, accent, accentDim, accentGlow, border, borderSubtle? }
```

`lib/brand.ts` generates CSS custom properties injected as inline `<style>` in `<head>`:
- `paletteToCSS()` -- maps palette fields to `--bg`, `--surface`, `--text`, `--accent`, etc.
- `generateThemeCSS()` -- palette vars + font-family vars (`--font-name`, `--font-heading`, `--font-body`, `--font-mono`)
- `generateLayoutCSS()` -- maps layout tokens to CSS vars (`--card-radius`, `--section-gap`, `--btn-radius`, etc.)

### Font System

Fonts are self-hosted woff2 files in `public/fonts/`. The registry in `src/lib/fonts.ts` maps font family names to file paths. `buildFontFaceCSS(brand)` emits `@font-face` declarations for nameFont, headingFont, bodyFont. ~40 fonts available (Google variable, Google static, Fontshare variable).

### Layout Tokens

`theme.json` layout object controls visual design. Applied as `data-*` attributes on `<body>` and/or CSS custom properties:

| Token | Values | Effect |
|-------|--------|--------|
| `heroStyle` | split, overlay, video, minimal | Hero component variant |
| `headerStyle` | solid, glass, transparent | Header background treatment |
| `headerPosition` | sticky, static, hidden-on-scroll | Header scroll behavior |
| `cardStyle` | bordered, shadow, flat, elevated, luxury | Card visual treatment |
| `cardRadius` | sharp, soft, round | `--card-radius` |
| `buttonStyle` | rounded, pill, square | `--btn-radius` |
| `buttonVariant` | solid, ghost, tactile | Button fill style |
| `sectionPattern` | none, alternating, gradient, wave | Background rhythm |
| `sectionGap` | tight, normal, spacious | `--section-gap` |
| `atmosphereLevel` | none, minimal, rich, cinematic | Noise overlay + ambient effects |
| `motionIntensity` | none, subtle, standard, dramatic | GSAP animation strength |
| `dividerStyle` | line, glow, fade, none | Section dividers |
| `typographyScale` | compact, standard, editorial, display | `--font-size-base/h1/h2` |
| `imageStyle` | rounded, sharp, masked | `--img-radius` |
| `shadowStyle` | subtle, standard, dramatic | `--shadow-card` |
| `hoverIntensity` | none, subtle, standard | `--hover-scale`, `--hover-shadow` |
| `overlayDarkness` | light, medium, heavy | `--overlay-darkness` |
| `glassOpacity` | subtle, standard, heavy | `--glass-opacity` |
| `borderWeight` | none, subtle, standard | `--border-weight` |

All valid values are documented in `src/data/_template-manifest.json`.

### Name Treatment

`brand.json` supports `nameTreatment` for styled business name rendering:
```json
{ "parts": [{ "text": "Duke", "font": "name", "color": "accent" }], "layout": "inline" | "stacked" }
```
Rendered by `BrandName.astro`.

## Component List

| Component | Purpose |
|-----------|---------|
| `AboutMap.astro` | About section with embedded Google Maps link |
| `AuthorBio.astro` | Author about variant (for book/author sites) |
| `BeforeAfter.astro` | Before/after image comparison cards |
| `BookShowcase.astro` | Book display with cover, description, purchase CTA |
| `BrandName.astro` | Styled business name using `nameTreatment` from brand.json |
| `CTASection.astro` | Call-to-action band with heading, text, and button |
| `Differentiator.astro` | Unique selling points / competitive advantages |
| `Divider.astro` | Section divider (wave, curve, gentle variants) |
| `FAQ.astro` | Accordion FAQ section |
| `FloatingCTA.astro` | Fixed-position floating CTA button |
| `Footer.astro` | Site footer with contact info, hours, socials, legal |
| `Hero.astro` | Hero section (split, overlay, video, minimal variants) |
| `HoursDisplay.astro` | Business hours grid |
| `Marquee.astro` | Scrolling text marquee band |
| `MenuSection.astro` | Restaurant menu with categories, items, featured badges |
| `OptimizedImg.astro` | Image wrapper using Astro Image with fallback |
| `OrderVisit.astro` | Contact variant for order/visit businesses (restaurants) |
| `PhotoGallery.astro` | Photo gallery with lightbox + optional Behold Instagram feed |
| `ProcessSteps.astro` | Step-by-step process visualization |
| `Products.astro` | Product cards with pricing tiers, specs, tags |
| `ProjectGallery.astro` | Before/after project slider gallery |
| `QuoteForm.astro` | Contact form (default contact variant) |
| `Reviews.astro` | Customer testimonial cards with star ratings |
| `ScrollMoment.astro` | Scroll-triggered visual moment (inserted after reviews) |
| `ServiceCards.astro` | Service cards with before/after hover, starting prices |
| `StickyActionBar.astro` | Mobile sticky action bar (call, directions, CTA) |
| `StickyHeader.astro` | Navigation header with glass/solid/transparent styles |
| `Team.astro` | Team member cards with booking links |
| `TourOverlay.astro` | driver.js guided tour overlay (preview sites only) |
| `TrustBar.astro` | Trust badges / stat items |
| `TrustStats.astro` | Trust section variant with large stat numbers |

## CSS Architecture

No preprocessor. Eight CSS files imported in `BaseLayout.astro`:

| File | Purpose |
|------|---------|
| `tokens.css` | Design tokens, CSS custom property defaults, dark/light surface scales |
| `base.css` | Reset, typography, global element styles |
| `layout.css` | Grid, section spacing, container widths |
| `components.css` | Shared component styles (buttons, cards, badges, forms) |
| `atmosphere.css` | Noise overlay, ambient effects, section mood styles |
| `animations.css` | GSAP-triggered animation classes (reveal, stagger, tilt, parallax) |
| `brand-name.css` | BrandName component styles (shared across header + footer) |
| `menu.css` | MenuSection styles (shared, kept separate for size) |

Section-specific CSS is scoped inside each component's `<style>` tag.

## Preview System

### preview.json

When present in `src/data/`, the site is in preview mode:
- Red fallback disclaimer bar rendered at top (visible by default via inline CSS)
- `<meta name="robots" content="noindex, nofollow">` injected
- OG title prefixed with "PREVIEW - "
- Disclaimer includes "Request Removal" link to `ziamade.com/request-removal/<slug>`

### Proxy Overlay Interaction

When served via the ziamade.com proxy, the proxy injects CSS that hides the fallback disclaimer:
```css
#zm-fallback-disclaimer { display: none !important }
```
If accessed directly (not via proxy), the disclaimer stays visible as a legal safeguard.

### tour.json

Optional. When present, `TourOverlay.astro` renders a driver.js guided tour. Steps target CSS selectors and show title/body popups.

## Deploy Flow

### Template Repo (this repo)

`.github/workflows/deploy.yml` builds and deploys the template itself as a demo site:
1. `npm ci` + `npm run build` (Astro static build to `dist/`)
2. `wrangler pages deploy dist` to Cloudflare Pages
3. Slack notification on failure

### Client Repos

Client repos have their own deploy workflow that:
1. Checks out the client repo (data only)
2. Fetches this template at the version in `.template-version`
3. Copies client `src/data/`, `src/content/`, `src/assets/` into the template
4. Runs `npm ci && npm run build`
5. Deploys `dist/` to CF Pages via `wrangler pages deploy`

### Version Pinning

`.template-version` in client repos pins to a git tag (e.g., `v4.0.0`). Bumping all clients:
```bash
npx tsx packages/pipeline/scripts/propagate-template.ts v4.1.0
```

### Required Secrets (org-level)

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | CF API token with Pages permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `SLACK_WEBHOOK_URL` | Failure notifications |

## CMS Integration

Pages CMS (pagescms.org) provides a Git-based editing UI. Config is `.pages.yml` at repo root.

### What Clients Can Edit

Alert banner, contact info, location, hours, hero (image + text), about text, brand colors + fonts, testimonials, FAQ, photo gallery, menu (restaurants), trust bar stats, projects (before/after), services (markdown collection), products (markdown collection).

### What Clients Cannot Edit

`theme.json`, `schema.json`, `seo.json`, `analytics.json`, `_sources.json`, `_template-manifest.json`, `attributes.json`. These are set by the pipeline or agent skills.

### Adding a CMS Field

1. Add the field to the JSON data file
2. Add the field definition to `.pages.yml` under the matching content entry
3. Update the component that reads the field
4. Update `src/lib/types.ts` if the field affects typed interfaces

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Astro dev server at `http://localhost:4321` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run check` | Astro type checking |
| `npm run test` | Vitest unit tests |

Visual regression tests (separate package):
```bash
cd tests/visual && npx playwright test
```

## Common Issues

**Image paths**: Data files reference images as `/assets/images/...`. The `resolveImage()` function in `lib/images.ts` maps these to `/src/assets/images/...` for Astro's image pipeline. External URLs (`http...`) bypass the resolver and render as plain `<img>`.

**Optional data files**: `tour.json` and `preview.json` are loaded via `import.meta.glob('../data/<file>.json', { eager: true })`, not direct import. This prevents build failures when the file is absent. Never use `fs.existsSync` or `import.meta.url` for optional files -- the path resolves incorrectly during Astro build.

**Empty data arrays**: Components like Reviews check `testimonials.items.length > 0` before rendering. Empty arrays cause the section to be skipped, not crash.

**Font not loading**: Ensure the font family name in `brand.json` exactly matches a key in `src/lib/fonts.ts` `FONT_REGISTRY`. Unregistered fonts fall back to system fonts silently.

**Content collections missing**: `src/content/services/` and `src/content/products/` directories may not exist in all client repos. Components handle this gracefully.

**postinstall script**: `npm ci` copies `driver.js` files from `node_modules` to `public/scripts/` and `public/styles/`. If driver.js tour doesn't work after install, check this ran.

**header-scroll.js**: Referenced in BaseLayout as `<script is:inline src="/scripts/header-scroll.js">` but lives in the StickyHeader component's inline script block, not as a separate public file. This is a known reference -- the file is generated during build.

## Coding Conventions

- Use CSS custom properties from `tokens.css` -- never hardcode colors
- Section CSS is scoped in component `<style>` tags (not global stylesheets)
- All data access is via static JSON imports (no runtime API calls)
- TypeScript types for all data shapes live in `src/lib/types.ts`
- Image references in data files: `/assets/images/...` (root-relative, no `/src` prefix)
- No industry detection logic in components -- all decisions come from `theme.json`
