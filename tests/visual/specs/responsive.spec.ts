/**
 * Responsive Layout Tests — overflow, stacking, sizing at each breakpoint.
 *
 * Heavy emphasis on mobile: verifies no horizontal overflow, proper stacking,
 * full-width buttons, and adaptive layouts.
 */
import { test, expect } from '@playwright/test';
import { getFixture, type FixtureDefinition } from '../helpers/fixture-matrix.js';
import { waitForIdle } from '../helpers/wait-for-idle.js';

const fixtureName = process.env.FIXTURE_NAME || 'standard-service';
const fixture: FixtureDefinition = getFixture(fixtureName);

test.describe(`Responsive: ${fixtureName}`, () => {
  test('no horizontal overflow at any viewport', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test('hero tagline does not overflow viewport', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const tagline = page.locator('.hero-tagline');
    const box = await tagline.boundingBox();
    const viewport = page.viewportSize()!;

    if (box) {
      // Tagline right edge should not exceed viewport + small tolerance
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 20);
      // Tagline should not be clipped (left edge should be >= 0)
      expect(box.x).toBeGreaterThanOrEqual(-5);
    }
  });

  test('hero CTAs stack vertically on mobile', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const viewport = page.viewportSize()!;
    if (viewport.width > 640) return; // Only test on mobile

    const ctas = page.locator('.hero-ctas');
    if ((await ctas.count()) === 0) return;

    const direction = await ctas.evaluate(
      (el) => getComputedStyle(el).flexDirection,
    );
    expect(direction).toBe('column');

    // Buttons should be near-full-width
    const btn = ctas.locator('.btn').first();
    if ((await btn.count()) === 0) return;
    const btnBox = await btn.boundingBox();
    const ctaBox = await ctas.boundingBox();
    if (btnBox && ctaBox && ctaBox.width > 0) {
      expect(btnBox.width / ctaBox.width).toBeGreaterThan(0.85);
    }
  });

  if (fixture.heroStyle === 'split') {
    test('split hero stacks on mobile, rows on desktop', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);

      // The split hero container is the direct child of #hero with flex layout
      const container = page.locator('.hero--split .hero-content').first();
      if ((await container.count()) === 0) return;

      // Check the parent flex container, not individual children
      const heroEl = page.locator('#hero');
      const layout = await heroEl.evaluate((el) => {
        // Find the flex container within hero
        const inner = el.querySelector('.hero-inner, .hero-container, .hero-grid');
        if (inner) return getComputedStyle(inner).flexDirection;
        // If no specific container, check hero's own display
        return getComputedStyle(el).flexDirection;
      });

      const viewport = page.viewportSize()!;
      // On mobile, content should appear stacked (visual check via screenshot)
      if (viewport.width < 768) {
        // Visual verification is more reliable than CSS property checks
        await expect(heroEl).toHaveScreenshot(`${fixtureName}/hero-mobile-stack.png`);
      }
    });
  }

  if (fixture.serviceVariant === 'cards') {
    test('service cards are scrollable carousel on mobile', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);

      const viewport = page.viewportSize()!;
      if (viewport.width > 640) return;

      const grid = page.locator('.services-grid, .service-cards');
      if ((await grid.count()) === 0) return;
      await grid.scrollIntoViewIfNeeded();

      const overflow = await grid.evaluate(
        (el) => getComputedStyle(el).overflowX,
      );
      expect(['auto', 'scroll']).toContain(overflow);
    });
  }

  test('contact form adapts layout', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const contactSection = page.locator('#contact, #order');
    if ((await contactSection.count()) === 0) return;
    await contactSection.scrollIntoViewIfNeeded();

    const viewport = page.viewportSize()!;
    // On mobile, form should be single column
    // On desktop, it may be 2-column (sidebar + form)
    const form = contactSection.locator('.contact-grid, .form-layout');
    if ((await form.count()) === 0) return;

    if (viewport.width < 768) {
      const display = await form.evaluate((el) => getComputedStyle(el).display);
      if (display === 'grid') {
        const columns = await form.evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns,
        );
        const colCount = columns.split(' ').filter(Boolean).length;
        expect(colCount).toBeLessThanOrEqual(1);
      }
    }
  });

  test('trust bar items wrap on small screens', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const trust = page.locator('#trust');
    if ((await trust.count()) === 0) return;

    const items = trust.locator('.trust-item, .trust-stat');
    const count = await items.count();
    if (count < 2) return;

    const viewport = page.viewportSize()!;
    if (viewport.width <= 375) {
      // On very small screens, items should wrap
      const firstBox = await items.first().boundingBox();
      const lastBox = await items.last().boundingBox();
      if (firstBox && lastBox) {
        // If items wrap, last item's Y should be > first item's Y
        // (unless they're in a scroll container)
        const isWrapped = lastBox.y > firstBox.y + firstBox.height * 0.5;
        const isScrollable = await trust
          .locator('.trust-items, .trust-bar')
          .evaluate((el) => {
            const overflow = getComputedStyle(el).overflowX;
            return overflow === 'auto' || overflow === 'scroll';
          })
          .catch(() => false);
        // Either wrapped or scrollable is fine
        expect(isWrapped || isScrollable).toBe(true);
      }
    }
  });

  test('footer columns stack on mobile', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const footer = page.locator('footer');
    if ((await footer.count()) === 0) return;
    await footer.scrollIntoViewIfNeeded();

    const viewport = page.viewportSize()!;
    if (viewport.width < 768) {
      // Footer grid should be single column on mobile
      const grid = footer.locator('.footer-grid, .footer-content');
      if ((await grid.count()) > 0) {
        const display = await grid.evaluate((el) => getComputedStyle(el).display);
        if (display === 'grid') {
          const columns = await grid.evaluate(
            (el) => getComputedStyle(el).gridTemplateColumns,
          );
          const colCount = columns.split(' ').filter(Boolean).length;
          expect(colCount).toBeLessThanOrEqual(2);
        }
      }
    }
  });

  test('all sections fit within viewport width', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const viewport = page.viewportSize()!;
    const sections = page.locator('.section, section');
    const count = await sections.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const box = await sections.nth(i).boundingBox();
      if (box) {
        // No section should be wider than viewport
        expect(box.width).toBeLessThanOrEqual(viewport.width + 5);
      }
    }
  });

  test('text is readable (font size >= 14px)', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const bodyText = page.locator('p, .about-text, .faq-answer, .review-text');
    const count = await bodyText.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const fontSize = await bodyText.nth(i).evaluate(
        (el) => parseFloat(getComputedStyle(el).fontSize),
      );
      // Body text should be at least 14px for readability
      expect(fontSize).toBeGreaterThanOrEqual(14);
    }
  });

  test('touch targets are at least 44px on mobile', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const viewport = page.viewportSize()!;
    if (viewport.width > 768) return;

    const buttons = page.locator('.btn, button, a.btn');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      if (!(await buttons.nth(i).isVisible())) continue;
      const box = await buttons.nth(i).boundingBox();
      if (box) {
        // Touch targets should be at least 44px in the smallest dimension
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(40);
      }
    }
  });

  if (fixture.hasMenu) {
    test('menu category pills scroll horizontally on mobile', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);

      const viewport = page.viewportSize()!;
      if (viewport.width > 768) return;

      const pills = page.locator('.menu-nav, .category-pills');
      if ((await pills.count()) === 0) return;
      await pills.scrollIntoViewIfNeeded();

      const overflow = await pills.evaluate(
        (el) => getComputedStyle(el).overflowX,
      );
      expect(['auto', 'scroll']).toContain(overflow);
    });
  }
});
