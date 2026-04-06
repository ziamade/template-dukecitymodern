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
├── components/        # 31 Astro components (sections + layout)
├── content/           # Markdown collections (services/, products/)
├── data/              # JSON data files (24 files)
├── layouts/           # BaseLayout with theme CSS injection
├── lib/               # Brand theming, image resolver, types
├── pages/             # index.astro (data-driven section renderer)
├── scripts/           # GSAP animation controller
└── styles/            # tokens, base, layout, components, atmosphere, animations
tests/visual/          # Playwright visual regression (10 fixtures x 7 viewports)
```

## Section System

Sections are driven by `theme.json`. The page renderer loops over `sections` and renders matching components:

```json
{
  "sections": [
    { "id": "hero", "variant": "overlay" },
    { "id": "trust", "variant": "badges" },
    { "id": "services", "variant": "split" },
    { "id": "products" },
    { "id": "cta" },
    { "id": "faq" },
    { "id": "contact" },
    { "id": "about" }
  ]
}
```

### Available Sections

| Section | Variants | Data Source |
|---------|----------|-------------|
| `hero` | split, overlay, video, minimal | `hero.json` |
| `trust` | badges, stats | `trustbar.json` |
| `services` | cards, icon-grid, compact, split | `content/services/*.md` |
| `products` | -- | `content/products/*.md` |
| `cta` | -- | `cta.json` |
| `reviews` | scroll | `testimonials.json` |
| `faq` | -- | `faq.json` |
| `gallery` | masonry, scroll | `gallery.json` (+ optional Behold feed) |
| `projects` | -- | `projects.json` |
| `process` | -- | (hardcoded steps) |
| `menu` | -- | `menu.json` |
| `contact` | QuoteForm / OrderVisit (auto) | `contact.json` |
| `about` | -- | `about.json`, `location.json` |
| `hours` | -- | `hours.json` |
| `beforeAfter` | -- | (content collection) |
| `differentiator` | -- | (content collection) |
| `marquee` | -- | `theme.json` marqueeItems |
| `team` | -- | `team.json` |

### Layout Tokens

`theme.json` also controls the visual design system:

```json
{
  "layout": {
    "heroStyle": "overlay",
    "atmosphereLevel": "rich",
    "motionIntensity": "standard",
    "headerStyle": "glass",
    "cardStyle": "elevated",
    "cardRadius": "soft",
    "buttonStyle": "rounded",
    "buttonVariant": "tactile",
    "dividerStyle": "glow",
    "sectionPattern": "gradient"
  }
}
```

All valid values are documented in `src/data/_template-manifest.json`.

## Data Files

| File | Contents |
|------|----------|
| `brand.json` | Color palette (light + dark), font families |
| `client.json` | Business name, industry, slug |
| `contact.json` | Phone, email, social links |
| `location.json` | Address, map link, service area |
| `hero.json` | Headline, tagline, hero image, CTA |
| `theme.json` | Section order, variants, layout tokens, marquee |
| `cta.json` | CTA band text, button, enabled flag |
| `hours.json` | Business hours by day |
| `faq.json` | Question/answer pairs |
| `gallery.json` | Image list + optional Behold feed ID |
| `testimonials.json` | Customer reviews |
| `trustbar.json` | Trust bar items or stats |
| `seo.json` | Page title, meta description, OG tags |
| `schema.json` | JSON-LD structured data |
| `alert.json` | Banner text, dates, enabled flag |
| `menu.json` | Restaurant menu categories + items |
| `team.json` | Team members (barbers, stylists, etc.) |
| `projects.json` | Portfolio/project gallery |

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # Static output to dist/
npm run test       # Vitest unit tests
```

### Visual Regression Tests

10 fixture configurations x 7 viewport sizes. Fixtures live in `tests/visual/fixtures/` and cover service businesses, restaurants, edge cases, light/dark palettes, and all layout variants.

```bash
cd tests/visual
npx playwright test
```

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
