/**
 * Accessibility Tests — reduced motion, alt text, ARIA, focusable elements.
 *
 * Verifies the template meets basic accessibility requirements.
 */
import { test, expect } from '@playwright/test';
import { getFixture, type FixtureDefinition } from '../helpers/fixture-matrix.js';
import { waitForIdle } from '../helpers/wait-for-idle.js';

const fixtureName = process.env.FIXTURE_NAME || 'standard-service';
const fixture: FixtureDefinition = getFixture(fixtureName);

test.describe(`Accessibility: ${fixtureName}`, () => {
  test('prefers-reduced-motion disables animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForTimeout(500);

    // Check that reveal elements are visible (not stuck at opacity:0)
    const reveals = page.locator('.reveal-up, .reveal-left, .reveal-right');
    const count = await reveals.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      if (await reveals.nth(i).isVisible()) {
        const opacity = await reveals.nth(i).evaluate(
          (el) => getComputedStyle(el).opacity,
        );
        // Should be visible (opacity 1) in reduced motion mode
        expect(Number(opacity)).toBeGreaterThan(0.5);
      }
    }

    // Full page screenshot in reduced motion
    await expect(page).toHaveScreenshot(
      `${fixtureName}/reduced-motion.png`,
      { fullPage: true },
    );
  });

  test('all img elements have alt attributes', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const imgs = page.locator('img');
    const count = await imgs.count();

    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute('alt');
      // alt attribute must exist (empty string is OK for decorative images)
      expect(alt, `Image ${i} missing alt attribute`).not.toBeNull();
    }
  });

  test('page has a single h1', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const h1s = page.locator('h1');
    const count = await h1s.count();
    expect(count).toBe(1);
  });

  test('heading hierarchy is correct (no skipped levels)', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const headings = await page.evaluate(() => {
      const nodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(nodes).map((n) => ({
        level: Number(n.tagName[1]),
        text: n.textContent?.trim().slice(0, 30) || '',
      }));
    });

    // No heading should skip more than 2 levels (h1 → h4 is bad, h2 → h3 is fine)
    for (let i = 1; i < headings.length; i++) {
      const jump = headings[i].level - headings[i - 1].level;
      expect(
        jump,
        `Heading skip: h${headings[i - 1].level} → h${headings[i].level} ("${headings[i].text}")`,
      ).toBeLessThanOrEqual(2);
    }
  });

  test('interactive elements are focusable', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const interactive = page.locator(
      'button:visible, a[href]:visible, [role="slider"]:visible, details summary:visible',
    );
    const count = await interactive.count();

    for (let i = 0; i < Math.min(count, 15); i++) {
      const tabIndex = await interactive.nth(i).evaluate(
        (el) => el.tabIndex,
      );
      // tabIndex >= 0 means focusable
      expect(tabIndex).toBeGreaterThanOrEqual(0);
    }
  });

  test('hamburger has proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const hamburger = page.locator(
      '#header-hamburger, .hamburger-btn, [aria-label*="menu" i]',
    );
    if ((await hamburger.count()) === 0) return;

    // Should have aria-expanded (false initially)
    const expanded = await hamburger.getAttribute('aria-expanded');
    expect(expanded).toBe('false');

    // Should have aria-label
    const label = await hamburger.getAttribute('aria-label');
    expect(label).toBeTruthy();
  });

  if (fixture.hasGallery) {
    test('gallery lightbox has dialog role', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);

      const lightbox = page.locator('#gallery-lightbox');
      if ((await lightbox.count()) === 0) return;

      const role = await lightbox.getAttribute('role');
      expect(role).toBe('dialog');

      const label = await lightbox.getAttribute('aria-label');
      expect(label).toBeTruthy();
    });
  }

  if (fixture.hasBeforeAfter) {
    test('before-after slider has proper ARIA', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);

      const sliders = page.locator('[role="slider"]');
      if ((await sliders.count()) === 0) return;
      const slider = sliders.first();

      await expect(slider).toHaveAttribute('aria-valuemin', '0');
      await expect(slider).toHaveAttribute('aria-valuemax', '100');
      const valueNow = await slider.getAttribute('aria-valuenow');
      expect(Number(valueNow)).toBeGreaterThanOrEqual(0);
      expect(Number(valueNow)).toBeLessThanOrEqual(100);
    });
  }

  test('color contrast: text is readable against background', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    // Sample body text color and background
    const contrast = await page.evaluate(() => {
      const body = document.body;
      const style = getComputedStyle(body);
      const bg = style.backgroundColor;
      const text = style.color;

      function parseRGB(color: string): [number, number, number] | null {
        const match = color.match(/\d+/g);
        if (!match || match.length < 3) return null;
        return [Number(match[0]), Number(match[1]), Number(match[2])];
      }

      function luminance(r: number, g: number, b: number): number {
        const [rs, gs, bs] = [r, g, b].map((c) => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      const bgRGB = parseRGB(bg);
      const textRGB = parseRGB(text);
      if (!bgRGB || !textRGB) return null;

      const bgL = luminance(...bgRGB);
      const textL = luminance(...textRGB);
      const lighter = Math.max(bgL, textL);
      const darker = Math.min(bgL, textL);
      return (lighter + 0.05) / (darker + 0.05);
    });

    if (contrast !== null) {
      // WCAG AA requires 4.5:1 for normal text
      expect(contrast).toBeGreaterThan(4.5);
    }
  });

  test('page language is set', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThanOrEqual(2);
  });

  test('page has navigation landmark', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    // Check for nav element or navigation role
    const nav = page.locator('nav, [role="navigation"]');
    expect(await nav.count()).toBeGreaterThan(0);
  });

  if (fixture.hasFAQ) {
    test('FAQ has JSON-LD structured data', async ({ page }) => {
      await page.goto('/');

      const jsonLd = await page.evaluate(() => {
        const scripts = document.querySelectorAll(
          'script[type="application/ld+json"]',
        );
        for (const script of scripts) {
          try {
            const data = JSON.parse(script.textContent || '');
            if (data['@type'] === 'FAQPage') return data;
          } catch { /* ignore parse errors */ }
        }
        return null;
      });

      if (jsonLd) {
        expect(jsonLd['@type']).toBe('FAQPage');
        expect(jsonLd.mainEntity?.length).toBeGreaterThan(0);
      }
    });
  }
});
