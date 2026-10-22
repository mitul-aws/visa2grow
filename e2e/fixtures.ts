import { test as base, expect } from '@playwright/test';

/** Fails any test whose page logs a console error or throws, unless the test opts out. */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('console', (m) => {
        // 404 pages and the deliberate 502 in the delivery-failure test are expected.
        if (m.type() === 'error' && !/status of (404|502)/.test(m.text())) errors.push(m.text());
      });
      page.on('pageerror', (e) => errors.push(String(e)));
      await use(errors);
      expect(errors, 'console errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const STATIC_ROUTES = [
  '/',
  '/services',
  '/services/web-development',
  '/services/mobile-app-development',
  '/services/ai-automation',
  '/services/backend-api-development',
  '/services/ui-ux-design',
  '/services/cloud-devops-qa',
  '/services/code-audit',
  '/services/scaling-consulting',
  '/portfolio',
  '/portfolio/ai-document-assistant',
  '/portfolio/offline-field-inspection-app',
  '/portfolio/retail-operations-dashboard',
  '/process',
  '/about',
  '/insights',
  '/insights/ai-assisted-development-what-it-speeds-up',
  '/insights/vite-or-nextjs-for-seo',
  '/insights/scoping-an-mvp',
  '/contact',
  '/privacy',
];
