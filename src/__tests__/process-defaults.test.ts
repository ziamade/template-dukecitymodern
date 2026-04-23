import { describe, it, expect } from 'vitest';
import {
  resolveIndustryBucket,
  resolveDefaultProcessSteps,
  DEFAULT_PROCESS_STEPS,
  type IndustryBucket,
} from '../lib/process-defaults';

describe('resolveIndustryBucket', () => {
  it('maps trade-style industries to "trade"', () => {
    const trades = [
      'Electrical Services',
      'Plumbing',
      'HVAC',
      'Roofing',
      'Window Tinting',
      'Welding',
      'General Contractor',
      'Home Improvement',
      'Painter',
      'Handyman',
      'Landscaping',
    ];
    for (const s of trades) {
      expect(resolveIndustryBucket(s)).toBe('trade');
    }
  });

  it('maps food-service industries to "restaurant"', () => {
    const spots = ['Restaurant', 'Cafe', 'Coffee Shop', 'Pizzeria', 'Bakery', 'Taqueria', 'Ramen Shop'];
    for (const s of spots) {
      expect(resolveIndustryBucket(s)).toBe('restaurant');
    }
  });

  it('maps retail industries to "retail"', () => {
    const shops = ['Retail', 'Boutique', 'Clothing Store', 'Jewelry Shop', 'Florist', 'Gift Shop'];
    for (const s of shops) {
      expect(resolveIndustryBucket(s)).toBe('retail');
    }
  });

  it('maps author/creator industries to "author"', () => {
    const authors = ['Author', 'Writer', 'Novelist', 'Book Publisher'];
    for (const s of authors) {
      expect(resolveIndustryBucket(s)).toBe('author');
    }
  });

  it('maps professional-service industries to "service"', () => {
    const services = ['Hair Salon', 'Barber Shop', 'Spa', 'Massage Therapist', 'Personal Training', 'Law Firm', 'Dental Services'];
    for (const s of services) {
      expect(resolveIndustryBucket(s)).toBe('service');
    }
  });

  it('falls back to "other" for unknown or empty input', () => {
    expect(resolveIndustryBucket()).toBe('other');
    expect(resolveIndustryBucket(null)).toBe('other');
    expect(resolveIndustryBucket('')).toBe('other');
    expect(resolveIndustryBucket('unrecognized-industry-label')).toBe('other');
  });

  it('is case-insensitive', () => {
    expect(resolveIndustryBucket('ELECTRICAL SERVICES')).toBe('trade');
    expect(resolveIndustryBucket('restaurant')).toBe('restaurant');
    expect(resolveIndustryBucket('Hair Salon')).toBe('service');
  });
});

describe('DEFAULT_PROCESS_STEPS', () => {
  const buckets: IndustryBucket[] = ['trade', 'restaurant', 'retail', 'service', 'author', 'other'];

  it('defines defaults for all six industry buckets', () => {
    for (const b of buckets) {
      expect(DEFAULT_PROCESS_STEPS[b]).toBeDefined();
    }
  });

  it('each bucket has between 3 and 5 steps (matches platform schema)', () => {
    for (const b of buckets) {
      const steps = DEFAULT_PROCESS_STEPS[b];
      expect(steps.length).toBeGreaterThanOrEqual(3);
      expect(steps.length).toBeLessThanOrEqual(5);
    }
  });

  it('every step has title, description, and sequential order', () => {
    for (const b of buckets) {
      const steps = DEFAULT_PROCESS_STEPS[b];
      steps.forEach((step, idx) => {
        expect(step.title).toBeTruthy();
        expect(step.description).toBeTruthy();
        expect(step.order).toBe(idx + 1);
      });
    }
  });

  it('no step copy contains em dashes (CLAUDE.md AI Content Guideline)', () => {
    for (const b of buckets) {
      for (const step of DEFAULT_PROCESS_STEPS[b]) {
        expect(step.title).not.toMatch(/—/);
        expect(step.description).not.toMatch(/—/);
      }
    }
  });
});

describe('resolveDefaultProcessSteps', () => {
  it('returns the trade default set for an electrician', () => {
    const steps = resolveDefaultProcessSteps('Electrical Services');
    expect(steps).toBe(DEFAULT_PROCESS_STEPS.trade);
  });

  it('returns the "other" default set when industry is missing', () => {
    expect(resolveDefaultProcessSteps()).toBe(DEFAULT_PROCESS_STEPS.other);
    expect(resolveDefaultProcessSteps(null)).toBe(DEFAULT_PROCESS_STEPS.other);
  });
});
