import { defineConfig, devices } from '@playwright/test';

const PORT = 4181;

/**
 * End-to-end tests run against the real production build (prerendered HTML +
 * hydration), served the way a static host with clean URLs would serve it.
 * Run `npm run build` first; `npm run test:e2e` does not rebuild.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `node scripts/serve.mjs`,
    env: { PORT: String(PORT), INQUIRY_FAKE_SENDER: '1' },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
