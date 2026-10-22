import { SERVICES } from '@/data/services';
import { PROJECTS } from '@/data/projects';
import { ARTICLES } from '@/data/articles';

/**
 * Every public, indexable URL. Drives prerendering and sitemap.xml, and the
 * tests use it to check for broken internal links.
 */
export function getStaticPaths(): string[] {
  return [
    '/',
    '/services',
    ...SERVICES.map((s) => `/services/${s.slug}`),
    '/portfolio',
    ...PROJECTS.map((p) => `/portfolio/${p.slug}`),
    '/process',
    '/about',
    '/insights',
    ...ARTICLES.map((a) => `/insights/${a.slug}`),
    '/contact',
    '/privacy',
  ];
}

/** Last-modified date for sitemap entries where we genuinely know one. */
export function getLastModified(path: string): string | undefined {
  const article = ARTICLES.find((a) => path === `/insights/${a.slug}`);
  return article ? (article.updated ?? article.published) : undefined;
}
