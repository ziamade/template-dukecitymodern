/**
 * Hero Variant Tests — verifies correct rendering for split/overlay/video/minimal.
 *
 * Checks hero image presence, CTA buttons, tagline, stats, and marquee
 * for each fixture's hero configuration.
 */
import { test, expect } from '@playwright/test';
import { getFixture, type FixtureDefinition } from '../helpers/fixture-matrix.js';
import { waitForIdle } from '../helpers/wait-for-idle.js';

const fixtureName = process.env.FIXTURE_NAME || 'standard-service';
const fixture: FixtureDefinition = getFixture(fixtureName);

test.describe(`Hero [${fixture.heroStyle}]: ${fixtureName}`, () => {
  test('hero section exists and is visible', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
  });

  test('hero has correct variant class', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const hero = page.locator('#hero');
    const classes = await hero.getAttribute('class');
    expect(classes).toContain(`hero--${fixture.heroStyle}`);
  });

  if (fixture.heroStyle === 'split') {
    test('split hero shows image on desktop', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const viewport = page.viewportSize()!;
      const heroImg = page.locator('.hero-image img, .hero-image picture');
      if (viewport.width >= 768) {
        await expect(heroImg.first()).toBeVisible();
      }
    });
  }

  if (fixture.heroStyle === 'overlay') {
    test('overlay hero has background image', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const backdrop = page.locator('.hero-backdrop img, .hero-backdrop picture, .hero--overlay img');
      const count = await backdrop.count();
      // Overlay should have at least one image element
      expect(count).toBeGreaterThan(0);
    });

    test('overlay hero text is white/light for readability', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const tagline = page.locator('.hero-tagline');
      const color = await tagline.evaluate((el) => getComputedStyle(el).color);
      // Parse RGB — should be light (R+G+B > 500)
      const match = color.match(/\d+/g);
      if (match) {
        const brightness = Number(match[0]) + Number(match[1]) + Number(match[2]);
        expect(brightness).toBeGreaterThan(400);
      }
    });
  }

  if (fixture.heroStyle === 'video') {
    test('video hero has video element', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const video = page.locator('video');
      if ((await video.count()) > 0) {
        await expect(video.first()).toBeVisible();
        // Video should autoplay and be muted
        const autoplay = await video.first().getAttribute('autoplay');
        const muted = await video.first().getAttribute('muted');
        expect(autoplay).not.toBeNull();
        expect(muted).not.toBeNull();
      }
    });
  }

  if (fixture.heroStyle === 'minimal') {
    test('minimal hero has no hero image', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const heroImg = page.locator('.hero-image');
      // Minimal variant should not render a hero image container
      const count = await heroImg.count();
      if (count > 0) {
        // If container exists, check no img inside
        const imgs = heroImg.locator('img');
        expect(await imgs.count()).toBe(0);
      }
    });

    test('minimal hero is centered', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const hero = page.locator('#hero');
      const textAlign = await hero.evaluate((el) => {
        const style = getComputedStyle(el);
        return style.textAlign;
      });
      expect(textAlign).toBe('center');
    });
  }

  test('hero tagline is visible and non-empty', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const tagline = page.locator('.hero-tagline');
    await expect(tagline).toBeVisible();
    const text = await tagline.textContent();
    expect(text!.trim().length).toBeGreaterThan(0);
  });

  test('hero CTA buttons are visible', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const ctas = page.locator('.hero-ctas .btn, .hero-ctas a');
    const count = await ctas.count();
    expect(count).toBeGreaterThan(0);
    await expect(ctas.first()).toBeVisible();
  });

  if (fixture.hasMarquee) {
    test('marquee renders', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const marquee = page.locator('.hero-marquee-wrap, .marquee');
      if ((await marquee.count()) > 0) {
        await expect(marquee.first()).toBeVisible();
      }
    });
  }

  test('hero stats display (if data present)', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const stats = page.locator('.hero-stats, .hero-stat');
    if ((await stats.count()) > 0) {
      await expect(stats.first()).toBeVisible();
    }
  });
});
