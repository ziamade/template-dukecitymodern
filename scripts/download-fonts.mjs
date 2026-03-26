/**
 * Download all fonts for the ZiaMade font pairing system.
 * Google Fonts: fetch CSS, extract woff2 URLs, download files
 * Fontshare: fetch CSS, extract woff2 URLs, download files
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(__dirname, '..', 'public', 'fonts');
mkdirSync(FONTS_DIR, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchText(url, headers = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, ...headers } });
  return res.text();
}

async function fetchBinary(url) {
  const res = await fetch(url);
  return Buffer.from(await res.arrayBuffer());
}

async function downloadGoogleVariable(family, slug, weightRange) {
  const encoded = encodeURIComponent(family);
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weightRange}&display=swap`;
  const css = await fetchText(cssUrl);

  // Extract the first woff2 URL (latin subset, variable font)
  const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)];
  if (urls.length === 0) {
    console.log(`  [!] No woff2 found for ${family}`);
    return;
  }

  // For variable fonts, Google may return multiple URLs for different subsets
  // We want the latin one (usually the last or a prominent one)
  const latinBlock = css.split('/* latin */').pop() || css;
  const latinUrl = latinBlock.match(/url\((https:\/\/[^)]+\.woff2)\)/);
  const url = latinUrl ? latinUrl[1] : urls[0][1];

  const outfile = join(FONTS_DIR, `${slug}-variable.woff2`);
  if (existsSync(outfile)) {
    console.log(`  ${slug}-variable.woff2 (exists)`);
    return;
  }

  const data = await fetchBinary(url);
  writeFileSync(outfile, data);
  console.log(`  ${slug}-variable.woff2 (${(data.length / 1024).toFixed(0)}KB)`);
}

async function downloadGoogleSingle(family, slug) {
  const encoded = encodeURIComponent(family);
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encoded}&display=swap`;
  const css = await fetchText(cssUrl);

  const latinBlock = css.split('/* latin */').pop() || css;
  const match = latinBlock.match(/url\((https:\/\/[^)]+\.woff2)\)/);
  if (!match) {
    console.log(`  [!] No woff2 found for ${family}`);
    return;
  }

  const outfile = join(FONTS_DIR, `${slug}-400.woff2`);
  if (existsSync(outfile)) {
    console.log(`  ${slug}-400.woff2 (exists)`);
    return;
  }

  const data = await fetchBinary(match[1]);
  writeFileSync(outfile, data);
  console.log(`  ${slug}-400.woff2 (${(data.length / 1024).toFixed(0)}KB)`);
}

async function downloadFontshare(family, slug) {
  // Fontshare variable font CSS: @1 means variable weight axis
  const cssUrl = `https://api.fontshare.com/v2/css?f[]=${slug}@1&display=swap`;
  const css = await fetchText(cssUrl, {});

  // Fontshare uses protocol-relative URLs with single quotes: url('//cdn.fontshare.com/...')
  const urls = [...css.matchAll(/url\('(\/\/[^']+\.woff2)'\)/g)];
  if (urls.length === 0) {
    console.log(`  [!] No woff2 found for ${family} (${slug})`);
    return;
  }

  const outfile = join(FONTS_DIR, `${slug}-variable.woff2`);
  if (existsSync(outfile)) {
    console.log(`  ${slug}-variable.woff2 (exists)`);
    return;
  }

  // Prepend https: to protocol-relative URL
  const fullUrl = `https:${urls[0][1]}`;
  const data = await fetchBinary(fullUrl);
  writeFileSync(outfile, data);
  console.log(`  ${slug}-variable.woff2 (${(data.length / 1024).toFixed(0)}KB)`);
}

async function downloadGoogleStatic(family, slug, weights) {
  // For fonts that don't have variable axes (e.g., Barlow Condensed)
  const encoded = encodeURIComponent(family);
  const weightStr = weights.map(String).join(';');
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weightStr}&display=swap`;
  const css = await fetchText(cssUrl);

  // Download each weight separately
  for (const weight of weights) {
    const outfile = join(FONTS_DIR, `${slug}-${weight}.woff2`);
    if (existsSync(outfile)) {
      console.log(`  ${slug}-${weight}.woff2 (exists)`);
      continue;
    }

    // Find the block for this weight in latin subset
    const blocks = css.split('@font-face');
    for (const block of blocks) {
      if (block.includes(`font-weight: ${weight}`) && block.includes('/* latin */') ||
          (block.includes(`font-weight: ${weight}`) && !block.includes('latin-ext'))) {
        const match = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
        if (match) {
          const data = await fetchBinary(match[1]);
          writeFileSync(outfile, data);
          console.log(`  ${slug}-${weight}.woff2 (${(data.length / 1024).toFixed(0)}KB)`);
          break;
        }
      }
    }
  }
}

async function main() {
  console.log('=== Google Variable Fonts ===');
  await downloadGoogleVariable('Source Sans 3', 'source-sans-3', '200..900');
  // Barlow Condensed is not a variable font — download static weights
  await downloadGoogleStatic('Barlow Condensed', 'barlow-condensed', [400, 600, 700]);
  await downloadGoogleVariable('Teko', 'teko', '300..700');
  await downloadGoogleVariable('Hanken Grotesk', 'hanken-grotesk', '100..900');
  await downloadGoogleVariable('Bricolage Grotesque', 'bricolage-grotesque', '200..800');
  await downloadGoogleVariable('Libre Franklin', 'libre-franklin', '100..900');
  await downloadGoogleVariable('Sora', 'sora', '100..800');
  await downloadGoogleVariable('Outfit', 'outfit', '100..900');
  await downloadGoogleVariable('Schibsted Grotesk', 'schibsted-grotesk', '400..900');
  await downloadGoogleVariable('Fraunces', 'fraunces', '100..900');
  await downloadGoogleVariable('Nunito Sans', 'nunito-sans', '200..1000');
  await downloadGoogleVariable('DM Sans', 'dm-sans', '100..1000');
  await downloadGoogleVariable('Lora', 'lora', '400..700');
  await downloadGoogleVariable('Plus Jakarta Sans', 'plus-jakarta-sans', '200..800');
  await downloadGoogleVariable('Figtree', 'figtree', '300..900');
  await downloadGoogleVariable('Caveat', 'caveat', '400..700');
  await downloadGoogleVariable('Unbounded', 'unbounded', '200..900');
  await downloadGoogleVariable('Archivo Narrow', 'archivo-narrow', '400..700');
  await downloadGoogleVariable('Cinzel', 'cinzel', '400..900');
  await downloadGoogleVariable('Playfair Display', 'playfair-display', '400..900');
  await downloadGoogleVariable('Cormorant Garamond', 'cormorant-garamond', '300..700');
  await downloadGoogleVariable('Space Grotesk', 'space-grotesk', '300..700');
  await downloadGoogleVariable('Lexend', 'lexend', '100..900');
  await downloadGoogleVariable('Josefin Sans', 'josefin-sans', '100..700');

  console.log('\n=== Google Single-Weight Fonts ===');
  await downloadGoogleSingle('Instrument Serif', 'instrument-serif');
  await downloadGoogleSingle('Bebas Neue', 'bebas-neue');
  await downloadGoogleSingle('Archivo Black', 'archivo-black');
  await downloadGoogleSingle('Russo One', 'russo-one');
  await downloadGoogleSingle('Righteous', 'righteous');
  await downloadGoogleSingle('Bungee', 'bungee');
  await downloadGoogleSingle('Alfa Slab One', 'alfa-slab-one');
  await downloadGoogleSingle('Pacifico', 'pacifico');
  await downloadGoogleSingle('Sacramento', 'sacramento');
  await downloadGoogleSingle('Permanent Marker', 'permanent-marker');

  console.log('\n=== Fontshare Fonts ===');
  await downloadFontshare('Clash Display', 'clash-display');
  await downloadFontshare('Satoshi', 'satoshi');
  await downloadFontshare('General Sans', 'general-sans');
  await downloadFontshare('Cabinet Grotesk', 'cabinet-grotesk');
  await downloadFontshare('Zodiak', 'zodiak');
  await downloadFontshare('Panchang', 'panchang');
  await downloadFontshare('Boska', 'boska');
  await downloadFontshare('Gambetta', 'gambetta');
  await downloadFontshare('Chillax', 'chillax');

  console.log('\n=== Done ===');
  const { readdirSync, statSync } = await import('fs');
  const files = readdirSync(FONTS_DIR).filter(f => f.endsWith('.woff2'));
  const totalKB = files.reduce((sum, f) => sum + statSync(join(FONTS_DIR, f)).size / 1024, 0);
  console.log(`${files.length} font files in public/fonts/ (${(totalKB / 1024).toFixed(1)}MB total)`);
}

main().catch(console.error);
