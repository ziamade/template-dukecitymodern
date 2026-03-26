import { describe, it, expect } from 'vitest';
import { getAttributeBadges } from '../lib/attribute-badges';

describe('getAttributeBadges', () => {
  it('returns accessibility badge first (priority order)', () => {
    const attrs = {
      accessibility: { wheelchairEntrance: true, wheelchairParking: true },
      parking: { freeParkingLot: true },
    };
    const badges = getAttributeBadges(attrs);
    expect(badges[0].label).toBe('Wheelchair Accessible');
  });

  it('returns parking badges', () => {
    const badges = getAttributeBadges({ parking: { freeParkingLot: true } });
    expect(badges.some(b => b.label === 'Free Parking')).toBe(true);
  });

  it('returns payment badges', () => {
    const badges = getAttributeBadges({ payment: { creditCards: true, nfc: true } });
    expect(badges.some(b => b.label === 'Credit Cards')).toBe(true);
    expect(badges.some(b => b.label === 'Contactless')).toBe(true);
  });

  it('returns atmosphere badges', () => {
    const badges = getAttributeBadges({ atmosphere: { outdoorSeating: true, allowsDogs: true } });
    expect(badges.some(b => b.label === 'Outdoor Seating')).toBe(true);
    expect(badges.some(b => b.label === 'Dog Friendly')).toBe(true);
  });

  it('caps at 6 badges', () => {
    const attrs = {
      accessibility: { wheelchairEntrance: true },
      parking: { freeParkingLot: true, freeStreetParking: true, valetParking: true },
      payment: { creditCards: true, nfc: true },
      atmosphere: { outdoorSeating: true, allowsDogs: true },
    };
    expect(getAttributeBadges(attrs).length).toBeLessThanOrEqual(6);
  });

  it('returns empty array for empty/null input', () => {
    expect(getAttributeBadges({})).toHaveLength(0);
    expect(getAttributeBadges(null as any)).toHaveLength(0);
  });
});
