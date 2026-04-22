# Duke City Modern

Small business website template for the ZiaMade platform. Client repos hold data only; this template is fetched at build time via GitHub Actions.

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Astro 6.x (static output) |
| Styling | Pure CSS with custom properties |
| CMS | Pages CMS (pagescms.org, Git-based) |
| Hosting | Cloudflare Pages (Direct Upload via GitHub Actions) |
| Images | Astro Image (`astro:assets`), AVIF/WebP via Sharp |
| Animations | GSAP + ScrollTrigger (reveal, stagger, tilt, parallax) |
| Gallery | Behold Instagram widget with static fallback |

## How It Works

Client repos contain only data files (`src/data/*.json`, `src/content/`, `src/assets/images/`). On push, a GitHub Actions workflow in the client repo:

1. Checks out this template at a pinned version tag (e.g. `v1.1.0`)
2. Copies client data into the template
3. Builds with Astro
4. Deploys to Cloudflare Pages

## Project Structure

```
src/
├── components/        # Astro components (sections + layout)
├── content/           # Markdown collections (services/, products/)
├── data/              # JSON data files
├── layouts/           # BaseLayout with theme CSS injection
├── lib/               # Brand theming, image resolver, types, Zod schemas
├── pages/             # index.astro + 404.astro
├── scripts/           # GSAP animation controller
└── styles/            # tokens, base, layout, components, atmosphere, animations
tests/visual/          # Playwright visual regression (fixtures x viewports)
```

---

## Section System

Sections are driven by `theme.json`. The page renderer loops over `sections` and renders matching components:

```json
{
  "sections": [
    { "id": "hero", "variant": "overlay" },
    { "id": "trust", "variant": "stats" },
    { "id": "services", "variant": "cards" },
    { "id": "products" },
    { "id": "cta" },
    { "id": "faq" },
    { "id": "contact" },
    { "id": "about" }
  ]
}
```

Resolution order: explicit `component` override > variant override > default component for the section ID.

### Section → Variant Reference

Every variant key the renderer recognises. Variants not listed here render the default component; unknown values fall back silently.

| Section | Default component | Variant keys | Notes |
|---------|-------------------|--------------|-------|
| `hero` | `Hero` | `split`, `overlay`, `video`, `minimal` | Also accepts `"1"..."3"` from pipeline |
| `trust` | `TrustBar` | `stats` → `TrustStats` | Stat-number card variant |
| `services` | `ServiceCards` | `cards`, `icon-grid`, `compact`, `split`, `options` → `ServiceOptions` | |
| `products` | `Products` | — | Content collection (`src/content/products/`) |
| `projects` | `ProjectGallery` | — | |
| `process` | `ProcessSteps` | — | Falls back to hardcoded steps when `process.json` is absent |
| `gallery` | `PhotoGallery` | `masonry` (default), `scroll`, `category-grid` | |
| `menu` | `MenuSection` | — | |
| `reviews` | `Reviews` | — | Aggregate banner only (Google ToS compliant) |
| `faq` | `FAQ` | — | Accordion |
| `contact` | `QuoteForm` | `order-visit` → `OrderVisit` | `order-visit` for restaurants |
| `about` | `AboutMap` | `author-bio` → `AuthorBio` | Author variant for book sites |
| `hours` | `HoursDisplay` | — | |
| `beforeAfter` | `BeforeAfter` | — | Content collection |
| `differentiator` | `Differentiator` | — | `differentiator.json` (optional) |
| `marquee` | `Marquee` | — | Strings from `theme.marqueeItems` |
| `team` | `Team` | — | |
| `cta` | `CTASection` | — | |
| `book` | `BookShowcase` | — | Author sites |
| `facility` | `Facility` | — | |

**Fallback section order** (when `theme.sections` is empty): `hero, trust, services, projects, process, reviews, faq, contact, about`.

### Branded Empty States

When a section is listed in `theme.sections` but the backing data is thin or missing, the template renders a branded "coming soon" placeholder instead of a broken-looking half-section. If the operator omits the section from `theme.sections` entirely, nothing renders.

Rules:

| Section | Placeholder triggers when |
|---------|---------------------------|
| `reviews` | `testimonials.reviewCount === 0` AND `testimonials.averageRating === 0` |
| `gallery` | `gallery.images.length === 0` AND no `gallery.beholdFeedId` |
| `menu` | No category has items (or `menu.categories` empty) |
| `faq` | `faq.items.length === 0` |
| `testimonials` | `testimonials.items.length === 0` AND no review aggregate |

Placeholders use `--text-lead`, `--space-*`, `--radius-md`, and the brand accent color — they stay visually consistent with the rest of the site.

### Adding a Section

1. Create `src/components/NewSection.astro`
2. Import it in `src/pages/index.astro` and add to `componentMap`
3. Add the section ID to `DEFAULT_COMPONENTS` in `src/lib/section-registry.ts`
4. Register the section ID in `src/data/_template-manifest.json` → `capabilities.sectionIds`
5. List the section in `theme.sections` in the desired position

---

## Design Tokens

Token layer is split across injected brand CSS (`src/lib/brand.ts`) and the structural defaults in `src/styles/tokens.css`. Components should reference tokens — never hardcode colors, sizes, or radii.

### Typography Tokens

Fluid type scale on a 1.25 ratio. `--text-base` is overridable via `brand.typography.baseSize`; every other step stays locked to the ratio so the scale stays consistent.

| Token | Default | Purpose |
|-------|---------|---------|
| `--text-display` | `clamp(2.75rem, 2.2rem + 2.75vw, 4rem)` | Largest headline, 404 eyebrow, ultra-hero lines |
| `--text-h1` | `clamp(2.25rem, 1.9rem + 1.75vw, 3rem)` | Section H1 / hero headline |
| `--text-h2` | `clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem)` | Section H2 |
| `--text-h3` | `clamp(1.375rem, 1.25rem + 0.63vw, 1.625rem)` | Section H3, card titles |
| `--text-lead` | `clamp(1.125rem, 1.05rem + 0.38vw, 1.25rem)` | Subhead / intro paragraph |
| `--text-base` | `clamp(1rem, 0.94rem + 0.3vw, 1.125rem)` | Body copy — overridable via brand.json |
| `--text-body` | alias of `--text-base` | Body copy (semantic alias) |
| `--text-small` | `clamp(0.875rem, 0.83rem + 0.22vw, 0.9375rem)` | Small print, captions on dense UI |
| `--text-caption` | `clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem)` | Eyebrow labels, metadata |
| `--leading-tight` | `1.1` | Display-size headings |
| `--leading-snug` | `1.2` | H1–H3 |
| `--leading-normal` | `1.5` | Body |
| `--leading-loose` | `1.7` | Long-form reading |

Legacy aliases (`--display-size`, `--title-size`, `--body-size`, etc.) remain in `tokens.css` and map onto the named scale — old components keep working.

### Spacing Tokens

Geometric scale multiplied by `--density-multiplier` (default `1`). Change `brand.spacing.density` to `"compact"` (0.85) or `"airy"` (1.15) to scale the whole layout in one switch.

| Token | Default (×1) | Purpose |
|-------|--------------|---------|
| `--space-3xs` | `0.25rem` | Hairline gaps (icon + label) |
| `--space-2xs` | `0.5rem` | Tight clusters |
| `--space-xs` | `0.75rem` | Button padding, small form gaps |
| `--space-sm` | `1rem` | Default gap |
| `--space-md` | `1.5rem` | Card inner padding |
| `--space-lg` | `2.5rem` | Section inner spacing |
| `--space-xl` | `4rem` | Placeholder / hero inner padding |
| `--space-2xl` | `6rem` | Between major content blocks |
| `--space-3xl` | `10rem` | Rarely needed, top-of-page accents |

Legacy aliases (`--gap`, `--gap-md`, `--gap-xl`, etc.) map onto the named scale and respond to the density multiplier automatically.

### Radius Tokens

Four-step named scale. `brand.radius.style` switches the whole scale atomically.

| Token | `sharp` | `rounded` (default) | `soft` |
|-------|---------|---------------------|--------|
| `--radius-sm` | `0` | `0.25rem` | `0.5rem` |
| `--radius-md` | `2px` | `0.5rem` | `1rem` |
| `--radius-lg` | `4px` | `1rem` | `1.5rem` |
| `--radius-pill` | `9999px` | `9999px` | `9999px` |

Legacy tokens (`--radius`, `--radius-xs`, `--radius-xl`, `--radius-full`) remain as aliases so older components do not need edits.

### Other Structural Tokens

Full list lives in `src/styles/tokens.css`. Common ones components reference:

- Surfaces: `--bg`, `--surface`, `--surfaceAlt`, `--text`, `--textMuted`, `--border`, `--borderSubtle`
- Accent: `--accent`, `--accentDim`, `--accentGlow`
- Motion: `--ease-out-expo`, `--ease-spring`, `--duration-fast`, `--duration-normal`
- Shadows: `--shadow-card`, `--shadow-glow`, `--shadow-glass`
- Layout: `--section-pad`, `--section-gap`, `--content-width`, `--content-narrow`, `--content-reading`
- Interaction: `--hover-scale`, `--hover-shadow`, `--glass-opacity`

### Layout Tokens (`theme.layout`)

Data-driven design knobs set per site. Applied as `data-*` attributes on `<body>` or emitted as CSS custom properties by `generateLayoutCSS()`.

| Token | Values | Effect |
|-------|--------|--------|
| `heroStyle` | `split`, `overlay`, `video`, `minimal` | Hero component variant |
| `headerStyle` | `solid`, `glass`, `transparent` | Header background treatment |
| `headerPosition` | `sticky`, `static`, `hidden-on-scroll` | Header scroll behavior |
| `cardStyle` | `bordered`, `shadow`, `flat`, `elevated`, `luxury` | Card visual treatment |
| `cardRadius` | `sharp`, `soft`, `round` | `--card-radius` |
| `buttonStyle` | `rounded`, `pill`, `square` | `--btn-radius` |
| `buttonVariant` | `solid`, `ghost`, `tactile` | Button fill style |
| `sectionPattern` | `none`, `alternating`, `gradient`, `wave`, `angle` | Background rhythm |
| `sectionGap` | `tight`, `normal`, `spacious` | `--section-gap` |
| `atmosphereLevel` | `none`, `minimal`, `rich`, `cinematic` | Noise overlay + ambient effects |
| `motionIntensity` | `none`, `subtle`, `standard`, `dramatic` | GSAP animation strength |
| `dividerStyle` | `line`, `glow`, `fade`, `none` | Section dividers |
| `typographyScale` | `compact`, `standard`, `editorial`, `display` | Overrides `--font-size-base/h1/h2` |
| `imageStyle` | `rounded`, `sharp`, `masked` | `--img-radius` |
| `shadowStyle` | `subtle`, `standard`, `dramatic` | `--shadow-card` |
| `hoverIntensity` | `none`, `subtle`, `standard` | `--hover-scale`, `--hover-shadow` |
| `overlayDarkness` | `light`, `medium`, `heavy` | `--overlay-darkness` |
| `glassOpacity` | `subtle`, `standard`, `heavy` | `--glass-opacity` |
| `borderWeight` | `none`, `subtle`, `standard` | `--border-weight` |

All valid values are machine-readable in `src/data/_template-manifest.json`.

### Brand Knobs (`brand.json`)

Three optional knobs introduced by the foundations-polish wave (issue #79). All three default to the historical look when omitted — existing client repos keep rendering identically.

```jsonc
{
  // ...existing palette + fonts...

  "typography": {
    "baseSize": "1.0625rem"           // Optional. Overrides --text-base.
                                      // The 1.25 ratio stays locked; only the
                                      // base shifts, so the rest of the scale
                                      // stays consistent.
  },

  "spacing": {
    "density": "comfortable"          // "compact" | "comfortable" | "airy".
                                      // Drives --density-multiplier:
                                      //   compact     = 0.85
                                      //   comfortable = 1.0 (default)
                                      //   airy        = 1.15
                                      // Whole spacing scale scales atomically.
  },

  "radius": {
    "style": "rounded"                // "sharp" | "rounded" | "soft".
                                      // Switches the entire --radius-* scale.
                                      //   sharp   -> 0 / 2px / 4px
                                      //   rounded -> 0.25rem / 0.5rem / 1rem (default)
                                      //   soft    -> 0.5rem / 1rem / 1.5rem
  }
}
```

---

## Data Files

All data lives in `src/data/`. Files are plain JSON imported and Zod-validated at build time by `src/lib/data.ts`. Validation failures log a warning but do not block the build — client data varies widely.

| File | Required | Shape |
|------|----------|-------|
| `client.json` | Yes | `{ name, slug?, foundingYear?, license?, insured?, serviceArea?, industry?, delivery?, orderUrl?, socials?, domain?, logoUrl? }` |
| `brand.json` | Yes | `{ palette: {bg, surface, surfaceAlt, text, textMuted, accent, accentDim?, accentGlow?, border?, borderSubtle?}, nameFont, headingFont, bodyFont, monoFont?, nameTreatment?, typography?, spacing?, radius? }` |
| `theme.json` | Yes | `{ sections[], sectionOrder[]?, accentStyle?, faviconShape?, industry?, layout?, marqueeItems?, nav?, cta?, heroCta?, actionBar? }` |
| `contact.json` | Yes | `{ email, phoneForTel, phone? }` |
| `location.json` | Yes | `{ address, city, state, zip, country, mapLink, lat?, lng? }` |
| `hero.json` | Yes | `{ heroImage, heroTagline, heroSubtitle, fallbackImage?, heroVideo?, videoUrl?, videoPoster?, cta? }` |
| `seo.json` | Yes | `{ pageTitle, metaDescription, ogTitle, ogDescription, ogImage, canonicalUrl }` |
| `schema.json` | Yes | Free-form JSON-LD (injected as `<script type="application/ld+json">`) |
| `hours.json` | Yes | `{ days: [{ day, open, close }], secondaryHours? }` |
| `testimonials.json` | Yes | `{ reviewCount?, averageRating?, allReviewsUrl?, items?[] }` (aggregate-only for Google ToS) |
| `trustbar.json` | Yes | `{ items: [{ number, label }] }` |
| `faq.json` | Yes | `{ items: [{ question, answer, source? }] }` |
| `about.json` | Yes | `{ heading, text, image? }` |
| `cta.json` | Conditional (authors) | `{ text, buttonText, buttonHref, enabled? }` |
| `alert.json` | Yes | `{ enabled, text, startDate?, endDate? }` |
| `gallery.json` | Yes | `{ beholdFeedId?, images: [{ url, alt, fallbackUrl? }] }` |
| `menu.json` | Conditional (restaurants) | `{ categories: [{ name, items: [{ name, description?, price?, featured?, photo? }] }] }` |
| `projects.json` | Yes | `{ projects: [{ title, description, before, after, during?, service }] }` |
| `team.json` | Conditional (team-led) | `{ items: [{ name, brandName?, title?, bio?, photo?, bookingUrl?, bookingLabel?, hours?, specialties?, order? }] }` |
| `analytics.json` | Yes | `{ umamiWebsiteId, umamiScriptUrl }` — empty string = disabled |
| `book.json` | Conditional (authors) | `{ title, subtitle?, description?, blurb?, coverImage?, backCoverImage?, purchaseUrl?, formats?, publishDate?, publisher?, isbn? }` |
| `attributes.json` | Conditional | Free-form Places API attributes |
| `google-links.json` | Conditional | `{ directions?, writeReview?, allReviews?, photos?, place? }` |
| `_sources.json` | Internal | Source attribution for data fields |
| `_template-manifest.json` | Internal | Valid layout tokens, section IDs, component overrides |
| `process.json` | Optional | `{ heading?, eyebrow?, steps: [{ number?, title, description, icon? }] }` |
| `preview.json` | Optional | `{ businessName, slug }` — present = preview mode (disclaimer + noindex) |
| `tour.json` | Optional | `{ steps: [{ target, title, body }], businessName? }` — driver.js guided tour |
| `differentiator.json` | Optional | `{ heading?, eyebrow?, us?, them?, items? }` |

**Content collections** (markdown with frontmatter): `src/content/services/*.md` and `src/content/products/*.md`.

### Conditional Files

Per the platform Pipeline Data Contract, these are emitted only under specific conditions:

- `menu.json` — restaurants only
- `team.json` — team-led businesses only
- `cta.json`, `book.json` — authors only
- `attributes.json` — Places v2 responses with attribute data
- `google-links.json` — only written when links exist

Consumers defensively default to empty shapes via `import.meta.glob` in `src/lib/data.ts`, so absent files never break the build.

### Authoritative Schemas

Every data shape is encoded as a Zod schema in `src/lib/schemas.ts` and surfaced as a TypeScript type via `z.infer<>` in `src/lib/types.ts`. If a field is missing from this README but appears in the schemas, the schemas win. Update both whenever the contract changes.

---

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # Static output to dist/
npm run test       # Vitest unit tests
```

### Visual Regression Tests

Fixtures live in `tests/visual/fixtures/`. Run them with Playwright:

```bash
cd tests/visual
npx playwright test
```

---

## Versioning

Tags follow semver starting at `v0.1.0` (`0.x` = beta). Release with `npm version patch|minor|major` — the lifecycle hook syncs `_template-manifest.json` automatically. See `CLAUDE.md` for full versioning rules.

Client repos pin to a version via `.template-version`. Bumping all client repos:

```bash
npx tsx packages/pipeline/scripts/propagate-template.ts v0.2.0
```

## Client Repo Secrets

Set these in the client repo (or as org secrets):

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | CF API token with Pages permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

## License

Proprietary. Copyright (c) 2026 ZiaMade LLC. All rights reserved. See [LICENSE](LICENSE).

Client site data (JSON, images, markdown) remains the property of the respective business owner.
