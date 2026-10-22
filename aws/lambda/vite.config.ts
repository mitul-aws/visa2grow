/**
 * Bundles the inquiry Lambda into a single ESM file: dist-lambda/index.mjs
 * (handler: index.handler). Everything is bundled except the AWS SDK, which
 * the Lambda Node.js runtime already provides.
 *
 *   npm run build:lambda
 */
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  root,
  publicDir: false,
  ssr: {
    target: 'node',
    noExternal: true,
    external: ['@aws-sdk/client-ssm'],
  },
  build: {
    ssr: 'aws/lambda/inquiry.ts',
    outDir: 'dist-lambda',
    emptyOutDir: true,
    target: 'node22',
    minify: false,
    sourcemap: false,
    rolldownOptions: {
      output: { format: 'esm', entryFileNames: 'index.mjs' },
    },
  },
});
