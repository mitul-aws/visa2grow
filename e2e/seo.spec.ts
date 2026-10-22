import { test, expect, STATIC_ROUTES } from './fixtures';

const ORIGIN = 'https://www.visa2grow.com';

test.describe('crawlable HTML (no JavaScript)', () => {
  test('every route ships its content, title and metadata in the initial HTML', async ({ request }) => {
    for (const route of STATIC_ROUTES) {
      const res = await request.get(route);
      expect(res.status(), route).toBe(200);
      const html = await res.text();
      expect(html, route).toMatch(/<title>[^<]+<\/title>/);
      expect(html, route).toContain(`<link rel="canonical" href="${route === '/' ? ORIGIN : ORIGIN + route}"`);
      expect(html, route).toContain('<meta property="og:image" content="https://');
      expect(html, route).toContain('application/ld+json');
      expect(html.match(/<h1[\s>]/g)?.length, route).toBe(1);
      // Real body copy, not an empty SPA shell.
      expect(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').length, route).toBeGreaterThan(1500);
    }
  });

  test('pages are readable and navigable with JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ideas to Impact');
    await expect(page.getByRole('heading', { name: 'Web Development' })).toBeVisible();
    await page.getByRole('contentinfo').getByRole('link', { name: 'Cloud, DevOps & QA' }).click();
    await expect(page).toHaveURL('/services/cloud-devops-qa');
    await expect(page.getByText('Will AI replace', { exact: false })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Cloud, DevOps & QA: common questions/ })).toBeVisible();
    await context.close();
  });
});

test.describe('technical SEO files', () => {
  test('sitemap lists every public route and nothing else', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.sort()).toEqual(STATIC_ROUTES.map((r) => (r === '/' ? `${ORIGIN}/` : ORIGIN + r)).sort());
  });

  test('robots.txt allows crawling and points to the sitemap', async ({ request }) => {
    const txt = await (await request.get('/robots.txt')).text();
    expect(txt).toContain('Allow: /');
    expect(txt).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

  test('unknown URLs return a real 404 with noindex', async ({ page }) => {
    const res = await page.goto('/this/does/not/exist');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page doesn’t exist');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test('trailing-slash URLs redirect to the canonical form', async ({ request }) => {
    const res = await request.get('/services/', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()['location']).toBe('/services');
  });

  test('brand assets are served', async ({ request }) => {
    for (const p of ['/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/brand/og-image.png', '/brand/visa2grow-logo.svg', '/site.webmanifest']) {
      expect((await request.get(p)).status(), p).toBe(200);
    }
  });
});
