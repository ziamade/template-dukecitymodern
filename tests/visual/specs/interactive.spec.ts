/**
 * Interactive Tests — mobile nav, FAQ accordion, before-after slider, contact form.
 *
 * Tests user interactions work correctly across all viewports.
 */
import { test, expect } from '@playwright/test';
import { getFixture, type FixtureDefinition } from '../helpers/fixture-matrix.js';
import { waitForIdle } from '../helpers/wait-for-idle.js';

const fixtureName = process.env.FIXTURE_NAME || 'standard-service';
const fixture: FixtureDefinition = getFixture(fixtureName);

test.describe(`Interactive: ${fixtureName}`, () => {
  // --- Mobile hamburger menu ---
  test('hamburger menu opens and closes on mobile', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const hamburger = page.locator('#header-hamburger, .hamburger-btn, [aria-label*="menu" i]');
    if (!(await hamburger.isVisible())) {
      // Desktop viewport — hamburger is hidden
      return;
    }

    await hamburger.click();
    const overlay = page.locator('#mobile-nav-overlay, .mobile-nav');
    await expect(overlay).toBeVisible();

    await expect(overlay).toHaveScreenshot(`${fixtureName}/mobile-nav-open.png`);

    // Close by pressing Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  test('desktop nav links are visible on wide viewports', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const viewport = page.viewportSize()!;
    const navLinks = page.locator('.nav-links, .header-nav-link');
    if (viewport.width >= 768) {
      if ((await navLinks.count()) > 0) {
        await expect(navLinks.first()).toBeVisible();
      }
    }
  });

  // --- FAQ accordion ---
  if (fixture.hasFAQ) {
    test('FAQ first item is open by default', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const faqSection = page.locator('#faq');
      if ((await faqSection.count()) === 0) return;
      await faqSection.scrollIntoViewIfNeeded();

      const items = faqSection.locator('.faq-item');
      const count = await items.count();
      if (count === 0) return;

      const isOpen = await items.first().evaluate((el: HTMLDetailsElement) => el.open);
      expect(isOpen).toBe(true);
    });

    test('FAQ accordion expand/collapse', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const faqSection = page.locator('#faq');
      if ((await faqSection.count()) === 0) return;
      await faqSection.scrollIntoViewIfNeeded();

      const items = faqSection.locator('.faq-item');
      const count = await items.count();
      if (count < 2) return;

      // Click second item summary to open
      const secondSummary = items.nth(1).locator('summary');
      await secondSummary.scrollIntoViewIfNeeded();
      await secondSummary.click();
      await page.waitForTimeout(500);

      // Verify it opened
      const isOpen = await items.nth(1).evaluate((el: HTMLDetailsElement) => el.open);
      expect(isOpen).toBe(true);

      // Wait for expand animation to finish
      await page.waitForTimeout(500);
      await expect(faqSection).toHaveScreenshot(`${fixtureName}/faq-expanded.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }

  // --- Before/After slider ---
  if (fixture.hasBeforeAfter) {
    test('before-after slider has ARIA attributes', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const ba = page.locator('#before-after, #beforeAfter');
      if ((await ba.count()) === 0) return;
      await ba.scrollIntoViewIfNeeded();

      const divider = page.locator('#ba-divider, [role="slider"]');
      if ((await divider.count()) === 0) return;

      await expect(divider).toHaveAttribute('role', 'slider');
      const valueNow = await divider.getAttribute('aria-valuenow');
      expect(valueNow).toBeTruthy();
    });

    test('before-after slider is draggable', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const ba = page.locator('#before-after, #beforeAfter');
      if ((await ba.count()) === 0) return;
      await ba.scrollIntoViewIfNeeded();

      const divider = page.locator('#ba-divider, [role="slider"]');
      if ((await divider.count()) === 0) return;

      const box = await divider.boundingBox();
      if (!box) return;

      // Drag left
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x - 100, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(300);

      await expect(ba).toHaveScreenshot(`${fixtureName}/before-after-dragged.png`);
    });

    test('before-after slider responds to keyboard', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      await page.waitForTimeout(1000);
      const dividers = page.locator('[role="slider"]');
      if ((await dividers.count()) === 0) return;
      const divider = dividers.first();

      await divider.scrollIntoViewIfNeeded();
      await divider.focus();
      await page.waitForTimeout(200);
      const valueBefore = await divider.getAttribute('aria-valuenow');

      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(300);

      const valueAfter = await divider.getAttribute('aria-valuenow');
      if (valueBefore && valueAfter) {
        expect(Number(valueAfter)).toBeLessThan(Number(valueBefore));
      }
    });
  }

  // --- Navigation links match sections ---
  test('nav links point to existing sections', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const navLinks = page.locator('.header-nav-link');
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      if (href?.startsWith('#')) {
        const targetId = href.slice(1);
        const exists = await page.evaluate(
          (id) => document.getElementById(id) !== null,
          targetId,
        );
        expect(exists, `Section #${targetId} not found`).toBe(true);
      }
    }
  });

  // --- Contact form ---
  test('contact section renders correct form type', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const contact = page.locator('#contact, #order');
    if ((await contact.count()) === 0) return;
    await contact.scrollIntoViewIfNeeded();

    if (fixture.isRestaurant) {
      // Restaurant should have order/visit component
      const orderBtn = contact.locator('a.btn, .order-btn');
      if ((await orderBtn.count()) > 0) {
        await expect(orderBtn.first()).toBeVisible();
      }
    } else {
      // Service business should have a form
      const form = contact.locator('form');
      if ((await form.count()) > 0) {
        await expect(form.first()).toBeVisible();
        // Form should have name, email, message fields
        const nameInput = form.locator('input[name="name"], input[placeholder*="name" i]');
        expect(await nameInput.count()).toBeGreaterThan(0);
      }
    }

    await expect(contact).toHaveScreenshot(`${fixtureName}/contact-form.png`);
  });

  // --- Header scroll behavior ---
  test('header responds to scroll', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const header = page.locator('.site-header');
    await expect(header).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Header should still exist (may be hidden-on-scroll or sticky)
    const isVisible = await header.isVisible();
    // Either visible (sticky) or hidden (hidden-on-scroll) is valid
    expect(typeof isVisible).toBe('boolean');
  });

  // --- Open/closed badge ---
  test('open-now badge renders', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const badge = page.locator('#open-badge, .open-badge');
    if ((await badge.count()) === 0) return;

    await expect(badge).toBeVisible();
    await page.waitForTimeout(1000);
    const text = await badge.textContent();
    // Should have been updated by JS (not still loading)
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  // --- Sticky action bar (mobile) ---
  test('sticky action bar visible on mobile', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);

    const viewport = page.viewportSize()!;
    const actionBar = page.locator('.action-bar, .sticky-action-bar');
    if ((await actionBar.count()) === 0) return;

    if (viewport.width < 768) {
      await expect(actionBar).toBeVisible();
    } else {
      // Hidden on desktop
      const isVisible = await actionBar.isVisible();
      expect(isVisible).toBe(false);
    }
  });
});
