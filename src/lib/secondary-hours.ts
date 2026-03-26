export interface SecondaryHoursEntry {
  label: string;
  hours: string[];
}

export function getSecondaryHoursEntries(
  secondary: Record<string, string[]> | null | undefined,
): SecondaryHoursEntry[] {
  if (!secondary) return [];
  return Object.entries(secondary)
    .filter(([, hours]) => hours.length > 0)
    .map(([type, hours]) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      hours,
    }));
}
