import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const footerPath = resolve(__dirname, '../../components/Footer.astro');
const footerSrc = readFileSync(footerPath, 'utf-8');

const indexPath = resolve(__dirname, '../../pages/index.astro');
const indexSrc = readFileSync(indexPath, 'utf-8');

describe('Footer navLinks prop', () => {
  it('has Props interface with navLinks', () => {
    expect(footerSrc).toContain('interface Props');
    expect(footerSrc).toContain('navLinks?:');
  });

  it('destructures navLinks from Astro.props with default empty array', () => {
    expect(footerSrc).toContain('navLinks = []');
  });

  it('conditionally renders footer-nav-col when navLinks has items', () => {
    expect(footerSrc).toContain('footer-nav-col');
    expect(footerSrc).toContain('navLinks.length > 0');
  });

  it('renders footer-nav-list for the links', () => {
    expect(footerSrc).toContain('footer-nav-list');
  });

  it('renders Quick Links as the column heading', () => {
    expect(footerSrc).toContain('footer-col-title');
    expect(footerSrc).toContain('Quick Links');
  });

  it('nav list CSS uses var(--textMuted) color', () => {
    expect(footerSrc).toContain('color: var(--textMuted)');
  });

  it('nav list link hover uses var(--accent)', () => {
    // The footer-nav-list a:hover rule must reference --accent
    const navListSection = footerSrc.slice(footerSrc.indexOf('.footer-nav-list'));
    expect(navListSection).toContain('color: var(--accent)');
  });

  it('nav list links have no text decoration', () => {
    expect(footerSrc).toContain('text-decoration: none');
  });

  it('desktop grid is 4-column to accommodate nav links', () => {
    expect(footerSrc).toContain('grid-template-columns: 1.5fr 1fr 1fr 1fr');
  });
});

describe('index.astro passes navLinks to Footer', () => {
  it('passes navLinks prop to Footer component', () => {
    expect(indexSrc).toContain('<Footer navLinks={navLinks}');
  });
});
