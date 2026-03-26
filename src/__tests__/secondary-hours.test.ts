import { describe, it, expect } from 'vitest';
import { getSecondaryHoursEntries } from '../lib/secondary-hours';

describe('getSecondaryHoursEntries', () => {
  it('formats delivery hours with capitalized label', () => {
    const secondary = {
      delivery: ['Monday: 11:00 AM – 9:00 PM', 'Tuesday: 11:00 AM – 9:00 PM'],
    };
    const entries = getSecondaryHoursEntries(secondary);
    expect(entries).toHaveLength(1);
    expect(entries[0].label).toBe('Delivery');
    expect(entries[0].hours).toHaveLength(2);
  });

  it('handles multiple types (delivery + takeout)', () => {
    const secondary = {
      delivery: ['Monday: 11:00 AM – 9:00 PM'],
      takeout: ['Monday: 10:00 AM – 9:30 PM'],
    };
    const entries = getSecondaryHoursEntries(secondary);
    expect(entries).toHaveLength(2);
  });

  it('returns empty array when no secondary hours', () => {
    expect(getSecondaryHoursEntries(undefined)).toHaveLength(0);
    expect(getSecondaryHoursEntries(null as any)).toHaveLength(0);
    expect(getSecondaryHoursEntries({})).toHaveLength(0);
  });

  it('skips types with empty arrays', () => {
    const secondary = { delivery: [], takeout: ['Mon: 10 AM – 9 PM'] };
    const entries = getSecondaryHoursEntries(secondary);
    expect(entries).toHaveLength(1);
    expect(entries[0].label).toBe('Takeout');
  });
});
