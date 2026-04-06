import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('version consistency', () => {
  const root = resolve(import.meta.dirname, '../../');
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const manifest = JSON.parse(
    readFileSync(resolve(root, 'src/data/_template-manifest.json'), 'utf8'),
  );

  it('package.json and _template-manifest.json versions match', () => {
    expect(manifest.version).toBe(pkg.version);
  });

  it('version is valid semver', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
