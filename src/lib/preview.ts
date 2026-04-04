/**
 * Preview disclaimer logic for fallback protection.
 *
 * When a site is served directly (not via the ziamade.com proxy),
 * the fallback disclaimer is visible by default via inline CSS.
 * The proxy overlay CSS hides it with #zm-fallback-disclaimer { display: none !important }.
 */

export interface PreviewData {
  businessName: string;
  slug: string;
}

/** Check whether the site is in preview mode. */
export function isPreview(data: PreviewData | undefined): data is PreviewData {
  return !!data && typeof data.businessName === 'string' && data.businessName.length > 0;
}

/** Generate the fallback disclaimer HTML (red bar, visible by default). */
export function getDisclaimerHtml(data: PreviewData): string {
  const biz = escapeHtml(data.businessName);
  const slug = encodeURIComponent(data.slug);
  return [
    '<div id="zm-fallback-disclaimer" style="',
    'position:sticky;top:0;z-index:99999;',
    'background:#c41e1e;color:#fff;',
    'padding:8px 16px;text-align:center;',
    'font-family:system-ui,sans-serif;font-size:13px;line-height:1.5;',
    '">',
    `PREVIEW \u2014 This is a speculative preview built by ZiaMade. `,
    `Not affiliated with or endorsed by ${biz}. `,
    `<a href="https://ziamade.com/request-removal/${slug}" `,
    'style="color:#fff;text-decoration:underline;margin-left:8px;">',
    'Request Removal</a>',
    '</div>',
  ].join('');
}

/** Noindex meta tag for preview sites. */
export function getNoindexMeta(): string {
  return '<meta name="robots" content="noindex, nofollow">';
}

/** Prefix og:title for preview sites. */
export function getPreviewOgTitle(title: string): string {
  return `PREVIEW - ${title}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
