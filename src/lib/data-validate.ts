/**
 * Build-time data validation helper.
 *
 * Fails loudly when any zod-validated data file violates its schema.
 * This is called from `./data.ts` at module-scope during `astro build`,
 * so a thrown error aborts the build with a non-zero exit code. The
 * pipeline sees the failure and will NOT deploy a broken site.
 *
 * Prior behavior (until platform#649): a validation failure logged a
 * warning and returned the raw data, so the template rendered empty /
 * broken sections with no visible signal. Nine separate pipeline →
 * template data-contract gaps shipped silently during the 2026-04-22
 * shakeout before this was fixed. See ziamade-platform#649.
 *
 * Schemas in `./schemas.ts` are intentionally permissive (`.loose()`,
 * most fields `.optional()`), so in practice validate() only throws on
 * genuine contract violations (missing required fields, wrong types).
 */
import type { ZodSchema } from 'astro/zod';

/**
 * Validate raw data against a zod schema. Returns parsed, typed data on
 * success. Throws `DataValidationError` on failure — fail loudly at build.
 */
export function validate<T>(schema: ZodSchema<T>, raw: unknown, name: string): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new DataValidationError(name, result.error.issues);
  }
  return result.data;
}

export interface ZodIssueLike {
  path: (string | number)[];
  message: string;
  code?: string;
}

export class DataValidationError extends Error {
  readonly file: string;
  readonly issues: ZodIssueLike[];
  constructor(file: string, issues: ZodIssueLike[]) {
    super(formatMessage(file, issues));
    this.name = 'DataValidationError';
    this.file = file;
    this.issues = issues;
  }
}

function formatMessage(file: string, issues: ZodIssueLike[]): string {
  const lines = issues.map((issue) => {
    const path = issue.path.length ? issue.path.join('.') : '(root)';
    return `  - ${path}: ${issue.message}`;
  });
  return [
    `[data] ${file} failed schema validation — aborting build.`,
    `  See src/lib/schemas.ts for the contract. Fix the pipeline output or update the schema.`,
    ...lines,
  ].join('\n');
}
