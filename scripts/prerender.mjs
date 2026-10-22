/**
 * Build-time prerendering.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server entry).
 * For every public route it renders the React tree to HTML, injects the
 * route's <title>, meta, canonical, Open Graph and JSON-LD into the head, and
 * writes a static file. The browser then hydrates that markup.
 *
 * Output layout uses "<route>.html" (e.g. dist/services/web-development.html)
 * so hosts with clean-URL support serve /services/web-development without a
 * trailing-slash redirect, matching the canonical URLs.
 *
 * Also writes dist/404.html, dist/sitemap.xml and dist/robots.txt.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const template = await readFile(join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the <!--app-head--> / <!--app-html--> placeholders');
}

const { render, getStaticPaths, getLastModified, preloadAllPages, matchRouteEntry, SITE } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
);
// Pages are code-split; load them all so renderToString never suspends.
await preloadAllPages();

// Each route preloads its own page chunk (and that chunk's static imports) so
// hydration doesn't wait on a second round trip.
const manifestPath = join(dist, '.vite', 'manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entryKey = Object.keys(manifest).find((k) => manifest[k].isEntry);
const entryFile = entryKey ? manifest[entryKey].file : '';
function chunkFiles(key, acc = new Set()) {
  const chunk = manifest[key];
  if (!chunk) throw new Error(`Module ${key} not found in Vite manifest`);
  if (chunk.file !== entryFile) acc.add(chunk.file);
  for (const imp of chunk.imports ?? []) if (!acc.has(manifest[imp]?.file)) chunkFiles(imp, acc);
  return acc;
}
const preloadsFor = (route) =>
  [...chunkFiles(matchRouteEntry(route).module)]
    .map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`)
    .join('\n    ');

// Preload the self-hosted Latin font file so text renders in Geist immediately.
const assets = await readdir(join(dist, 'assets'));
const font = assets.find((f) => /^geist-latin-wght-normal.*\.woff2$/.test(f));
const fontPreload = font
  ? `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin>`
  : '';

const outFile = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);

function page(route) {
  const { html, head } = render(route);
  if (!html || html.length < 200) throw new Error(`Prerender produced almost no HTML for ${route}`);
  return template
    .replace('<!--app-head-->', `${fontPreload}\n    ${preloadsFor(route)}\n    ${head}`)
    .replace('<!--app-html-->', html);
}

const routes = getStaticPaths();
const seen = new Set();
for (const route of routes) {
  if (seen.has(route)) throw new Error(`Duplicate route ${route}`);
  seen.add(route);
  const file = join(dist, outFile(route));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(route));
}
await writeFile(join(dist, '404.html'), page('/__not-found__'));
console.log(`prerendered ${routes.length} routes + 404.html`);

// Sitemap: absolute canonical URLs only. lastmod only where we genuinely know it.
const urls = routes
  .map((route) => {
    const loc = route === '/' ? `${SITE.url}/` : `${SITE.url}${route}`;
    const lastmod = getLastModified(route);
    return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
  })
  .join('\n');
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

const robots = SITE.noindex
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;
await writeFile(join(dist, 'robots.txt'), robots);
console.log(`wrote sitemap.xml (${routes.length} URLs) and robots.txt${SITE.noindex ? ' (noindex mode)' : ''}`);

await rm(ssrDir, { recursive: true, force: true });
await rm(join(dist, '.vite'), { recursive: true, force: true });
