export interface GoogleLinkEntry {
  label: string;
  url: string;
  icon: string;
}

export function getGoogleLinkEntries(links: Record<string, string> | null | undefined): GoogleLinkEntry[] {
  if (!links) return [];
  const entries: GoogleLinkEntry[] = [];
  if (links.directions) entries.push({ label: 'Get Directions', url: links.directions, icon: '📍' });
  if (links.writeReview) entries.push({ label: 'Leave a Review', url: links.writeReview, icon: '⭐' });
  return entries;
}
