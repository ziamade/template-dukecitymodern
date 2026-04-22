import type { Page } from '@playwright/test';

/**
 * Wait for page to settle: DOM loaded, images loaded, animations frozen.
 * Call before taking screenshots for deterministic results.
 *
 * Covers the template's GSAP progressive-enhancement pattern by forcing
 * all scroll-revealed elements to their final opacity. See below for the
 * selector list.
 *
 * For ad-hoc local Playwright runs (not via this CI harness), prefer
 * `page.emulateMedia({ reducedMotion: 'reduce' })` — animation-controller
 * respects that media query and never hides content in the first place,
 * so no helper is needed.
 */
export async function waitForIdle(page: Page): Promise<void> {
  // Wait for DOM to be ready (don't use networkidle — it can hang on persistent connections)
  await page.waitForLoadState('domcontentloaded');

  // Wait a bit for scripts and images to start loading
  await page.waitForTimeout(500);

  // Wait for all images to load (or error), with timeout protection
  await page.evaluate(() => {
    return Promise.race([
      Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise<void>((resolve) => {
                img.addEventListener('load', () => resolve());
                img.addEventListener('error', () => resolve());
              }),
          ),
      ),
      new Promise<void>((resolve) => setTimeout(resolve, 5000)),
    ]);
  });

  // Freeze CSS animations and transitions for deterministic screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
      .marquee-track { animation-play-state: paused !important; }
      .review-track { animation-play-state: paused !important; }
    `,
  });

  // Force GSAP-animated elements to be visible (they start at opacity:0).
  // Mirrors every `.gsap-ready` hidden selector in src/styles/animations.css
  // so fullPage screenshots capture post-reveal content even for sections
  // below the fold (platform#658).
  await page.addStyleTag({
    content: `
      .gsap-ready .reveal-up,
      .gsap-ready .reveal-left,
      .gsap-ready .reveal-right,
      .gsap-ready .reveal-scale,
      .gsap-ready .reveal-fade,
      .gsap-ready .stagger-parent > *,
      .gsap-ready .split-chars .char,
      .gsap-ready .split-words .word {
        opacity: 1 !important;
        transform: none !important;
      }
    `,
  });

  await page.waitForTimeout(300);
}
