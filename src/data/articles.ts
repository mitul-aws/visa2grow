import type { ArticleMeta } from '@/types/content';

/**
 * Insights article metadata, authored by Visa2Grow as an organisation (no
 * invented author bios). Bodies live in article-bodies.ts and load only with
 * the article page.
 *
 * To publish: add metadata here and the body in article-bodies.ts. Listing,
 * routes, sitemap and prerendering pick it up automatically. A unit test
 * checks that readingMinutes matches the body.
 */
export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'ai-assisted-development-what-it-speeds-up',
    title: 'AI-assisted development: what it speeds up, and what it shouldn’t',
    description:
      'Where AI coding tools genuinely accelerate software delivery, where they introduce risk, and the review practices that keep quality high.',
    category: 'AI Engineering',
    published: '2026-10-22',
    readingMinutes: 3,
    relatedServices: ['ai-automation', 'web-development'],
  },
  {
    slug: 'vite-or-nextjs-for-seo',
    title: 'Vite or Next.js? Choosing a React setup when SEO matters',
    description:
      'A practical decision guide for React projects that need to be found in search: client rendering, prerendering and server rendering compared.',
    category: 'Web Development',
    published: '2026-10-22',
    readingMinutes: 2,
    relatedServices: ['web-development', 'cloud-devops-qa'],
  },
  {
    slug: 'scoping-an-mvp',
    title: 'Scoping an MVP: turning an idea into a buildable first release',
    description:
      'A step-by-step way to shrink a product idea into a first release that tests the riskiest assumption, without building throwaway code.',
    category: 'Product & MVP',
    published: '2026-10-22',
    readingMinutes: 2,
    relatedServices: ['ui-ux-design', 'web-development', 'mobile-app-development'],
  },
];

export function getArticle(slug: string | undefined): ArticleMeta | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function sortedArticles(): ArticleMeta[] {
  return [...ARTICLES].sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  // Format in UTC so server prerender and browser always agree.
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
