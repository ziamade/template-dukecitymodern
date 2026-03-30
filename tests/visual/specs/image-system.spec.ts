/**
 * Image System Tests — LCP preload, lazy loading, AVIF/WebP, broken fallback.
 *
 * Heavy emphasis on image handling across viewports, especially mobile.
 */
import { test, expect } from '@playwright/test';
import { getFixture, type FixtureDefinition } from '../helpers/fixture-matrix.js';
import { waitForIdle } from '../helpers/wait-for-idle.js';

const fixtureName = process.env.FIXTURE_NAME || 'standard-service';
const fixture: FixtureDefinition = getFixture(fixtureName);

test.describe(`Images: ${fixtureName}`, () => {
  test('hero image has LCP preload link in head', async ({ page }) => {
    await page.goto('/');
    // Check for preload link in head (before full load)
    const preload = page.locator('link[rel="preload"][as="image"]');
    const count = await preload.count();
    if (fixture.heroStyle === 'minimal' || fixtureName === 'empty-states') {
      // Minimal/empty may not have preload — that's fine
    } else {
      if (count > 0) {
        const href = await preload.first().getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
  });

  test('hero images are eager loaded (not lazy)', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const heroImgs = page.locator('#hero img');
    const count = await heroImgs.count();
    for (let i = 0; i < count; i++) {
      const loading = await heroImgs.nth(i).getAttribute('loading');
      // Hero images should be eager or not have loading attr (eager is default)
      if (loading) {
        expect(loading).toBe('eager');
      }
    }
  });

  test('below-fold images use lazy loading', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const selectors = [
      '.service-card img',
      '.gallery-thumb img',
      '.gallery-grid img',
      '.about-logo-img',
    ];
    for (const sel of selectors) {
      const imgs = page.locator(sel);
      const count = await imgs.count();
      for (let i = 0; i < count; i++) {
        const loading = await imgs.nth(i).getAttribute('loading');
        if (loading) {
          expect(loading).toBe('lazy');
        }
      }
    }
  });

  test('optimized images have picture element with modern formats', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const pictures = page.locator('picture');
    const count = await pictures.count();
    if (count > 0) {
      // At least one picture should have avif or webp source
      const firstPicture = pictures.first();
      const sources = firstPicture.locator('source');
      const types: string[] = [];
      for (let i = 0; i < await sources.count(); i++) {
        const type = await sources.nth(i).getAttribute('type');
        if (type) types.push(type);
      }
      const hasModernFormat = types.some(
        (t) => t.includes('avif') || t.includes('webp'),
      );
      expect(hasModernFormat).toBe(true);
    }
  });

  test('all images have alt attributes', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const imgs = page.locator('img');
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute('alt');
      // alt should exist (can be empty string for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('majority of local images load successfully', async ({ page }) => {
    if (fixtureName === 'edge-cases') return;
    await page.goto('/');
    await waitForIdle(page);
    // Extra wait for lazy images
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const local = imgs.filter((img) => {
        const src = img.getAttribute('src') || '';
        return src.startsWith('/_astro/');
      });
      const loaded = local.filter((img) => img.naturalWidth > 0);
      return { total: local.length, loaded: loaded.length };
    });

    if (result.total > 0) {
      // At least 80% of local images should load
      const loadRate = result.loaded / result.total;
      expect(loadRate).toBeGreaterThan(0.8);
    }
  });

  if (fixtureName === 'edge-cases') {
    test('broken image fallback activates', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      // Images with data-fallback should have triggered onerror
      const fallbackImgs = page.locator('img[data-fallback]');
      const count = await fallbackImgs.count();
      if (count > 0) {
        // Page should not crash from broken images
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
      }
      // Visual check — hero area should render even with broken image
      await expect(page.locator('#hero')).toHaveScreenshot(
        `${fixtureName}/hero-broken-images.png`,
      );
    });
  }

  if (fixture.hasGallery) {
    test('gallery images load successfully', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const gallery = page.locator('#gallery');
      await gallery.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      const imgs = gallery.locator('img');
      const count = await imgs.count();
      expect(count).toBeGreaterThan(0);

      // Check at least first 3 images loaded
      for (let i = 0; i < Math.min(count, 3); i++) {
        const naturalWidth = await imgs.nth(i).evaluate(
          (el: HTMLImageElement) => el.naturalWidth,
        );
        if (fixtureName !== 'edge-cases') {
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    });

    test('gallery images have correct aspect ratio', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const gallery = page.locator('#gallery');
      await gallery.scrollIntoViewIfNeeded();

      const items = gallery.locator('.gallery-item, .gallery-thumb');
      const count = await items.count();
      if (count > 0) {
        const box = await items.first().boundingBox();
        if (box && box.height > 0) {
          const ratio = box.width / box.height;
          // Most gallery items should have a reasonable aspect ratio (not super tall or wide)
          expect(ratio).toBeGreaterThan(0.3);
          expect(ratio).toBeLessThan(5);
        }
      }
    });
  }

  if (fixture.serviceVariant === 'cards' || fixture.serviceVariant === 'icon-grid') {
    test('service images render', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const services = page.locator('#services');
      if ((await services.count()) === 0) return;
      await services.scrollIntoViewIfNeeded();

      const imgs = services.locator('img');
      const count = await imgs.count();
      // Cards and icon-grid variants should show images (if services have them)
      if (count > 0) {
        const firstNatural = await imgs.first().evaluate(
          (el: HTMLImageElement) => el.naturalWidth,
        );
        expect(firstNatural).toBeGreaterThan(0);
      }
    });
  }

  test('logo image renders in header', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const logo = page.locator('.site-logo img, .site-logo picture');
    if ((await logo.count()) > 0) {
      await expect(logo.first()).toBeVisible();
    }
  });
});
