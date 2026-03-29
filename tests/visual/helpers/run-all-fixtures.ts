#!/usr/bin/env tsx
/**
 * Orchestrator — builds each fixture and runs Playwright tests against it.
 *
 * Usage:
 *   npm test                          # Run all 10 fixtures
 *   npm test -- --fixture standard-service  # Run one fixture
 *   npm test -- --update              # Update golden screenshots
 */

import { execSync } from 'child_process';
import * as path from 'path';
import { activateFixture, deactivateFixture } from './fixture-manager.js';
import { FIXTURES } from './fixture-matrix.js';

const VISUAL_DIR = path.resolve(import.meta.dirname, '..');

async function main() {
  const args = process.argv.slice(2);
  const singleFixture = args.find((a, i) => args[i - 1] === '--fixture') || '';
  const updateSnapshots = args.includes('--update');

  const fixturesToRun = singleFixture
    ? FIXTURES.filter((f) => f.name === singleFixture)
    : FIXTURES;

  if (fixturesToRun.length === 0) {
    console.error(`Unknown fixture: ${singleFixture}`);
    console.error(`Available: ${FIXTURES.map((f) => f.name).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n=== Visual Regression Suite ===`);
  console.log(`Fixtures: ${fixturesToRun.map((f) => f.name).join(', ')}`);
  console.log(`Viewports: 7 (Galaxy Fold → Desktop QHD)\n`);

  const results: Array<{ name: string; passed: boolean; error?: string }> = [];

  for (const fixture of fixturesToRun) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  FIXTURE: ${fixture.name}`);
    console.log(`  ${fixture.description}`);
    console.log(`${'='.repeat(60)}`);

    try {
      await activateFixture(fixture.name);

      const playwrightArgs = [
        'npx', 'playwright', 'test',
        '-c', 'playwright.config.ts',
        '--grep', fixture.name,
      ];
      if (updateSnapshots) playwrightArgs.push('--update-snapshots');

      execSync(playwrightArgs.join(' '), {
        cwd: VISUAL_DIR,
        stdio: 'inherit',
        timeout: 300_000,
        env: { ...process.env, FIXTURE_NAME: fixture.name },
      });

      results.push({ name: fixture.name, passed: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`\n  FAILED: ${fixture.name}\n  ${msg}\n`);
      results.push({ name: fixture.name, passed: false, error: msg });
    } finally {
      try {
        await deactivateFixture();
      } catch (e) {
        console.error(`  Warning: cleanup failed for ${fixture.name}`);
      }
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('  RESULTS');
  console.log(`${'='.repeat(60)}`);
  for (const r of results) {
    console.log(`  ${r.passed ? 'PASS' : 'FAIL'}  ${r.name}`);
  }

  const failed = results.filter((r) => !r.passed);
  if (failed.length > 0) {
    console.log(`\n  ${failed.length}/${results.length} fixtures failed.`);
    process.exit(1);
  } else {
    console.log(`\n  All ${results.length} fixtures passed.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
