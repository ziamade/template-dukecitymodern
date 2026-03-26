export interface GoogleLinkEntry {
  label: string;
  url: string;
  icon: string;
}

function isSafeUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function getGoogleLinkEntries(links: Record<string, string> | null | undefined): GoogleLinkEntry[] {
  if (!links) return [];
  const entries: GoogleLinkEntry[] = [];
  if (isSafeUrl(links.directions)) entries.push({ label: 'Get Directions', url: links.directions, icon: '📍' });
  if (isSafeUrl(links.writeReview)) entries.push({ label: 'Leave a Review', url: links.writeReview, icon: '⭐' });
  return entries;
}
