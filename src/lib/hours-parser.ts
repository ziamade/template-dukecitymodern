/**
 * Hours parser — accepts both the canonical days[] structure and the legacy/intermediate
 * pipeline string format.
 *
 * Background: the canonical hours.json shape is `{ days: HoursDay[], secondaryHours? }`,
 * but several pipeline output paths (and the legacy `scripts/raw-to-fixture.ts` in the
 * platform repo) emit a flat string like:
 *
 *   "Monday: 8:00 AM – 5:00 PM | Tuesday: 8:00 AM – 5:00 PM"   (legacy pipe delimiter)
 *   "Monday: Open 24 hours; Tuesday: Open 24 hours"            (new semicolon delimiter)
 *
 * keyed under `hoursWeekdays` / `hoursWeekend`. When that lands in `src/data/hours.json`
 * the template's `hours.days` is undefined, components render the empty state, and the
 * Hero "Loading hours" badge stays visible.
 *
 * `normalizeHours` accepts either shape and always returns `{ days, secondaryHours }`,
 * so downstream components never have to know which delimiter the pipeline used.
 *
 * See: github.com/ziamade/template-dukecitymodern#88
 */

export interface HoursDay {
  day: string;
  open: string | null;
  close: string | null;
}

export interface NormalizedHours {
  days: HoursDay[];
  secondaryHours?: Record<string, unknown> | null;
}

const DELIMITER_REGEX = /\s*[|;]\s*/;
// hyphen-minus (-), en-dash (–), em-dash (—), figure dash (‒)
const RANGE_SEPARATOR_REGEX = /\s+[\u2010-\u2015\-]\s+/;

/**
 * Parses a delimiter-tolerant hours string into HoursDay entries.
 *
 * Accepts both `;` and ` | ` delimiters (and a mix of the two, since pipeline output
 * has shifted between them across versions). Each entry must be `Day: hours-spec`,
 * where hours-spec is either:
 *   - `Open 24 hours` / `Closed` / a free-form label  → open=label, close=null
 *   - `9:00 AM – 5:00 PM` (any dash kind, with surrounding whitespace) → open/close split
 *
 * Malformed entries (no colon) are skipped silently rather than failing the whole parse.
 */
export function parseHoursString(input: string | null | undefined): HoursDay[] {
  if (!input || typeof input !== 'string') return [];
  const trimmed = input.trim();
  if (!trimmed) return [];

  return trimmed
    .split(DELIMITER_REGEX)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && entry.includes(':'))
    .map((entry) => {
      const colonIdx = entry.indexOf(':');
      const day = entry.slice(0, colonIdx).trim();
      const spec = entry.slice(colonIdx + 1).trim();

      // Skip if day is empty after trim
      if (!day) return null;

      // Try to split on a range separator (e.g. "9 AM – 5 PM")
      const rangeMatch = spec.split(RANGE_SEPARATOR_REGEX);
      if (rangeMatch.length === 2 && rangeMatch[0].trim() && rangeMatch[1].trim()) {
        return {
          day,
          open: rangeMatch[0].trim(),
          close: rangeMatch[1].trim(),
        };
      }

      // Otherwise treat the whole spec as a label (Closed, Open 24 hours, etc.)
      return { day, open: spec, close: null };
    })
    .filter((d): d is HoursDay => d !== null);
}

/**
 * Normalizes any of the accepted hours shapes into `{ days, secondaryHours }`.
 *
 * Resolution order:
 *   1. If `raw.days` is a non-empty array, use it as-is (canonical path).
 *   2. Else, parse `raw.hoursWeekdays` and `raw.hoursWeekend` strings (pipeline path).
 *   3. Else, return `{ days: [] }` so components render their empty state cleanly.
 *
 * `secondaryHours` is preserved verbatim — it's a free-form record consumed by
 * `getSecondaryHoursEntries()`, which already tolerates missing/null/mixed values.
 */
export function normalizeHours(raw: unknown): NormalizedHours {
  if (!raw || typeof raw !== 'object') return { days: [] };
  const obj = raw as Record<string, unknown>;
  const secondary = (obj.secondaryHours ?? null) as Record<string, unknown> | null;

  if (Array.isArray(obj.days) && obj.days.length > 0) {
    return {
      days: obj.days as HoursDay[],
      secondaryHours: secondary,
    };
  }

  const weekdays = typeof obj.hoursWeekdays === 'string' ? obj.hoursWeekdays : '';
  const weekend = typeof obj.hoursWeekend === 'string' ? obj.hoursWeekend : '';
  if (weekdays || weekend) {
    return {
      days: [...parseHoursString(weekdays), ...parseHoursString(weekend)],
      secondaryHours: secondary,
    };
  }

  return { days: [], secondaryHours: secondary };
}
