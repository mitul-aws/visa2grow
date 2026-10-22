/**
 * Site-wide facts. Keep this file honest: only facts that are true today.
 * The canonical origin comes from VITE_SITE_URL (see .env.example).
 */
const envUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();

export const SITE = {
  name: 'Visa2Grow',
  // www is the main address (DNS stays at GoDaddy, which can't point the bare domain at CloudFront).
  url: (envUrl || 'https://www.visa2grow.com').replace(/\/+$/, ''),
  tagline: 'IDEAS · CODE · GROW',
  positioning: 'AI-First Software Development',
  description:
    'Visa2Grow is an AI-first software development studio. We build web applications, mobile apps and AI-powered solutions with human-reviewed engineering.',
  ogImage: '/brand/og-image.png',
  ogImageAlt: 'Visa2Grow — Ideas to Impact. Powered by AI.',
  locale: 'en',
  /** Experience behind the founding expertise, not company age. */
  experienceYears: '10+',
  noindex: import.meta.env.VITE_NOINDEX === 'true',
  /**
   * Where the inquiry form posts. Defaults to the serverless function in
   * api/inquiry.ts. Override with VITE_CONTACT_ENDPOINT (set it to "none" to
   * disable online submission, e.g. on a host without serverless functions).
   */
  contactEndpoint: (() => {
    const v = ((import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ?? '').trim();
    return v === 'none' ? '' : v || '/api/inquiry';
  })(),
  /** Public sales inbox. VITE_CONTACT_EMAIL can override it per environment. */
  contactEmail: ((import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? '').trim() || 'sales@visa2grow.com',
} as const;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  return `${SITE.url}${clean.startsWith('/') || clean === '' ? clean : `/${clean}`}`;
}
