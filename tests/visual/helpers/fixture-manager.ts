/**
 * Fixture Manager — orchestrates data swaps, builds, and preview server.
 *
 * Flow per fixture:
 *   1. Backup current src/data/ and src/content/services/
 *   2. Copy _base defaults, then overlay fixture-specific files
 *   3. Run `npm run build` (Astro reads JSON at build time)
 *   4. Start `npm run preview` on port 4321
 *   5. After tests: stop server, restore original data
 */

import { execSync, spawn, type ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const TEMPLATE_ROOT = path.resolve(import.meta.dirname, '../../..');
const DATA_DIR = path.join(TEMPLATE_ROOT, 'src/data');
const SERVICES_DIR = path.join(TEMPLATE_ROOT, 'src/content/services');
const FIXTURES_DIR = path.join(import.meta.dirname, '../fixtures');
const BASE_FIXTURE = path.join(FIXTURES_DIR, '_base');
const BACKUP_DIR = path.join(import.meta.dirname, '../.backup');

const DATA_FILES = [
  'theme.json', 'hero.json', 'brand.json', 'client.json',
  'contact.json', 'hours.json', 'about.json', 'testimonials.json',
  'faq.json', 'gallery.json', 'trustbar.json', 'alert.json',
  'projects.json', 'menu.json', 'location.json', 'seo.json',
  'schema.json', 'google-links.json', 'verification.json',
  'attributes.json', '_sources.json', '_template-manifest.json',
];

let previewProcess: ChildProcess | null = null;

export async function activateFixture(fixtureName: string): Promise<void> {
  console.log(`\n  Activating fixture: ${fixtureName}`);

  backupCurrentData();

  // Copy _base defaults first
  copyDataFiles(BASE_FIXTURE);

  // Overlay fixture-specific files (overrides _base)
  const fixtureDir = path.join(FIXTURES_DIR, fixtureName);
  if (!fs.existsSync(fixtureDir)) {
    throw new Error(`Fixture directory not found: ${fixtureDir}`);
  }
  copyDataFiles(fixtureDir);

  // Copy service markdown files if fixture has a services/ subdirectory
  copyServiceFiles(fixtureDir);

  // Build the site
  console.log('  Building Astro site...');
  execSync('npm run build', {
    cwd: TEMPLATE_ROOT,
    stdio: 'pipe',
    timeout: 120_000,
    env: { ...process.env, NODE_ENV: 'production' },
  });
  console.log('  Build complete.');

  // Start preview server
  await startPreview();
}

export async function deactivateFixture(): Promise<void> {
  await stopPreview();
  restoreBackup();
  console.log('  Fixture deactivated, data restored.\n');
}

function backupCurrentData(): void {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  fs.mkdirSync(path.join(BACKUP_DIR, 'services'), { recursive: true });

  for (const file of DATA_FILES) {
    const src = path.join(DATA_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(BACKUP_DIR, file));
    }
  }

  // Backup service markdown
  if (fs.existsSync(SERVICES_DIR)) {
    for (const f of fs.readdirSync(SERVICES_DIR)) {
      if (f.endsWith('.md')) {
        fs.copyFileSync(
          path.join(SERVICES_DIR, f),
          path.join(BACKUP_DIR, 'services', f),
        );
      }
    }
  }
}

function restoreBackup(): void {
  if (!fs.existsSync(BACKUP_DIR)) return;

  for (const file of DATA_FILES) {
    const backup = path.join(BACKUP_DIR, file);
    if (fs.existsSync(backup)) {
      fs.copyFileSync(backup, path.join(DATA_DIR, file));
    }
  }

  // Restore services: clear current, copy backup
  if (fs.existsSync(SERVICES_DIR)) {
    for (const f of fs.readdirSync(SERVICES_DIR)) {
      if (f.endsWith('.md')) {
        fs.unlinkSync(path.join(SERVICES_DIR, f));
      }
    }
  }
  const backupServices = path.join(BACKUP_DIR, 'services');
  if (fs.existsSync(backupServices)) {
    fs.mkdirSync(SERVICES_DIR, { recursive: true });
    for (const f of fs.readdirSync(backupServices)) {
      fs.copyFileSync(
        path.join(backupServices, f),
        path.join(SERVICES_DIR, f),
      );
    }
  }

  fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
}

function copyDataFiles(sourceDir: string): void {
  if (!fs.existsSync(sourceDir)) return;
  for (const file of fs.readdirSync(sourceDir)) {
    if (file.endsWith('.json')) {
      fs.copyFileSync(
        path.join(sourceDir, file),
        path.join(DATA_DIR, file),
      );
    }
  }
}

function copyServiceFiles(fixtureDir: string): void {
  const fixtureServices = path.join(fixtureDir, 'services');
  if (!fs.existsSync(fixtureServices)) return;

  // Clear existing services
  if (fs.existsSync(SERVICES_DIR)) {
    for (const f of fs.readdirSync(SERVICES_DIR)) {
      if (f.endsWith('.md')) {
        fs.unlinkSync(path.join(SERVICES_DIR, f));
      }
    }
  }

  fs.mkdirSync(SERVICES_DIR, { recursive: true });
  for (const f of fs.readdirSync(fixtureServices)) {
    if (f.endsWith('.md')) {
      fs.copyFileSync(
        path.join(fixtureServices, f),
        path.join(SERVICES_DIR, f),
      );
    }
  }
}

async function startPreview(): Promise<void> {
  // Kill any lingering process on port 4321
  try {
    execSync('npx kill-port 4321', { stdio: 'pipe', timeout: 5000 });
  } catch { /* port wasn't in use */ }

  const distDir = path.join(TEMPLATE_ROOT, 'dist');

  // Use http-server for dist/ instead of `astro preview`
  // (astro preview can hit issues with parent repo's Cloudflare adapter)
  previewProcess = spawn('npx', ['http-server', distDir, '-p', '4321', '-s', '--cors'], {
    cwd: TEMPLATE_ROOT,
    stdio: 'pipe',
    shell: true,
  });

  await waitForServer('http://localhost:4321', 30_000);
  console.log('  Preview server ready on http://localhost:4321');
}

async function stopPreview(): Promise<void> {
  if (previewProcess) {
    previewProcess.kill();
    previewProcess = null;
    // Wait for port to free up
    await new Promise((r) => setTimeout(r, 1000));
  }
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const resp = await fetch(url);
      if (resp.ok) return;
    } catch { /* server not ready */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server not ready at ${url} after ${timeoutMs}ms`);
}
