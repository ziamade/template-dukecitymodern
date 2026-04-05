export interface SecondaryHoursEntry {
  label: string;
  hours: string[];
}

export function getSecondaryHoursEntries(
  secondary: Record<string, unknown> | null | undefined,
): SecondaryHoursEntry[] {
  if (!secondary) return [];
  return Object.entries(secondary)
    .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].length > 0)
    .map(([type, hours]) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      hours,
    }));
}
