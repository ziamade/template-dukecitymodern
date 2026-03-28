/**
 * Animation controller — GSAP + Lenis integration.
 *
 * Progressive enhancement pattern:
 * 1. Content is visible by default (CSS: opacity 1, transform none)
 * 2. Once this script loads, adds 'gsap-ready' class to <html>
 * 3. CSS rules under .gsap-ready hide elements (opacity 0, translateY)
 * 4. GSAP ScrollTrigger animates them back to visible on scroll
 *
 * If JS fails to load, content stays visible. No invisible text.
 *
 * Motion intensity (from data-motion on <body>):
 * - none:     No animations, no Lenis. Early return.
 * - subtle:   Lenis + reveal animations only.
 * - standard: Reveals + parallax + stagger.
 * - dramatic: Everything including magnetic, tilt, cursor-reactive.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Check reduced motion preference and motion intensity setting
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionLevel = document.body.dataset.motion || 'standard';

if (!prefersReduced && motionLevel !== 'none') {
  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    lerp: 0.06,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
  });

  // Bridge Lenis scroll events to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time: number) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Mark document as animation-ready (triggers CSS hidden states)
  document.documentElement.classList.add('gsap-ready');

  // Initialize animation features based on motion level
  initRevealAnimations();

  if (motionLevel === 'standard' || motionLevel === 'dramatic') {
    initParallax();
    initStaggerAnimations();
    initCounters();
  }

  if (motionLevel === 'dramatic') {
    initMagneticElements();
    initTiltCards();
  }
}

/** Scroll-triggered reveal animations for .reveal-up, .reveal-left, .reveal-right, .reveal-scale */
function initRevealAnimations(): void {
  const configs: Record<string, gsap.TweenVars> = {
    'reveal-up':    { y: 0, opacity: 1, duration: 1, ease: 'expo.out' },
    'reveal-left':  { x: 0, opacity: 1, duration: 1, ease: 'expo.out' },
    'reveal-right': { x: 0, opacity: 1, duration: 1, ease: 'expo.out' },
    'reveal-scale': { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' },
  };

  for (const [cls, vars] of Object.entries(configs)) {
    document.querySelectorAll(`.${cls}`).forEach((el) => {
      gsap.to(el, {
        ...vars,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    });
  }
}

/** Parallax effect for elements with data-parallax attribute */
function initParallax(): void {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '-30');
    gsap.to(el, {
      yPercent: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/** Staggered reveal for children of .stagger-parent containers */
function initStaggerAnimations(): void {
  document.querySelectorAll('.stagger-parent').forEach((parent) => {
    gsap.to(parent.children, {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        once: true,
      },
    });
  });
}

/** Animated number counters for .counter elements with data-target */
function initCounters(): void {
  document.querySelectorAll<HTMLElement>('.counter').forEach((el) => {
    const target = parseInt(el.dataset.target || '0', 10);
    if (!target) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val).toLocaleString();
      },
    });
  });
}

/** Magnetic cursor attraction for elements with data-magnetic */
function initMagneticElements(): void {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.3');

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/** 3D tilt effect on hover for elements with data-tilt */
function initTiltCards(): void {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const maxTilt = parseFloat(el.dataset.tilt || '8');

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * maxTilt;
      const rotateY = (x - 0.5) * maxTilt;
      gsap.to(el, {
        rotateX, rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        rotateX: 0, rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}
