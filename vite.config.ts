/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Serves POST /api/inquiry during `npm run dev` with the same handler Vercel
 * runs, reading server-only variables (RESEND_API_KEY etc.) from .env.local.
 * Those variables stay in this Node process; only VITE_* values reach the browser.
 */
function inquiryApiDev(): Plugin {
  return {
    name: 'visa2grow-inquiry-api-dev',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      server.middlewares.use('/api/inquiry', async (req, res) => {
        const mod = (await server.ssrLoadModule('/server/local.ts')) as typeof import('./server/local');
        const origin = `http://${req.headers.host ?? 'localhost'}`;
        const config = mod.configFromEnv(env);
        config.allowedOrigins.push(origin);
        req.url = '/api/inquiry';
        const request = await mod.nodeToWebRequest(req, origin);
        await mod.sendWebResponse(res, await mod.handleInquiry(request, { config }));
      });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), inquiryApiDev()],
  // Baked in at build time so prerendered HTML and the hydrated app always agree.
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    // Server bundles (prerender entry, inquiry handler) don't need public/ assets.
    copyPublicDir: !isSsrBuild,
    // Read by scripts/prerender.mjs to emit <link rel="modulepreload"> per route.
    manifest: true,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.ts', 'aws/**/*.test.ts'],
    css: false,
  },
}));
