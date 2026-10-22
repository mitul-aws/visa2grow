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
