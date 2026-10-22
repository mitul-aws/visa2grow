/**
 * Generates every static brand asset from the single geometry source.
 *
 *   npm run brand
 *
 * Outputs (committed to the repo, so the site build does not depend on this):
 *   public/brand/visa2grow-logo.svg          primary: gradient mark + ink wordmark + tagline
 *   public/brand/visa2grow-logo-dark.svg     for dark backgrounds: gradient mark + white wordmark
 *   public/brand/visa2grow-logo-mono.svg     single colour (ink)
 *   public/brand/visa2grow-logo-mono-white.svg
 *   public/brand/visa2grow-symbol.svg        standalone V2G mark
 *   public/brand/visa2grow-symbol-512.png    raster mark for structured data / profiles
 *   public/favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
 *   public/brand/og-image.png                1200x630 social sharing image
 *
 * Wordmark text is converted to outlines (Geist Bold/SemiBold, SIL OFL), so the
 * SVGs render identically without the font installed.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import opentype from 'opentype.js';
import { chromium } from '@playwright/test';
import {
  BRAND_COLORS,
  LOCKUP_GAP_EM,
  MARK_BASELINE,
  MARK_GRADIENT,
  MARK_LETTER_TOP,
  MARK_PATHS,
  MARK_STROKE,
  WORDMARK_CAP_HEIGHT,
} from '../../src/components/brand/geometry.ts';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const pub = join(root, 'public');
const brandDir = join(pub, 'brand');
mkdirSync(brandDir, { recursive: true });

const loadFont = (file: string) => {
  const buf = readFileSync(join(here, 'fonts', file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const bold = loadFont('Geist-Bold.ttf');
const semibold = loadFont('Geist-SemiBold.ttf');

const r = (n: number) => Math.round(n * 100) / 100;

/** Outline text with tracking (in em). Returns one path string per glyph and the total advance. */
function outline(font: opentype.Font, text: string, x: number, y: number, size: number, trackingEm = 0) {
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(text);
  const parts: string[] = [];
  let cursor = x;
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(cursor, y, size).toPathData({ decimalPlaces: 2, flipY: false }));
    const next = glyphs[i + 1];
    const kern = next ? font.getKerningValue(g, next) * scale : 0;
    cursor += (g.advanceWidth ?? 0) * scale + kern + (next ? trackingEm * size : 0);
  });
  return { parts, width: cursor - x };
}

// ---- Mark ---------------------------------------------------------------
// Geometry lives in a 79 x 47 box starting at (0, 4.5).
const MARK_W = 79;
const MARK_H = 47;
const MARK_Y0 = 4.5;

function gradientDef(id: string, tx = 0, ty = 0, s = 1) {
  const g = MARK_GRADIENT;
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r(tx + g.x1 * s)}" y1="${r(ty + g.y1 * s)}" x2="${r(tx + g.x2 * s)}" y2="${r(ty + g.y2 * s)}">${g.stops
    .map((st) => `<stop offset="${st.offset}" stop-color="${st.color}"/>`)
    .join('')}</linearGradient>`;
}

function markGroup(paint: string, tx: number, ty: number, s: number, stroke = MARK_STROKE) {
  const paths = Object.values(MARK_PATHS)
    .map((d) => `<path d="${d}"/>`)
    .join('');
  return `<g transform="translate(${r(tx)} ${r(ty)}) scale(${r(s)})" fill="none" stroke="${paint}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
}

// ---- Full logo ----------------------------------------------------------
type Tone = 'light' | 'dark' | 'mono' | 'mono-white';

function logoSvg(tone: Tone): string {
  // Same rule as the React <Logo>: the mark's "2G" matches the wordmark's cap
  // height and sits on its baseline; the V and arrow rise above.
  const pad = 8;
  const wordSize = 74;
  const s = (WORDMARK_CAP_HEIGHT * wordSize) / (MARK_BASELINE - MARK_LETTER_TOP);
  const half = MARK_STROKE / 2;
  const markTopUnit = 9 - half; // arrow tip, outside of stroke
  const markLeftUnit = 4 - half; // V's left arm
  const markRightUnit = 75.5 + half; // G's right edge
  const markBottomUnit = 47 + half; // V's point
  const wordBaseline = pad + (MARK_BASELINE - markTopUnit) * s;
  const tx = pad - markLeftUnit * s;
  const ty = wordBaseline - MARK_BASELINE * s;
  const textX = tx + markRightUnit * s + LOCKUP_GAP_EM * wordSize;
  const word = outline(bold, 'Visa2Grow', textX, wordBaseline, wordSize, -0.025);
  const tagSize = Math.round(wordSize * 0.36); // same proportion as the site logo
  const tagBaseline = wordBaseline + Math.round(tagSize * 1.75);
  // Track the tagline so it spans exactly the wordmark's width, like the site logo.
  const TAG = 'IDEAS · CODE · GROW';
  const untracked = outline(semibold, TAG, 0, 0, tagSize, 0).width;
  const tracking = (word.width - untracked) / (tagSize * (semibold.stringToGlyphs(TAG).length - 1));
  const tag = outline(semibold, TAG, textX, tagBaseline, tagSize, tracking);
  const width = Math.ceil(textX + Math.max(word.width, tag.width) + pad);
  const height = Math.ceil(Math.max(ty + markBottomUnit * s, tagBaseline + 4) + pad);

  const ink = tone === 'dark' || tone === 'mono-white' ? '#FFFFFF' : BRAND_COLORS.ink;
  const tagColor = tone === 'dark' ? '#B6C2D9' : tone === 'mono-white' ? '#FFFFFF' : tone === 'mono' ? BRAND_COLORS.ink : '#52617A';
  const mono = tone === 'mono' || tone === 'mono-white';
  const markPaint = mono ? ink : 'url(#v2g-mark)';
  const twoPaint = mono ? ink : 'url(#v2g-two)';

  const twoIndex = 4; // "Visa2Grow"[4] === "2"
  const wordPaths = word.parts
    .map((d, i) => `<path d="${d}" fill="${i === twoIndex ? twoPaint : ink}"/>`)
    .join('');

  const defs = mono
    ? ''
    : `<defs>${gradientDef('v2g-mark', tx, ty, s)}<linearGradient id="v2g-two" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${BRAND_COLORS.blue}"/><stop offset="1" stop-color="${BRAND_COLORS.violet}"/></linearGradient></defs>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Visa2Grow">
<title>Visa2Grow</title>
${defs}
${markGroup(markPaint, tx, ty, s)}
${wordPaths}
<g fill="${tagColor}">${tag.parts.map((d) => `<path d="${d}"/>`).join('')}</g>
</svg>
`;
}

function symbolSvg(): string {
  const pad = 3;
  const w = MARK_W + pad * 2;
  const h = MARK_H + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 4}" height="${h * 4}" role="img" aria-label="Visa2Grow V2G symbol">
<title>Visa2Grow</title>
<defs>${gradientDef('v2g-mark', pad, pad - MARK_Y0)}</defs>
${markGroup('url(#v2g-mark)', pad, pad - MARK_Y0, 1)}
</svg>
`;
}

/** Square app icon: gradient tile with a white mark. */
function iconSvg(size = 64): string {
  const s = 0.68;
  const tx = (64 - MARK_W * s) / 2;
  const ty = (64 - MARK_H * s) / 2 - MARK_Y0 * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
<defs><linearGradient id="tile" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${BRAND_COLORS.blue}"/><stop offset=".6" stop-color="${BRAND_COLORS.violet}"/><stop offset="1" stop-color="${BRAND_COLORS.cyan}"/></linearGradient></defs>
<rect width="64" height="64" rx="14" fill="url(#tile)"/>
${markGroup('#FFFFFF', tx, ty, s, 6.5)}
</svg>
`;
}

const files: Record<string, string> = {
  'brand/visa2grow-logo.svg': logoSvg('light'),
  'brand/visa2grow-logo-dark.svg': logoSvg('dark'),
  'brand/visa2grow-logo-mono.svg': logoSvg('mono'),
  'brand/visa2grow-logo-mono-white.svg': logoSvg('mono-white'),
  'brand/visa2grow-symbol.svg': symbolSvg(),
  'favicon.svg': iconSvg(),
};
for (const [rel, svg] of Object.entries(files)) {
  writeFileSync(join(pub, rel), svg);
  console.log('wrote', rel);
}

// ---- Rasters via headless Chromium --------------------------------------
const geistBoldUrl = pathToFileURL(join(here, 'fonts', 'Geist-Bold.ttf')).href;
const geistSemiUrl = pathToFileURL(join(here, 'fonts', 'Geist-SemiBold.ttf')).href;

const ogHtml = `<!doctype html><html><head><style>
@font-face{font-family:G;src:url('${geistBoldUrl}');font-weight:700}
@font-face{font-family:G;src:url('${geistSemiUrl}');font-weight:600}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#081329;font-family:G,sans-serif;color:#fff;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.05) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(ellipse at 70% 30%,#000,transparent 75%)}
.g1{position:absolute;width:720px;height:420px;border-radius:50%;background:rgba(40,88,245,.45);filter:blur(110px);top:-160px;right:-120px}
.g2{position:absolute;width:560px;height:360px;border-radius:50%;background:rgba(133,70,248,.4);filter:blur(110px);bottom:-200px;left:180px}
.wrap{position:absolute;inset:0;padding:76px 84px;display:flex;flex-direction:column;justify-content:space-between}
h1{font-size:84px;line-height:1.02;letter-spacing:-.035em;font-weight:700}
h1 span{background:linear-gradient(100deg,#20C8F5,#9d74ff 70%);-webkit-background-clip:text;color:transparent}
.foot{display:flex;justify-content:space-between;align-items:flex-end;font-weight:600;font-size:24px;color:#B6C2D9}
.pill{display:inline-block;border:1px solid rgba(32,200,245,.4);background:rgba(32,200,245,.1);color:#20C8F5;border-radius:999px;padding:8px 18px;font-size:20px;font-weight:600;letter-spacing:.02em;margin-bottom:26px}
</style></head><body><div class="grid"></div><div class="g1"></div><div class="g2"></div>
<div class="wrap">
<div>${logoSvg('dark').replace('<svg ', '<svg style="height:76px;width:auto" ')}</div>
<div><div class="pill">AI-First Software Development</div><h1>Ideas to Impact.<br><span>Powered by AI.</span></h1></div>
<div class="foot"><div>Web · Mobile · AI &amp; Automation · Cloud</div><div>visa2grow.com</div></div>
</div></body></html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const shoot = async (html: string, w: number, h: number, out: string, transparent = false) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(pub, out), omitBackground: transparent });
    console.log('wrote', out);
  };
  const svgPage = (svg: string, w: number, h: number) =>
    `<!doctype html><style>*{margin:0}body{width:${w}px;height:${h}px;display:grid;place-items:center;background:transparent}svg{width:${w}px;height:${h}px}</style>${svg}`;

  await shoot(svgPage(iconSvg(), 32, 32), 32, 32, 'favicon-32.png', true);
  await shoot(svgPage(iconSvg().replace('rx="14"', 'rx="0"'), 180, 180), 180, 180, 'apple-touch-icon.png');
  await shoot(svgPage(iconSvg(), 192, 192), 192, 192, 'icon-192.png', true);
  await shoot(svgPage(iconSvg().replace('rx="14"', 'rx="0"'), 512, 512), 512, 512, 'icon-512.png');
  const sym = symbolSvg();
  await shoot(
    `<!doctype html><style>*{margin:0}body{width:512px;height:512px;display:grid;place-items:center;background:#fff}svg{width:400px;height:auto}</style>${sym}`,
    512,
    512,
    'brand/visa2grow-symbol-512.png',
  );
  await shoot(ogHtml, 1200, 630, 'brand/og-image.png');
} finally {
  await browser.close();
}

writeFileSync(
  join(pub, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'Visa2Grow',
      short_name: 'Visa2Grow',
      description: 'AI-First Software Development',
      start_url: '/',
      display: 'browser',
      background_color: '#F6F8FC',
      theme_color: '#081329',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ) + '\n',
);
console.log('wrote site.webmanifest');
