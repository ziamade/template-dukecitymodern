/**
 * Issue #88 — quality-electric-llc dev_review render bug regressions.
 *
 * These assertions only make sense against the `quality-electric-style` fixture,
 * which seeds partial data designed to trigger each of the four bug surfaces
 * fixed in PR(s) referenced by issue #88. Run via:
 *
 *   FIXTURE_NAME=quality-electric-style npx playwright test specs/issue-88-render-bugs.spec.ts
 *
 * Asserts:
 *   1. Hours section renders the seven days from a pipeline-string `hoursWeekdays`
 *      payload — proves `normalizeHours()` accepts the `;` delimiter.
 *   2. Hero "open hours" badge does NOT show "Loading hours" — proves the empty-state
 *      copy was renamed AND that the parser populated `days[]` from the strings.
 *   3. Services section has exactly one ancestor with an `overflow` rule applied
 *      (the page itself). Proves the mobile horizontal carousel was removed.
 *   4. The process section renders with industry-default fallback steps when
 *      process.json is absent and `process` is in `theme.sectionOrder`. The
 *      original #88 behavior was to drop the section entirely; template#100
 *      replaced that with an industry-default fallback so "How It Works"
 *      always reflects something plausible while the pipeline's grounded
 *      process-author output (platform#698) is still preferred when present.
 *   5. Hero tagline is rendered via the BrandName component (`.bn` parts present)
 *      when brand.nameTreatment is set and no custom heroTagline is provided.
 */
import { test, expect } from '@playwright/test';
import { waitForIdle } from '../helpers/wait-for-idle.js';

const fixtureName = process.env.FIXTURE_NAME || 'standard-service';

// Only run against the targeted fixture — for any other fixture this spec is a no-op.
test.describe(`Issue #88 regressions (${fixtureName})`, () => {
  test.skip(
    fixtureName !== 'quality-electric-style',
    'Only runs against the quality-electric-style fixture',
  );

  test('AC#1: hours section renders all 7 days from pipeline-string format', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const hoursSection = page.locator('#hours');
    await expect(hoursSection).toBeVisible();
    const dayRows = hoursSection.locator('.hours-row');
    await expect(dayRows).toHaveCount(7);
  });

  test('AC#1: hero hours badge does not show "Loading hours"', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const badge = page.locator('#open-badge .badge-text');
    const text = (await badge.textContent())?.trim() || '';
    // It either shows the open/closed/24-7 status, or the "Hours not listed" empty state.
    // Either way, it must not contain the legacy "Loading hours" placeholder.
    expect(text).not.toMatch(/loading hours/i);
  });

  test('AC#2: services section exposes only the page as a scrollable ancestor', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const services = page.locator('#services');
    await services.scrollIntoViewIfNeeded();

    // Walk the ancestor chain from the services section to <html> and count
    // elements whose computed overflow{,X,Y} is auto/scroll.
    const overflowAncestors = await services.evaluate((el) => {
      const overflowing: string[] = [];
      let cur: Element | null = el;
      while (cur && cur !== document.documentElement) {
        const cs = getComputedStyle(cur);
        for (const prop of ['overflow', 'overflow-x', 'overflow-y']) {
          const v = cs.getPropertyValue(prop);
          if (v === 'auto' || v === 'scroll') {
            overflowing.push(`${cur.tagName.toLowerCase()}.${cur.className || '<noclass>'}:${prop}=${v}`);
            break;
          }
        }
        cur = cur.parentElement;
      }
      return overflowing;
    });

    // The services-grid carousel was the offender. The page's outer scroll lives on
    // <html>/<body> which the walk above stops before — so the expected count is 0
    // (no inner scrollable ancestor between services and the documentElement).
    expect(overflowAncestors).toEqual([]);
  });

  test('AC#3: process section renders industry-default steps when process.json is absent (template#100)', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    // Quality Electric's theme.json has industry "Electrical Services" and
    // `process` in sectionOrder, so the section must render. Without a
    // process.json file, the industry-default `trade` bucket supplies steps.
    const section = page.locator('#process');
    await expect(section).toBeVisible();
    // Defaults ship 3-4 steps — assert the section has at least three so we
    // catch a regression that would render the section empty.
    const cards = section.locator('.process-step-card');
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
  });

  test('AC#4: hero tagline renders BrandName parts when nameTreatment is set', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const tagline = page.locator('#hero .hero-tagline');
    await expect(tagline).toBeVisible();
    // BrandName.astro emits `<span class="bn ...">` with `<span class="bn__p ...">`
    // children, one per nameTreatment.parts entry.
    const parts = tagline.locator('.bn .bn__p');
    await expect(parts).toHaveCount(2);
    await expect(parts.first()).toContainText('Quality');
    await expect(parts.nth(1)).toContainText('Electric');
  });
});
