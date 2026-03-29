/**
 * Device viewport definitions for visual regression testing.
 * Covers the narrowest real device (Galaxy Fold) through QHD desktop.
 */

export const VIEWPORTS = {
  'galaxy-fold': {
    width: 280,
    height: 653,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  'iphone-se': {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  'iphone-14-pro': {
    width: 393,
    height: 852,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  'ipad-mini': {
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
  },
  'ipad-landscape': {
    width: 1024,
    height: 768,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
  },
  'desktop-hd': {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  'desktop-qhd': {
    width: 2560,
    height: 1440,
    deviceScaleFactor: 1.5,
    isMobile: false,
    hasTouch: false,
  },
} as const;

export type ViewportName = keyof typeof VIEWPORTS;
