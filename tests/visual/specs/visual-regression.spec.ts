/**
 * Visual Regression — full-page + per-section screenshots.
 *
 * Each fixture gets full-page and individual section screenshots at all 7 viewports.
 * These are the primary visual regression gates — any CSS change that affects
 * layout, spacing, or colors will be caught here.
 */
import { test, expect } from '@playwright/test';
import { getFixture, type FixtureDefinition } from '../helpers/fixture-matrix.js';
import { waitForIdle } from '../helpers/wait-for-idle.js';

const fixtureName = process.env.FIXTURE_NAME || 'standard-service';
const fixture: FixtureDefinition = getFixture(fixtureName);

test.describe(`Visual: ${fixtureName}`, () => {
  test('full page screenshot', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    await expect(page).toHaveScreenshot(`${fixtureName}/full-page.png`, {
      fullPage: true,
    });
  });

  test('hero section', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const hero = page.locator('#hero');
    await expect(hero).toHaveScreenshot(`${fixtureName}/section-hero.png`);
  });

  test('trust section', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const trust = page.locator('#trust');
    if ((await trust.count()) === 0) return;
    await expect(trust).toHaveScreenshot(`${fixtureName}/section-trust.png`);
  });

  if (fixture.serviceVariant !== 'none') {
    test('services section', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const services = page.locator('#services');
      if ((await services.count()) === 0) return;
      await services.scrollIntoViewIfNeeded();
      await expect(services).toHaveScreenshot(`${fixtureName}/section-services.png`);
    });
  }

  if (fixture.hasMenu) {
    test('menu section', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const menu = page.locator('#menu');
      if ((await menu.count()) === 0) return;
      await menu.scrollIntoViewIfNeeded();
      await expect(menu).toHaveScreenshot(`${fixtureName}/section-menu.png`);
    });
  }

  if (fixture.hasGallery) {
    test('gallery section', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const gallery = page.locator('#gallery');
      if ((await gallery.count()) === 0) return;
      await gallery.scrollIntoViewIfNeeded();
      await expect(gallery).toHaveScreenshot(`${fixtureName}/section-gallery.png`);
    });
  }

  if (fixture.hasReviews) {
    test('reviews section', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const reviews = page.locator('#reviews');
      if ((await reviews.count()) === 0) return;
      await reviews.scrollIntoViewIfNeeded();
      await expect(reviews).toHaveScreenshot(`${fixtureName}/section-reviews.png`);
    });
  }

  if (fixture.hasFAQ) {
    test('faq section', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const faq = page.locator('#faq');
      if ((await faq.count()) === 0) return;
      await faq.scrollIntoViewIfNeeded();
      await expect(faq).toHaveScreenshot(`${fixtureName}/section-faq.png`);
    });
  }

  test('contact section', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const contact = page.locator('#contact, #order');
    if ((await contact.count()) === 0) return;
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toHaveScreenshot(`${fixtureName}/section-contact.png`);
  });

  test('about section', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const about = page.locator('#about');
    if ((await about.count()) === 0) return;
    await about.scrollIntoViewIfNeeded();
    await expect(about).toHaveScreenshot(`${fixtureName}/section-about.png`);
  });

  test('footer', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const footer = page.locator('footer');
    if ((await footer.count()) === 0) return;
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveScreenshot(`${fixtureName}/footer.png`);
  });

  test('header/navigation', async ({ page }) => {
    await page.goto('/');
    await waitForIdle(page);
    const header = page.locator('.site-header');
    await expect(header).toHaveScreenshot(`${fixtureName}/header.png`);
  });

  if (fixture.hasProjects) {
    test('projects section', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const projects = page.locator('#projects');
      if ((await projects.count()) === 0) return;
      await projects.scrollIntoViewIfNeeded();
      await expect(projects).toHaveScreenshot(`${fixtureName}/section-projects.png`);
    });
  }

  if (fixture.hasBeforeAfter) {
    test('before-after section', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const ba = page.locator('#before-after, #beforeAfter');
      if ((await ba.count()) === 0) return;
      await ba.scrollIntoViewIfNeeded();
      await expect(ba).toHaveScreenshot(`${fixtureName}/section-before-after.png`);
    });
  }

  if (fixture.hasAlert) {
    test('alert banner', async ({ page }) => {
      await page.goto('/');
      await waitForIdle(page);
      const alert = page.locator('.site-alert, [data-alert]');
      if ((await alert.count()) === 0) return;
      await expect(alert).toHaveScreenshot(`${fixtureName}/alert-banner.png`);
    });
  }
});
