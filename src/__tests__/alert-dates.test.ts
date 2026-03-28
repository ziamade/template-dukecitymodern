import { describe, it, expect, vi, afterEach } from 'vitest';

/**
 * Tests the alert banner date-gating logic from BaseLayout.astro.
 * The logic: if startDate is set and in the future, hide.
 * If endDate is set and in the past, hide. No dates = show (backwards compat).
 */

interface AlertData {
  enabled: boolean;
  text: string;
  startDate?: string;
  endDate?: string;
}

/** Mirrors the alertVisible logic in BaseLayout.astro */
function isAlertVisible(alert: AlertData, now: Date): boolean {
  if (!alert?.enabled || !alert?.text) return false;
  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
  if (alert.startDate && today < alert.startDate) return false;
  if (alert.endDate && today > alert.endDate) return false;
  return true;
}

describe('alert banner date gating', () => {
  it('shows alert when enabled with text and no dates', () => {
    expect(isAlertVisible({ enabled: true, text: 'Hello' }, new Date('2026-03-28'))).toBe(true);
  });

  it('hides alert when disabled', () => {
    expect(isAlertVisible({ enabled: false, text: 'Hello' }, new Date('2026-03-28'))).toBe(false);
  });

  it('hides alert when text is empty', () => {
    expect(isAlertVisible({ enabled: true, text: '' }, new Date('2026-03-28'))).toBe(false);
  });

  it('hides alert before startDate', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', startDate: '2026-04-01' },
      new Date('2026-03-28')
    )).toBe(false);
  });

  it('shows alert on startDate', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', startDate: '2026-03-28' },
      new Date('2026-03-28')
    )).toBe(true);
  });

  it('shows alert after startDate', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', startDate: '2026-03-01' },
      new Date('2026-03-28')
    )).toBe(true);
  });

  it('hides alert after endDate', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', endDate: '2026-03-27' },
      new Date('2026-03-28')
    )).toBe(false);
  });

  it('shows alert on endDate', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', endDate: '2026-03-28' },
      new Date('2026-03-28')
    )).toBe(true);
  });

  it('shows alert before endDate', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', endDate: '2026-04-15' },
      new Date('2026-03-28')
    )).toBe(true);
  });

  it('shows alert within startDate-endDate window', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', startDate: '2026-03-01', endDate: '2026-04-01' },
      new Date('2026-03-28')
    )).toBe(true);
  });

  it('hides alert before startDate even with future endDate', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', startDate: '2026-04-01', endDate: '2026-04-15' },
      new Date('2026-03-28')
    )).toBe(false);
  });

  it('hides alert after endDate even with past startDate', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', startDate: '2026-03-01', endDate: '2026-03-15' },
      new Date('2026-03-28')
    )).toBe(false);
  });

  it('handles missing startDate with endDate set', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', endDate: '2026-04-01' },
      new Date('2026-03-28')
    )).toBe(true);
  });

  it('handles missing endDate with startDate set', () => {
    expect(isAlertVisible(
      { enabled: true, text: 'Sale!', startDate: '2026-03-01' },
      new Date('2026-03-28')
    )).toBe(true);
  });
});
