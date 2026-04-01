export interface TeamHoursDay {
  day: string;
  open: string | null;
  close: string | null;
}

export interface TeamMemberRaw {
  name: string;
  brandName?: string;
  title?: string;
  bio?: string;
  photo?: string;
  bookingUrl?: string;
  bookingLabel?: string;
  hours?: string | TeamHoursDay[];
  phone?: string;
  email?: string;
  pricing?: { service: string; price: number; duration?: string }[];
  specialties?: string[];
  order?: number;
}

export interface TeamMemberResolved {
  name: string;
  brandName?: string;
  displayName: string;
  initials: string;
  title?: string;
  bio?: string;
  photo?: string;
  bookingUrl?: string;
  bookingLabel?: string;
  hours?: string | TeamHoursDay[];
  phone?: string;
  email?: string;
  pricing?: { service: string; price: number; duration?: string }[];
  specialties?: string[];
  order: number;
}

/** Normalize a raw team member into a resolved member with display defaults. */
export function resolveTeamMember(raw: TeamMemberRaw): TeamMemberResolved | null {
  if (!raw?.name?.trim()) return null;

  const name = raw.name.trim();
  const parts = name.split(/\s+/);
  const initials = parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 1).toUpperCase();

  const displayName = raw.brandName?.trim() || name;

  let bookingLabel: string | undefined;
  if (raw.bookingUrl) {
    bookingLabel = raw.bookingLabel?.trim() || 'Book Now';
  }

  const hours = Array.isArray(raw.hours)
    ? raw.hours
    : typeof raw.hours === 'string' ? (raw.hours.trim() || undefined) : undefined;

  return {
    name,
    brandName: raw.brandName?.trim() || undefined,
    displayName,
    initials,
    title: raw.title?.trim() || undefined,
    bio: raw.bio?.trim() || undefined,
    photo: raw.photo?.trim() || undefined,
    bookingUrl: raw.bookingUrl?.trim() || undefined,
    bookingLabel,
    hours,
    phone: raw.phone?.trim() || undefined,
    email: raw.email?.trim() || undefined,
    pricing: raw.pricing?.length ? raw.pricing : undefined,
    specialties: raw.specialties?.length ? raw.specialties : undefined,
    order: raw.order ?? 0,
  };
}

/** Resolve, filter, and sort an array of raw team members. */
export function resolveTeamMembers(items?: TeamMemberRaw[] | null): TeamMemberResolved[] {
  if (!items?.length) return [];
  return items
    .map(resolveTeamMember)
    .filter((m): m is TeamMemberResolved => m !== null)
    .sort((a, b) => a.order - b.order);
}
