import { describe, it, expect } from 'vitest';
import { getGoogleLinkEntries } from '../lib/google-links';

describe('getGoogleLinkEntries', () => {
  it('returns directions and review entries when both exist', () => {
    const links = {
      directions: 'https://maps.google.com/dir',
      writeReview: 'https://search.google.com/review',
    };
    const entries = getGoogleLinkEntries(links);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({ label: 'Get Directions', url: 'https://maps.google.com/dir', icon: '📍' });
    expect(entries[1]).toEqual({ label: 'Leave a Review', url: 'https://search.google.com/review', icon: '⭐' });
  });

  it('returns only directions when writeReview is missing', () => {
    const entries = getGoogleLinkEntries({ directions: 'https://maps.google.com/dir' });
    expect(entries).toHaveLength(1);
    expect(entries[0].label).toBe('Get Directions');
  });

  it('returns empty array when object is empty', () => {
    expect(getGoogleLinkEntries({})).toHaveLength(0);
  });

  it('returns empty array for null/undefined', () => {
    expect(getGoogleLinkEntries(null as any)).toHaveLength(0);
    expect(getGoogleLinkEntries(undefined as any)).toHaveLength(0);
  });

  it('rejects javascript: and data: URLs', () => {
    const links = {
      directions: 'javascript:alert(1)',
      writeReview: 'data:text/html,<script>alert(1)</script>',
    };
    const entries = getGoogleLinkEntries(links);
    expect(entries).toHaveLength(0);
  });
});
