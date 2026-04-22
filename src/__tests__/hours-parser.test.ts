import { describe, it, expect } from 'vitest';
import { parseHoursString, normalizeHours } from '../lib/hours-parser';

describe('parseHoursString', () => {
  it('parses semicolon-delimited weekdays from pipeline format', () => {
    const input =
      'Monday: Open 24 hours; Tuesday: Open 24 hours; Wednesday: Open 24 hours; Thursday: Open 24 hours; Friday: Open 24 hours';
    const days = parseHoursString(input);
    expect(days).toHaveLength(5);
    expect(days[0]).toEqual({ day: 'Monday', open: 'Open 24 hours', close: null });
    expect(days[4]).toEqual({ day: 'Friday', open: 'Open 24 hours', close: null });
  });

  it('parses pipe-delimited weekdays from legacy raw-to-fixture format', () => {
    const input =
      'Monday: 8:00 AM – 5:00 PM | Tuesday: 8:00 AM – 5:00 PM | Wednesday: 8:00 AM – 5:00 PM';
    const days = parseHoursString(input);
    expect(days).toHaveLength(3);
    expect(days[0]).toEqual({ day: 'Monday', open: '8:00 AM', close: '5:00 PM' });
    expect(days[2]).toEqual({ day: 'Wednesday', open: '8:00 AM', close: '5:00 PM' });
  });

  it('accepts mixed delimiters in the same string', () => {
    const input = 'Monday: Closed; Tuesday: 9 AM – 5 PM | Wednesday: 9 AM – 5 PM';
    const days = parseHoursString(input);
    expect(days).toHaveLength(3);
    expect(days[0]).toEqual({ day: 'Monday', open: 'Closed', close: null });
    expect(days[1]).toEqual({ day: 'Tuesday', open: '9 AM', close: '5 PM' });
  });

  it('parses Closed as open=Closed, close=null', () => {
    const input = 'Sunday: Closed';
    const days = parseHoursString(input);
    expect(days).toEqual([{ day: 'Sunday', open: 'Closed', close: null }]);
  });

  it('returns empty array for empty or whitespace input', () => {
    expect(parseHoursString('')).toEqual([]);
    expect(parseHoursString('   ')).toEqual([]);
    expect(parseHoursString(null as unknown as string)).toEqual([]);
    expect(parseHoursString(undefined as unknown as string)).toEqual([]);
  });

  it('skips entries without a colon (malformed)', () => {
    const input = 'Monday: 9 AM – 5 PM; not-a-day; Tuesday: 9 AM – 5 PM';
    const days = parseHoursString(input);
    expect(days).toHaveLength(2);
    expect(days.map((d) => d.day)).toEqual(['Monday', 'Tuesday']);
  });

  it('handles en-dash, em-dash, and hyphen as range separator', () => {
    expect(parseHoursString('Mon: 9 AM - 5 PM')[0]).toEqual({
      day: 'Mon',
      open: '9 AM',
      close: '5 PM',
    });
    expect(parseHoursString('Mon: 9 AM – 5 PM')[0]).toEqual({
      day: 'Mon',
      open: '9 AM',
      close: '5 PM',
    });
    expect(parseHoursString('Mon: 9 AM — 5 PM')[0]).toEqual({
      day: 'Mon',
      open: '9 AM',
      close: '5 PM',
    });
  });
});

describe('normalizeHours', () => {
  it('returns existing days[] format unchanged when present', () => {
    const raw = {
      days: [{ day: 'Monday', open: '9 AM', close: '5 PM' }],
      secondaryHours: {},
    };
    expect(normalizeHours(raw)).toEqual(raw);
  });

  it('converts hoursWeekdays + hoursWeekend strings to days[]', () => {
    const raw = {
      hoursWeekdays:
        'Monday: Open 24 hours; Tuesday: Open 24 hours; Wednesday: Open 24 hours; Thursday: Open 24 hours; Friday: Open 24 hours',
      hoursWeekend: 'Saturday: Open 24 hours; Sunday: Open 24 hours',
      secondaryHours: null,
    };
    const result = normalizeHours(raw);
    expect(result.days).toHaveLength(7);
    expect(result.days[0].day).toBe('Monday');
    expect(result.days[6].day).toBe('Sunday');
    expect(result.days[6].open).toBe('Open 24 hours');
  });

  it('handles only hoursWeekdays (no weekend)', () => {
    const raw = {
      hoursWeekdays: 'Monday: 9 AM – 5 PM; Friday: 9 AM – 5 PM',
    };
    const result = normalizeHours(raw);
    expect(result.days).toHaveLength(2);
    expect(result.days[0].day).toBe('Monday');
  });

  it('returns empty days when neither days[] nor weekday strings are present', () => {
    const raw = { secondaryHours: null };
    const result = normalizeHours(raw);
    expect(result.days).toEqual([]);
  });

  it('handles null/undefined input gracefully', () => {
    expect(normalizeHours(null).days).toEqual([]);
    expect(normalizeHours(undefined).days).toEqual([]);
  });

  it('preserves secondaryHours when normalizing string format', () => {
    const raw = {
      hoursWeekdays: 'Monday: 9 AM – 5 PM',
      secondaryHours: { delivery: ['Mon: 5 PM – 9 PM'] },
    };
    const result = normalizeHours(raw);
    expect(result.secondaryHours).toEqual({ delivery: ['Mon: 5 PM – 9 PM'] });
  });
});
