# Template Foundations Polish — Implementation Plan

**Issue:** [ziamade/template-dukecitymodern#79](https://github.com/ziamade/template-dukecitymodern/issues/79)
**Spec:** `docs/superpowers/specs/2026-04-15-template-foundations-polish-design.md` in the platform repo (landed on master via platform PR #600)
**Sibling (pipeline-side):** [ziamade-platform#431](https://github.com/ziamade/ziamade-platform/issues/431) — happens in parallel; neither blocks the other because pipeline changes are additive and default to current behavior.

## Scope (this issue, per spec)

Three bundles:
1. **Modular foundation-token layer** — named tokens for type, spacing, radius. (Shadow, motion, z-index are spec'd but are a stretch goal; prioritize the three that ship the biggest UX lift and that the brand knobs route through.)
2. **Branded empty states + custom 404** — reviews / gallery / testimonials / menu / FAQ degrade to branded placeholders; 404 uses brand tokens.
3. **Expanded README + in-repo docs** — every variant key, token, and data file documented.

## Out of scope

- View Transitions — dropped per spec (single-page sites, zero payoff)
- Tailwind migration — dropped per spec
- Section variants (issue #80), Zod content collections (issue #81)
- Component-level visual redesign (later T1-T6 waves)
- Pipeline/data-contract shape changes (all three new `brand.json` fields are optional and ship in #431)

## PR split

Spec suggests 3 PRs. Bundle all three into a **single PR** for this issue. Reasons:
- One branch = one review cycle = faster merge
- Ordering dependency is strict (tokens → empty states → docs), so a single PR keeps history linear
- All three share the brand-injection layer so review context is coherent

If the subagent finds the diff growing past ~800 lines, split into two at the tokens/empty-states boundary. README expansion can stay in either PR.

## File-level plan

### Step 1 — Read the current brand-injection layer

- Locate `src/lib/brand.ts` (or equivalent) — this is where `brand.json` is read and turned into CSS variables.
- Locate `tokens.css` (or equivalent root CSS file where `:root { --... }` lives). If no such file exists, identify where theme tokens currently live (inline styles, per-component, global.css).
- Grep existing components for hardcoded `font-size`, `padding`, `border-radius` values. The named-token conversion in step 2 will replace these.

### Step 2 — Implement the type scale (1.25 ratio, fluid)

From the spec §Item 1a:

```css
:root {
  --text-base: clamp(1rem, 0.94rem + 0.3vw, 1.125rem);
  --text-caption:  clamp(0.75rem,  0.72rem + 0.15vw, 0.8125rem);
  --text-small:    clamp(0.875rem, 0.83rem + 0.22vw, 0.9375rem);
  --text-body:     var(--text-base);
  --text-lead:     clamp(1.125rem, 1.05rem + 0.38vw, 1.25rem);
  --text-h3:       clamp(1.375rem, 1.25rem + 0.63vw, 1.625rem);
  --text-h2:       clamp(1.75rem,  1.5rem  + 1.25vw, 2.25rem);
  --text-h1:       clamp(2.25rem,  1.9rem  + 1.75vw, 3rem);
  --text-display:  clamp(2.75rem,  2.2rem  + 2.75vw, 4rem);
  --leading-tight: 1.1;
  --leading-snug:  1.2;
  --leading-normal: 1.5;
  --leading-loose: 1.7;
}
```

- Add these tokens to `tokens.css` (or the equivalent root CSS file).
- Add brand-knob: `brand.json.typography.baseSize` (optional rem string). In `src/lib/brand.ts`, read it; if present, emit `--text-base: <value>;` inline via the CSS custom-property injection the template already does for palette/fonts. Do not allow per-step overrides — the ratio stays consistent.
- Walk every component under `src/components/` and swap hardcoded `font-size: ...` values to the matching named token (`var(--text-h1)`, etc.). If a component uses a size that doesn't fit the scale cleanly, pick the nearest named token — don't invent new ones.
- Test: build the site against an existing fixture (`pwtint` or similar in `packages/test-data` or wherever the template consumes fixture data), visually confirm typography still looks reasonable in light + dark modes.

### Step 3 — Implement the spacing scale

From spec §Item 1b:

```css
:root {
  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs:  0.75rem;
  --space-sm:  1rem;
  --space-md:  1.5rem;
  --space-lg:  2.5rem;
  --space-xl:  4rem;
  --space-2xl: 6rem;
  --space-3xl: 10rem;
}
```

- Add to `tokens.css`.
- Brand-knob: `brand.json.spacing.density` ∈ `"compact" | "comfortable" | "airy"`. In `src/lib/brand.ts`, read and apply a multiplier (0.85, 1.0, 1.15) to the whole scale. Default `comfortable`. Implementation pattern: emit each `--space-*` as a multiplied value (since CSS can't do `calc(var(--density) * 1rem)` at runtime without also injecting the multiplier, simplest is to emit the computed values directly in the theme CSS or wrap each in a `calc()` with an injected `--density-multiplier`).
- Swap hardcoded `padding` / `margin` / `gap` values across components to named tokens. Same rule: pick the nearest named token, don't invent.

### Step 4 — Implement the radius scale

- Define named radius tokens (spec does not enumerate values; derive a sensible 4-step scale). Suggested:
  - `--radius-sm: 0.25rem;` `--radius-md: 0.5rem;` `--radius-lg: 1rem;` `--radius-pill: 9999px;`
- Brand-knob: `brand.json.radius.style` ∈ `"sharp" | "rounded" | "soft"`. Multiplier or replacement scheme:
  - `sharp`: 0 / 2px / 4px / 9999px
  - `rounded` (default): values above
  - `soft`: 0.5rem / 1rem / 1.5rem / 9999px
- Apply to `tokens.css` + `src/lib/brand.ts`. Walk components, swap hardcoded `border-radius` values.

### Step 5 — Conditional empty states

For each of **reviews**, **gallery**, **testimonials**, **menu**, **FAQ**:

- Find the component that renders the section (typically `src/components/sections/<Name>.astro` or `src/pages/index.astro` inclusions).
- Current behavior: section either renders or is silently omitted when data is thin (e.g. gallery hides when `photos.length < 3`).
- New behavior: section renders a **branded placeholder** — a styled element using brand tokens (palette, type scale, radius) that says "Reviews coming soon" / "Gallery photos coming soon" / etc. One-line copy, centered, uses `--space-*` padding, `--radius-*` for any enclosing card, `--text-lead` for the copy, brand accent color for any icon or accent.
- If the business has *genuinely no data* for a section (e.g., a trades business has no menu — not even a placeholder), continue to hide the section entirely. The placeholder is for "data thin but present" cases like 1 review or 2 gallery photos.
- Rule from the spec: never a broken-looking half-section. Pick hide vs placeholder per section semantically.

### Step 6 — Custom 404 page

- `src/pages/404.astro` — create if missing, style if present with hardcoded values.
- Use brand tokens for palette, type scale, radius.
- Single message + link back to home. No menu, no footer clutter. One line of copy.
- Playwright check: navigate to a nonexistent path, confirm 404 renders with brand colors.

### Step 7 — Expand README + in-repo docs

- `README.md` — add sections:
  - **Variants** — list every `theme.json` variant key and what it controls. Example: `hero.variant: "1" | "2" | "3"` → describe each.
  - **Tokens** — list every `--text-*`, `--space-*`, `--radius-*` token with its purpose.
  - **Data files** — for each `src/data/*.json` the template consumes, list the shape and required fields. Cross-link to the platform-side `packages/pipeline/CLAUDE.md § Pipeline Data Contract` if appropriate.
  - **Brand knobs** — three new ones: `typography.baseSize`, `spacing.density`, `radius.style`. Defaults + semantics.
- Write it for a new contributor and a future-you returning six weeks from now. Tight prose, code-block examples, no fluff.

### Step 8 — Verify existing client repos still build

- The template is consumed at build-time by client site repos (per platform CLAUDE.md § Build-time template injection).
- Run the template build against an existing fixture that ships without the new brand knobs. Confirm the site renders identically to pre-change (tokens must default to the current look).
- If there's a snapshot / visual-diff CI on this repo, run it locally before pushing.

## Order

1. Read brand-injection layer (step 1)
2. Type scale (step 2) — biggest lever, do first
3. Spacing scale (step 3)
4. Radius scale (step 4)
5. Empty states (step 5)
6. 404 page (step 6)
7. README expansion (step 7)
8. Verify no-knobs backward-compat (step 8)

## Tests

- Tokens: visual Playwright pass (light + dark mode, desktop + mobile) against at least one fixture. Capture screenshots; commit to `tests/snapshots/` only if this repo does snapshot testing. If not, eyeball + describe in PR body.
- Empty states: feed in a fixture where each section is thin (1 review, 2 photos, 0 testimonials). Confirm placeholder renders, not a broken layout.
- 404: Playwright navigate to `/nonsense`, assert the 404 page.
- Backward compat: build the same fixture that's been rendering today with no knobs. Diff rendered output — should match.

## Risks / edge cases

- **Brand-injection layer unknown until read.** If `src/lib/brand.ts` emits CSS via some mechanism other than inline style (e.g. pre-compiled tokens file), token injection strategy may differ from what step 2-4 assumes. Adapt without re-spec'ing — the knob shape is fixed, the injection mechanism is template-internal.
- **Hardcoded values are many.** Expect 100+ sites across components. Don't try to refactor on the same pass — mechanical grep + replace, trust tests + Playwright to catch misses.
- **Fluid type + density multiplier interaction.** If the density multiplier applies to `--text-base` via `--density-multiplier`, the clamp() math breaks. Keep typography scale unaffected by density — density touches only spacing tokens.
- **Empty-state "never a broken-looking half-section" is judgment-heavy.** When in doubt, prefer the placeholder over hiding. Operator can always edit a section out if they disagree.

## PR

- Title: `feat(template): foundations polish — type/spacing/radius scales + empty states + 404 + docs (#79)`
- Branch: `feat/79-template-foundations-polish`
- Target: `main` (template uses `main`, not `master`)
- Test plan bullets: Playwright visual pass, 404 render, empty-state render with thin fixture, backward-compat check on an unchanged fixture.
