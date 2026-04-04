import { describe, it, expect } from 'vitest';
import {
  isPreview,
  getDisclaimerHtml,
  getNoindexMeta,
  getPreviewOgTitle,
  type PreviewData,
} from '../lib/preview';

describe('fallback disclaimer', () => {
  const preview: PreviewData = {
    businessName: 'Pacific Window Tint',
    slug: 'pacific-window-tint',
  };

  describe('isPreview', () => {
    it('returns true when preview.json data exists', () => {
      expect(isPreview(preview)).toBe(true);
    });

    it('returns false when undefined (no preview.json)', () => {
      expect(isPreview(undefined)).toBe(false);
    });

    it('returns false when businessName is empty', () => {
      expect(isPreview({ businessName: '', slug: 'test' })).toBe(false);
    });
  });

  describe('getDisclaimerHtml', () => {
    it('contains zm-fallback-disclaimer id', () => {
      const html = getDisclaimerHtml(preview);
      expect(html).toContain('id="zm-fallback-disclaimer"');
    });

    it('contains business name and PREVIEW text', () => {
      const html = getDisclaimerHtml(preview);
      expect(html).toContain('PREVIEW');
      expect(html).toContain('Pacific Window Tint');
      expect(html).toContain('Not affiliated with or endorsed by');
    });

    it('contains Request Removal link with slug', () => {
      const html = getDisclaimerHtml(preview);
      expect(html).toContain('https://ziamade.com/request-removal/pacific-window-tint');
      expect(html).toContain('Request Removal');
    });

    it('escapes HTML in business name', () => {
      const html = getDisclaimerHtml({
        businessName: 'Bob <script>alert(1)</script> Tint',
        slug: 'test',
      });
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('is visible by default via inline CSS (no JS required)', () => {
      const html = getDisclaimerHtml(preview);
      // Must use inline styles for visibility — no external CSS dependency
      expect(html).toContain('style="');
      expect(html).toContain('position:sticky');
      expect(html).toContain('background:#c41e1e');
      expect(html).toContain('color:#fff');
    });
  });

  describe('getNoindexMeta', () => {
    it('returns noindex nofollow meta tag', () => {
      const meta = getNoindexMeta();
      expect(meta).toBe('<meta name="robots" content="noindex, nofollow">');
    });
  });

  describe('getPreviewOgTitle', () => {
    it('prefixes title with PREVIEW', () => {
      expect(getPreviewOgTitle('Pacific Window Tint')).toBe('PREVIEW - Pacific Window Tint');
    });
  });

  describe('all absent when no preview.json', () => {
    it('isPreview returns false so no disclaimer/meta rendered', () => {
      // When preview.json doesn't exist, import.meta.glob returns empty object
      // so previewData is undefined → isPreview(undefined) === false
      // Template uses this to conditionally render disclaimer + noindex
      expect(isPreview(undefined)).toBe(false);
    });
  });
});
