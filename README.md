# Duke City Modern - Astro Template

A modern, fast small business website template built with [Astro](https://astro.build/). Used by ZiaMade to generate client sites via the automated pipeline.

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Astro 5.x (static output) |
| Styling | Tailwind CSS v4 |
| CMS | Pages CMS (pagescms.org, Git-based) |
| Hosting | Cloudflare Pages (Direct Upload via GitHub Actions) |
| Images | Astro Image (`astro:assets`), Sharp optimization |

## Project Structure

```
.
├── .github/workflows/       # CI/CD: preview, production, and build+deploy
├── .pages.yml               # Pages CMS configuration
├── src/
│   ├── assets/              # Images, fonts, favicons, SVGs
│   ├── components/          # Astro components (.astro)
│   ├── content/             # Content collections (services, blog)
│   ├── data/                # JSON data files (contact, hours, brand, etc.)
│   ├── layouts/             # Page layouts
│   ├── pages/               # File-based routing
│   └── styles/              # Global CSS / Tailwind
├── public/                  # Static assets (copied as-is to output)
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the Astro dev server at `http://localhost:4321`.

### Build

```bash
npm run build
```

Outputs static files to `dist/`.

### Preview

```bash
npm run preview
```

Serves the built `dist/` directory locally for testing before deployment.

## Data Files

Business data lives in `src/data/` as JSON files:

| File | Contents |
|------|----------|
| `contact.json` | Email, phone number |
| `location.json` | Address, city, state, ZIP, Google Maps link |
| `hours.json` | Structured business hours by day |
| `brand.json` | Color palette (primary, secondary, accent, backgrounds) |
| `hero.json` | Hero image, tagline, subtitle |
| `testimonials.json` | Customer reviews |
| `trustbar.json` | Trust bar statistics |
| `alert.json` | Optional alert banner |
| `seo.json` | SEO metadata |
| `schema.json` | Schema.org structured data |

These files are editable via Pages CMS (configured in `.pages.yml`).

## Deployment

Deployment is handled by GitHub Actions via Cloudflare Pages Direct Upload:

- **Preview** (`deploy-preview.yml`): Deploys on push to `main` as a preview build.
- **Production** (`deploy-production.yml`): Manual trigger via `workflow_dispatch`.
- **Build + Deploy** (`deploy.yml`): Full build pipeline on push to `main`.

### Required Secrets

Set these in your GitHub repository settings:

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## Content Management

Clients manage their site content through [Pages CMS](https://pagescms.org/), a Git-based CMS. The configuration is in `.pages.yml`. Editable sections include:

- Alert banner
- Contact info
- Location and maps
- Business hours
- Brand colors
- Hero section
- Customer reviews
- Trust bar stats
- Services (markdown collection)

Media uploads go to `src/assets/images/`.

## License

Proprietary. Part of the ZiaMade platform.
