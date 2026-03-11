# Duke City Modern — 11ty Template

## Project Ethos

This is a reusable 11ty website template by **Duke City Digital** for local business clients. The aesthetic is **"High Desert Modern"** — Southwest-inspired warmth with clean, modern design. Every decision prioritizes:

- **Local business first** — designed for service businesses, not SaaS
- **CMS-editable** — clients can update content without touching code
- **Performance** — static HTML, optimized images, minimal JS
- **Accessibility** — semantic HTML, ARIA attributes, keyboard navigation

## Architecture

| Layer | Technology |
|-------|-----------|
| Generator | Eleventy 3.x (11ty) |
| Templates | Nunjucks (.html with `{% %}` syntax) |
| Styling | LESS → PostCSS (autoprefixer + cssnano) |
| JavaScript | esbuild (bundling + minification) |
| CMS | Decap CMS (admin/config.yml) + Pages CMS (.pages.yml) |
| Images | Sharp plugin (`{% getUrl %}` shortcode) |
| Hosting | Netlify (netlify.toml) |

### Directory Structure

```
src/
├── _data/           # Global data (JSON + client.js)
├── _includes/
│   ├── layouts/     # base.html (main template)
│   ├── sections/    # header.html, footer.html
│   └── components/  # Reusable partials
├── admin/           # Decap CMS config
├── assets/
│   ├── less/        # root.less, critical.less, local.less
│   ├── js/          # nav.js, script.js, dark.js
│   ├── images/      # Site images
│   ├── svgs/        # Icons
│   ├── fonts/       # Local font files
│   └── favicons/    # Favicon set
├── config/          # Build config (processors, filters, plugins)
├── content/         # Markdown content (services)
└── index.html       # Homepage
```

## Data Schemas

All CMS-editable data lives in `src/_data/`. Update the JSON, and the site rebuilds.

### client.js (code-only, not CMS-editable)
```js
{ name, foundingYear, license, socials: { facebook, instagram, google }, domain }
```

### contact.json
```json
{ "email": "string", "phoneForTel": "555-555-5555" }
```

### location.json
```json
{ "address": "string", "city": "string", "state": "XX", "zip": "00000", "country": "US", "mapLink": "URL" }
```

### hours.json
```json
{ "hoursWeekdays": "Mon–Fri: 9–5", "hoursWeekend": "Sat–Sun: Closed" }
```

### brand.json
```json
{ "primary": "#ec5b13", "primaryLight": "#f47a3e", "secondary": "#7a8d81", "secondaryLight": "#95a89d",
  "accent": "#d9b382", "headerColor": "#221610", "bodyTextColor": "#3a3a3a", "bodyTextColorWhite": "#f8f6f6",
  "offWhite": "#f8f6f6", "cream": "#f0eae0", "dark": "#221610", "medium": "#2c1a10",
  "accentDark": "#3a2a1e", "silver": "#a89f95" }
```
Injected as inline CSS variables in `base.html` — overrides `root.less` defaults. No recompile needed.

### hero.json
```json
{ "heroImage": "/assets/images/...", "heroTagline": "string", "heroSubtitle": "string" }
```

### alert.json
```json
{ "enabled": bool, "text": "string", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }
```

### testimonials.json
```json
{ "items": [{ "text": "...", "author": "Name", "initials": "XX", "role": "Verified Customer", "rating": 5, "source": "Google", "url": "#" }] }
```

### trustbar.json
```json
{ "items": [{ "number": "15+", "label": "Years Local" }] }
```

### Service Cards (src/content/services/*.md)
```yaml
---
title: "Service Name"
description: "Short description"
beforeImage: "/assets/images/..."
afterImage: "/assets/images/..."  # optional, enables hover effect
order: 1
---
```

## CMS Workflow

- **Local dev**: `npm start` runs both Eleventy dev server and `decap-server`
- **Admin panel**: Navigate to `/admin/` to use Decap CMS
- **Pages CMS**: Configured in `.pages.yml` for GitHub-based editing
- **Adding a new CMS field**: Update the JSON file → update `src/admin/config.yml` → update `.pages.yml` → update the template that uses it

## Brand Guidelines — "High Desert Modern"

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#ec5b13` | Terracotta — CTAs, active states, links |
| `--primaryLight` | `#f47a3e` | Hover states |
| `--secondary` | `#7a8d81` | Sage — secondary elements |
| `--accent` | `#d9b382` | Sand — subtle highlights |
| `--off-white` | `#f8f6f6` | Light backgrounds |
| `--midnight` / `--dark` | `#221610` | Dark backgrounds |
| `--cream` | `#f0eae0` | Warm neutral |

### Typography
- **Font**: Public Sans (300–900 weights via Google Fonts)
- **Headers**: `var(--headerFont)` — Public Sans, bold/black weight
- **Body**: `var(--bodyFont)` — Public Sans, regular weight
- **Sizing**: CSS clamp() for responsive scaling

### Design Patterns
- Glass-effect header: `backdrop-filter: blur(8px)`
- Rounded cards with subtle borders
- Dark gradient overlays on hero images
- Warm dark mode (brown-based, not blue-based)

### Tone
Warm, direct, community-rooted. Avoid corporate jargon. Write for neighbors, not shareholders.

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Dev server + CMS proxy |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |

## Coding Conventions

- Use CSS variables from `root.less` — never hardcode colors
- Use LESS nesting, keep selectors 3 levels deep max
- Nunjucks: use `{% block %}` inheritance from `base.html`
- CodeStitch utility classes: `.cs-topper`, `.cs-title`, `.cs-text`, `.cs-button-solid`
- Section comment format: `<!-- ====== Section Name ====== -->`
- Image paths: use `{% getUrl %}` shortcode for optimized images
