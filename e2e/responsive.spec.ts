import { test, expect, STATIC_ROUTES } from './fixtures';

const WIDTHS = [360, 768, 1024, 1440];

test.describe('responsive layout', () => {
  test.skip(({ isMobile }) => isMobile, 'widths are set explicitly; one project is enough');

  for (const width of WIDTHS) {
    test(`no horizontal scrolling or clipped content at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of STATIC_ROUTES) {
        await page.goto(route);
        const problems = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const out: string[] = [];
          if (document.documentElement.scrollWidth > vw) out.push(`scrollWidth ${document.documentElement.scrollWidth} > ${vw}`);
          // Any visible text-bearing element that sticks out of the viewport.
          for (const el of document.querySelectorAll<HTMLElement>('main h1, main h2, main h3, main p, main a, main button, main li, main label')) {
            if (el.closest('[aria-hidden="true"]')) continue;
            const r = el.getBoundingClientRect();
            if (r.width === 0) continue;
            if (r.right > vw + 1 || r.left < -1) out.push(`${el.tagName} "${(el.textContent ?? '').trim().slice(0, 40)}" ${Math.round(r.left)}..${Math.round(r.right)}`);
          }
          return out.slice(0, 5);
        });
        expect(problems, `${route} @ ${width}px`).toEqual([]);
      }
    });
  }

  test('touch targets in the header are at least 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    const box = await page.getByRole('button', { name: 'Open menu' }).boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('reduced motion shows all content without reveal animations', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const hidden = await page.evaluate(
      () => [...document.querySelectorAll('.reveal')].filter((n) => getComputedStyle(n).opacity !== '1').length,
    );
    expect(hidden).toBe(0);
    await context.close();
  });

  test('every content block appears when scrolled into view', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const route of ['/', '/services/code-audit', '/portfolio', '/process', '/about', '/insights']) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 350) {
        await page.mouse.wheel(0, 350);
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(800);
      const stuck = await page.evaluate(() =>
        [...document.querySelectorAll('.reveal')].filter((n) => getComputedStyle(n).opacity !== '1').length,
      );
      expect(stuck, `${route}: blocks still invisible after scrolling`).toBe(0);
    }
  });

  test('jumping to a section does not leave the content above it invisible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('End');
    await page.waitForTimeout(500);
    await page.keyboard.press('Home');
    await page.waitForTimeout(800);
    const top = await page.evaluate(() =>
      [...document.querySelectorAll('.reveal')]
        .filter((n) => n.getBoundingClientRect().top < innerHeight && getComputedStyle(n).opacity !== '1').length,
    );
    expect(top).toBe(0);
  });

  test('keyboard users can skip to content', async ({ page }) => {
    await page.goto('/about');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/about#main');
  });
});
