/**
 * Minimal static server for the prerendered build, mirroring how production
 * hosts with "clean URLs" behave:
 *   /services/web-development  -> dist/services/web-development.html
 *   /services/web-development/ -> 308 redirect to the slash-less canonical
 *   /something-unknown         -> dist/404.html with HTTP 404
 *   POST /api/inquiry          -> the same handler Vercel runs (built to dist-server/)
 * Used by `npm run preview` and the Playwright tests. Not a production server.
 *
 * INQUIRY_FAKE_SENDER=1 swaps Resend for a fake sender (used by the e2e tests),
 * which fails when the description contains "[simulate-failure]".
 */
import { createServer } from 'node:http';
import { createReadStream, readFileSync } from 'node:fs';
import { createBrotliCompress, createGzip } from 'node:zlib';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve(import.meta.dirname, '..', 'dist');
const port = Number(process.env.PORT ?? 4180);

// Same Content-Security-Policy CloudFront sends in production (aws/cloudformation.yml),
// so the e2e tests catch anything it would block. upgrade-insecure-requests is
// dropped because this server is plain http.
const CSP = readFileSync(resolve(import.meta.dirname, '..', 'aws', 'content-security-policy.txt'), 'utf8')
  .trim()
  .split(';')
  .map((d) => d.trim())
  .filter((d) => d && d !== 'upgrade-insecure-requests')
  .join('; ');

let api = null;
try {
  api = await import(pathToFileURL(resolve(import.meta.dirname, '..', 'dist-server', 'local.js')).href);
} catch {
  console.warn('dist-server/local.js not found; /api/inquiry disabled (run npm run build).');
}
const apiConfig = api ? api.configFromEnv(process.env) : null;
let fakeSender;
if (api && process.env.INQUIRY_FAKE_SENDER) {
  Object.assign(apiConfig, { resendApiKey: 'fake', notificationEmail: 'owner@example.test', fromEmail: 'Visa2Grow <inquiries@example.test>' });
  fakeSender = async (email) => {
    if (email.text.includes('[simulate-failure]')) throw new api.ProviderError(500, 'simulated_failure');
    return 'fake-message-id';
  };
}
apiConfig?.allowedOrigins.push(`http://localhost:${port}`, `http://127.0.0.1:${port}`);
// A fresh, generous limiter so repeated test runs aren't throttled.
const apiLimiter = api ? new api.RateLimiter(100, 60_000) : null;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
};

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.svg', '.xml', '.txt', '.webmanifest', '.json']);

// Compress like production hosts do, so local Lighthouse numbers are realistic.
function send(req, res, file, status = 200) {
  const ext = extname(file);
  const immutable = file.includes(`${join(dist, 'assets')}`);
  const accept = String(req.headers['accept-encoding'] ?? '');
  const encoding = !COMPRESSIBLE.has(ext) ? null : accept.includes('br') ? 'br' : accept.includes('gzip') ? 'gzip' : null;
  res.writeHead(status, {
    'Content-Type': TYPES[ext] ?? 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': CSP,
    Vary: 'Accept-Encoding',
    ...(encoding ? { 'Content-Encoding': encoding } : {}),
  });
  const stream = createReadStream(file);
  if (encoding === 'br') stream.pipe(createBrotliCompress()).pipe(res);
  else if (encoding === 'gzip') stream.pipe(createGzip()).pipe(res);
  else stream.pipe(res);
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname === '/api/inquiry' && api) {
    const request = await api.nodeToWebRequest(req, `http://localhost:${port}`);
    const response = await api.handleInquiry(request, { config: apiConfig, sendEmail: fakeSender, rateLimiter: apiLimiter });
    return api.sendWebResponse(res, response);
  }
  let path = decodeURIComponent(url.pathname);
  if (path.length > 1 && path.endsWith('/')) {
    res.writeHead(308, { Location: path.replace(/\/+$/, '') + url.search });
    return res.end();
  }
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
  const candidates = path === '/' ? ['index.html'] : [safe, `${safe}.html`];
  for (const c of candidates) {
    const file = join(dist, c);
    if (file.startsWith(dist) && (await isFile(file))) return send(req, res, file);
  }
  return send(req, res, join(dist, '404.html'), 404);
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));
