import { beforeAll, describe, expect, it } from 'vitest';
import { render as renderRoute } from '@/entry-server';
import { getStaticPaths } from '@/app/routes';
import { preloadAllPages, ROUTE_TABLE } from '@/app/routeTable';
import { matchRouteEntry } from '@/app/matchRoute';
import { SITE } from '@/lib/site';
import { existsSync } from 'node:fs';

const paths = getStaticPaths();

const attr = (head: string, re: RegExp) => head.match(re)?.[1];

beforeAll(async () => {
  await preloadAllPages();
});

describe('prerendered routes', () => {
  const pages = () => paths.map((p) => ({ path: p, ...renderRoute(p) }));

  it('renders every static route with exactly one h1 and real content', () => {
    for (const { path, html } of pages()) {
      expect((html.match(/<h1[\s>]/g) ?? []).length, `${path} h1 count`).toBe(1);
      expect(html.length, `${path} html size`).toBeGreaterThan(5000);
    }
  });

  it('gives every route a unique title, description and correct canonical', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const { path, head } of pages()) {
      const title = attr(head, /<title>([^<]+)<\/title>/);
      const description = attr(head, /<meta name="description" content="([^"]+)"/);
      const canonical = attr(head, /<link rel="canonical" href="([^"]+)"/);
      expect(title, path).toBeTruthy();
      expect(description, path).toBeTruthy();
      expect(titles.has(title!), `duplicate title on ${path}`).toBe(false);
      expect(descriptions.has(description!), `duplicate description on ${path}`).toBe(false);
      titles.add(title!);
      descriptions.add(description!);
      expect(canonical).toBe(path === '/' ? SITE.url : `${SITE.url}${path}`);
      expect(head).toContain('<meta property="og:title"');
      expect(head).toContain('<meta property="og:image" content="https://');
      expect(head).toContain('<meta name="twitter:card" content="summary_large_image"');
      expect(head).toContain('<meta name="robots" content="index, follow');
      expect(description!.length, `${path} description length`).toBeLessThanOrEqual(160);
    }
  });

  it('emits valid JSON-LD with no ratings, reviews or invented facts', () => {
    for (const { path, head } of pages()) {
      const blocks = [...head.matchAll(/<script type="application\/ld\+json" data-seo>([\s\S]*?)<\/script>/g)].map((m) =>
        JSON.parse(m[1]!),
      );
      expect(blocks.length, path).toBeGreaterThan(0);
      const types = blocks.map((b) => b['@type']);
      expect(types).toContain('Organization');
      if (path.startsWith('/services/')) expect(types).toContain('Service');
      if (path.startsWith('/insights/')) expect(types).toContain('Article');
      if (path !== '/') expect(types).toContain('BreadcrumbList');
      const json = JSON.stringify(blocks);
      for (const banned of ['aggregateRating', 'review', 'address', 'numberOfEmployees', 'award', 'foundingDate']) {
        expect(json.includes(`"${banned}"`), `${banned} on ${path}`).toBe(false);
      }
    }
  });

  it('has no broken internal links', () => {
    const known = new Set(paths);
    for (const { path, html } of pages()) {
      const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]!);
      for (const href of hrefs) {
        const clean = href.split(/[?#]/)[0]!;
        if (clean.startsWith('/assets/') || clean.startsWith('/brand/')) continue;
        expect(known.has(clean), `broken link ${href} on ${path}`).toBe(true);
      }
    }
  });

  it('renders a noindex 404 for unknown URLs and unknown slugs', () => {
    for (const url of ['/nope', '/services/nope', '/portfolio/nope', '/insights/nope']) {
      const { html, head } = renderRoute(url);
      expect(html).toContain('This page doesn’t exist');
      expect(head).toContain('noindex, nofollow');
      expect(head).not.toContain('rel="canonical"');
    }
  });

  it('maps every route to a page module that exists', () => {
    for (const r of ROUTE_TABLE) expect(existsSync(r.module), r.module).toBe(true);
    expect(matchRouteEntry('/services/web-development').module).toBe('src/pages/ServiceDetailPage.tsx');
    expect(matchRouteEntry('/does/not/exist').module).toBe('src/pages/NotFoundPage.tsx');
  });
});

describe('content accuracy guardrails', () => {
  // Phrases that would imply credibility we don't have. Update deliberately.
  const BANNED = [
    /trusted by/i,
    /\b\d+\+?\s*(projects|clients|customers|apps)\s+(delivered|served|launched)/i,
    /\d+\s*%\s*(client\s+)?satisfaction/i,
    /award[- ]winning/i,
    /official (technology )?partner/i,
    /certified (partner|agency)/i,
    /testimonial/i,
    /\b\d+x faster\b/i,
  ];

  it('rendered pages contain none of the banned credibility claims', () => {
    for (const path of paths) {
      const text = renderRoute(path).html.replace(/<[^>]+>/g, ' ');
      for (const re of BANNED) expect(re.test(text), `${re} matched on ${path}`).toBe(false);
    }
  });

  it('frames 10+ years as industry experience, not company age', () => {
    const text = paths.map((p) => renderRoute(p).html.replace(/<[^>]+>/g, ' ')).join(' ');
    const mentions = [...text.matchAll(/10\+ years[^.]{0,60}/g)].map((m) => m[0]);
    expect(mentions.length).toBeGreaterThan(0);
    for (const m of mentions) expect(m, m).not.toMatch(/in business|of Visa2Grow|company history/i);
  });
});
