/**
 * Gallery Tests — masonry columns, scroll snap, lightbox open/nav/close.
 *
 * Tests both gallery variants and their responsive behavior.
 */
import { test, expect } from '@playwright/test';
import { getFixture, type FixtureDefinition } from '../helpers/fixture-matrix.js';
import { waitForIdle } from '../helpers/wait-for-idle.js';

const fixtureName = process.env.FIXTURE_NAME || 'standard-service';
const fixture: FixtureDefinition = getFixture(fixtureName);

test.describe(`Gallery: ${fixtureName}`, () => {
  test.skip(!fixture.hasGallery, 'No gallery in this fixture');

  if (fixture.galleryVariant === 'masonry') {
    test('masonry gallery renders as grid', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const grid = page.locator('.gallery-grid');
      if ((await grid.count()) === 0) return;
      await grid.scrollIntoViewIfNeeded();

      const display = await grid.evaluate((el) => getComputedStyle(el).display);
      expect(display).toBe('grid');

      await expect(grid).toHaveScreenshot(`${fixtureName}/gallery-masonry.png`);
    });

    test('masonry adapts columns by viewport', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const grid = page.locator('.gallery-grid');
      if ((await grid.count()) === 0) return;
      await grid.scrollIntoViewIfNeeded();

      const viewport = page.viewportSize()!;
      const gridColumns = await grid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns,
      );
      const columnCount = gridColumns.split(' ').filter(Boolean).length;

      if (viewport.width < 768) {
        // Mobile: should be 1-2 columns
        expect(columnCount).toBeLessThanOrEqual(2);
      } else {
        // Desktop: should use multi-column layout (12-col grid with spans)
        expect(columnCount).toBeGreaterThanOrEqual(2);
      }
    });
  }

  if (fixture.galleryVariant === 'scroll') {
    test('scroll gallery has horizontal overflow', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const scroll = page.locator('.gallery-scroll');
      if ((await scroll.count()) === 0) return;
      await scroll.scrollIntoViewIfNeeded();

      const overflow = await scroll.evaluate(
        (el) => getComputedStyle(el).overflowX,
      );
      expect(['auto', 'scroll']).toContain(overflow);

      await expect(scroll).toHaveScreenshot(`${fixtureName}/gallery-scroll.png`);
    });

    test('scroll gallery has snap behavior', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const scroll = page.locator('.gallery-scroll');
      if ((await scroll.count()) === 0) return;
      await scroll.scrollIntoViewIfNeeded();

      const snapType = await scroll.evaluate(
        (el) => getComputedStyle(el).scrollSnapType,
      );
      expect(snapType).toContain('x');
    });

    test('scroll gallery items size adapts to viewport', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const items = page.locator('.gallery-scroll .gallery-item');
      if ((await items.count()) === 0) return;

      const viewport = page.viewportSize()!;
      const itemBox = await items.first().boundingBox();
      if (itemBox) {
        if (viewport.width < 640) {
          // Mobile: items should be ~80% of viewport width
          expect(itemBox.width).toBeGreaterThan(viewport.width * 0.6);
          expect(itemBox.width).toBeLessThan(viewport.width * 0.95);
        } else if (viewport.width < 1024) {
          // Tablet: items should be ~45% of viewport
          expect(itemBox.width).toBeLessThan(viewport.width * 0.6);
        }
      }
    });
  }

  test('gallery lightbox opens on click', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    // Wait for lightbox JS to initialize
    await page.waitForTimeout(1000);

    const thumbs = page.locator('.gallery-thumb');
    if ((await thumbs.count()) === 0) return;
    await thumbs.first().scrollIntoViewIfNeeded();
    await thumbs.first().click();
    await page.waitForTimeout(500);

    const lightbox = page.locator('#gallery-lightbox');
    if ((await lightbox.count()) === 0) return;

    const hidden = await lightbox.getAttribute('aria-hidden');
    expect(hidden).toBe('false');

    await expect(lightbox).toHaveScreenshot(
      `${fixtureName}/gallery-lightbox.png`,
    );

    // Close lightbox
    const closeBtn = page.locator('.lightbox-close');
    if ((await closeBtn.count()) > 0) {
      await closeBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('gallery lightbox navigation works', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    await page.waitForTimeout(1000);

    const thumbs = page.locator('.gallery-thumb');
    if ((await thumbs.count()) < 2) return;
    await thumbs.first().scrollIntoViewIfNeeded();
    await thumbs.first().click();
    await page.waitForTimeout(500);

    const lightboxImg = page.locator('#gallery-lightbox img');
    if ((await lightboxImg.count()) === 0) return;
    const firstSrc = await lightboxImg.first().getAttribute('src');

    const nextBtn = page.locator('.lightbox-next');
    if ((await nextBtn.count()) > 0) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      const secondSrc = await lightboxImg.first().getAttribute('src');
      expect(firstSrc).not.toBe(secondSrc);
    }
  });

  test('gallery lightbox closes with Escape key', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    await page.waitForTimeout(1000);

    const thumbs = page.locator('.gallery-thumb');
    if ((await thumbs.count()) === 0) return;
    await thumbs.first().scrollIntoViewIfNeeded();
    await thumbs.first().click();
    await page.waitForTimeout(500);

    const lightbox = page.locator('#gallery-lightbox');
    if ((await lightbox.count()) === 0) return;

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const hidden = await lightbox.getAttribute('aria-hidden');
    expect(hidden).toBe('true');
  });
});
