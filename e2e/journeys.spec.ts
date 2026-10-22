import { test, expect } from './fixtures';

test.describe('critical journeys', () => {
  test('home → service → contact with the service pre-selected', async ({ page, isMobile }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Ideas to Impact\.\s*Powered by\s*AI\./);

    await page.getByRole('link', { name: 'AI & Automation' }).first().click();
    await expect(page).toHaveURL('/services/ai-automation');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('AI development');
    await expect(page).toHaveTitle('AI Development & Workflow Automation | Visa2Grow');

    await page.getByRole('link', { name: 'Discuss Your Project' }).first().click();
    await expect(page).toHaveURL('/contact?service=ai-automation');
    await expect(page.getByLabel('Service', { exact: true })).toHaveValue('ai-automation');
    if (!isMobile) await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Contact' })).toHaveClass(/text-blue/);
  });

  test('hero CTAs lead to contact and portfolio', async ({ page }) => {
    await page.goto('/');
    await page.locator('#hero-heading').locator('..').getByRole('link', { name: 'Explore Our Work' }).click();
    await expect(page).toHaveURL('/portfolio');
    await page.goBack();
    await page.locator('#hero-heading').locator('..').getByRole('link', { name: 'Start a Project' }).click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { name: 'Project inquiry' })).toBeVisible();
  });

  test('desktop navigation reaches every section', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop nav is hidden on mobile');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const [label, url] of [
      ['Services', '/services'],
      ['Portfolio', '/portfolio'],
      ['Process', '/process'],
      ['About', '/about'],
      ['Insights', '/insights'],
      ['Contact', '/contact'],
      ['Home', '/'],
    ] as const) {
      await nav.getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('mobile menu opens, traps Escape, and navigates', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden();
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();

    await page.getByRole('button', { name: 'Open menu' }).click();
    await menu.getByRole('link', { name: 'Process' }).click();
    await expect(page).toHaveURL('/process');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('How we deliver');
  });

  test('portfolio shows published apps with working Play Store links', async ({ page }) => {
    await page.goto('/portfolio');
    const apps = page.getByTestId('apps-grid').getByRole('article');
    await expect(apps).toHaveCount(8);
    const fitrack = apps.filter({ hasText: 'FiTrack' });
    const link = fitrack.getByRole('link', { name: /view on google play/i });
    await expect(link).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=com.mitulparmar.fitrack');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);

    await page.getByRole('group', { name: /filter apps/i }).getByRole('button', { name: /^Health & Fitness/ }).click();
    await expect(apps).toHaveCount(1);
    await expect(apps.first()).toContainText('FiTrack');

    // Artwork actually loads.
    await apps.first().scrollIntoViewIfNeeded();
    const loaded = await apps.first().locator('img').first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(loaded).toBe(true);
  });

  test('portfolio concept filters and labelling', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.getByText('No client case studies published yet.')).toBeVisible();
    const concepts = page.locator('section', { has: page.locator('#concepts-heading') });
    const cards = concepts.getByRole('article');
    await expect(cards).toHaveCount(3);
    await concepts.getByRole('button', { name: /^Web/ }).click();
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Concept project');
    await cards.first().getByRole('link').click();
    await expect(page).toHaveURL('/portfolio/retail-operations-dashboard');
    await expect(page.getByText('This is a concept study, not a client project.')).toBeVisible();
  });

  test('insights article shows table of contents and related links', async ({ page }) => {
    await page.goto('/insights');
    await page.getByRole('link', { name: /Vite or Next\.js/ }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vite or Next.js');
    await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
    const types = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent ?? '{}')['@type']));
    expect(types).toContain('Article');
  });
});

test.describe('contact form', () => {
  async function fill(page: import('@playwright/test').Page, description: string) {
    await page.getByLabel('Name', { exact: true }).fill('Asha Rao');
    await page.getByLabel('Business email').fill('asha@example.com');
    await page.getByLabel('Service', { exact: true }).selectOption('web-development');
    await page.getByLabel(/Project description/).fill(description);
    await page.getByRole('checkbox').check();
    // The server treats sub-2.5s submissions as bots; a person takes longer.
    await page.waitForTimeout(2700);
  }

  test('validates in the browser before anything is sent', async ({ page }) => {
    const posts: string[] = [];
    page.on('request', (r) => r.method() === 'POST' && posts.push(r.url()));
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send Project Inquiry' }).click();
    await expect(page.getByRole('alert').first()).toContainText('Please fix 5 fields below.');
    await expect(page.getByLabel('Name', { exact: true })).toBeFocused();
    expect(posts).toEqual([]);
  });

  test('shows success only after the server confirms the inquiry', async ({ page }) => {
    await page.goto('/contact');
    await fill(page, 'A booking portal for our clinics with online payments and reminders.');
    const responsePromise = page.waitForResponse((r) => r.url().endsWith('/api/inquiry'));
    await page.getByRole('button', { name: 'Send Project Inquiry' }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true });
    await expect(page.getByRole('heading', { name: 'Thank you, your inquiry was sent.' })).toBeVisible();
  });

  test('explains a delivery failure and offers email instead', async ({ page }) => {
    await page.goto('/contact');
    await fill(page, 'Please build our portal. [simulate-failure] This should fail on purpose.');
    await page.getByRole('button', { name: 'Send Project Inquiry' }).click();
    await expect(page.getByText('Your inquiry was not sent.')).toBeVisible();
    await expect(page.getByRole('link', { name: /send it by email instead/i })).toHaveAttribute('href', /^mailto:sales@visa2grow\.com\?/);
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Asha Rao');
    await expect(page.getByText(/your inquiry was sent/i)).toHaveCount(0);
  });

  test('the endpoint only accepts same-site POST requests', async ({ request, baseURL }) => {
    expect((await request.get('/api/inquiry')).status()).toBe(405);
    const foreign = await request.post('/api/inquiry', { headers: { Origin: 'https://evil.example' }, data: {} });
    expect(foreign.status()).toBe(403);
    const invalid = await request.post('/api/inquiry', { headers: { Origin: baseURL! }, data: { name: 'A' } });
    expect(invalid.status()).toBe(422);
  });
});
