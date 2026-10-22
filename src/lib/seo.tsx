import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { SITE, absoluteUrl } from './site';
import { organizationJsonLd, type JsonLd } from './jsonld';

export interface SeoData {
  title: string;
  description: string;
  /** Route path, e.g. "/services". Omit for pages that must not have a canonical (404). */
  path?: string;
  noindex?: boolean;
  ogType?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  jsonLd?: JsonLd[];
  article?: { publishedTime: string; modifiedTime?: string; section?: string };
}

/**
 * During prerendering the server passes a collector; the <Seo> component
 * writes into it while rendering. In the browser the collector is unused and
 * <Seo> syncs document.head in an effect instead.
 */
export interface HeadCollector {
  data?: SeoData;
}

const SeoContext = createContext<HeadCollector | null>(null);

export function SeoProvider({ collector, children }: { collector?: HeadCollector; children: ReactNode }) {
  return <SeoContext.Provider value={collector ?? null}>{children}</SeoContext.Provider>;
}

export function formatTitle(title: string): string {
  return title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Serialise JSON-LD safely for embedding inside a <script> tag. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

/** All head tags except <title>, as HTML. Every tag carries data-seo so the client can replace them. */
export function buildHeadTags(data: SeoData): string {
  const title = formatTitle(data.title);
  const noindex = data.noindex || SITE.noindex;
  const image = absoluteUrl(data.image ?? SITE.ogImage);
  const imageAlt = data.imageAlt ?? SITE.ogImageAlt;
  const tags: string[] = [];
  const meta = (attr: 'name' | 'property', key: string, content: string) =>
    tags.push(`<meta ${attr}="${key}" content="${esc(content)}" data-seo>`);

  meta('name', 'description', data.description);
  meta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
  if (data.path && !noindex) tags.push(`<link rel="canonical" href="${esc(absoluteUrl(data.path))}" data-seo>`);

  meta('property', 'og:site_name', SITE.name);
  meta('property', 'og:type', data.ogType ?? 'website');
  meta('property', 'og:title', title);
  meta('property', 'og:description', data.description);
  if (data.path) meta('property', 'og:url', absoluteUrl(data.path));
  meta('property', 'og:image', image);
  meta('property', 'og:image:width', '1200');
  meta('property', 'og:image:height', '630');
  meta('property', 'og:image:alt', imageAlt);
  meta('property', 'og:locale', 'en_US');
  if (data.article) {
    meta('property', 'article:published_time', data.article.publishedTime);
    if (data.article.modifiedTime) meta('property', 'article:modified_time', data.article.modifiedTime);
    if (data.article.section) meta('property', 'article:section', data.article.section);
  }

  meta('name', 'twitter:card', 'summary_large_image');
  meta('name', 'twitter:title', title);
  meta('name', 'twitter:description', data.description);
  meta('name', 'twitter:image', image);
  meta('name', 'twitter:image:alt', imageAlt);

  const graph = [organizationJsonLd(), ...(data.jsonLd ?? [])];
  for (const item of graph) {
    tags.push(`<script type="application/ld+json" data-seo>${serializeJsonLd(item)}</script>`);
  }
  return tags.join('\n    ');
}

export function buildHead(data: SeoData): string {
  return `<title>${esc(formatTitle(data.title))}</title>\n    ${buildHeadTags(data)}`;
}

function applyToDocument(data: SeoData) {
  document.title = formatTitle(data.title);
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
  document.head.insertAdjacentHTML('beforeend', buildHeadTags(data));
}

/** Declares the current page's metadata. Render exactly once per page. */
export function Seo(props: SeoData) {
  const collector = useContext(SeoContext);
  if (collector) collector.data = props;

  const key = JSON.stringify(props);
  useEffect(() => {
    applyToDocument(JSON.parse(key) as SeoData);
  }, [key]);

  return null;
}
