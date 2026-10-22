import { describe, expect, it } from 'vitest';
import { SERVICES } from '@/data/services';
import { SERVICE_DETAILS } from '@/data/service-details';
import { ARTICLES } from '@/data/articles';
import { ARTICLE_BODIES, computeReadingMinutes } from '@/data/article-bodies';
import { PROJECTS } from '@/data/projects';

describe('content data', () => {
  it('has detail content for every service and valid related links', () => {
    const slugs = new Set(SERVICES.map((s) => s.slug));
    expect(SERVICES).toHaveLength(8);
    for (const s of SERVICES) {
      const d = SERVICE_DETAILS[s.slug];
      expect(d, s.slug).toBeDefined();
      expect(d!.faqs.length).toBeGreaterThanOrEqual(3);
      for (const r of d!.related) expect(slugs.has(r), `${s.slug} -> ${r}`).toBe(true);
    }
    expect(Object.keys(SERVICE_DETAILS).sort()).toEqual([...slugs].sort());
  });

  it('keeps service pages distinct rather than duplicated', () => {
    const intros = SERVICES.map((s) => SERVICE_DETAILS[s.slug]!.intro);
    expect(new Set(intros).size).toBe(intros.length);
    const firstProblems = SERVICES.map((s) => SERVICE_DETAILS[s.slug]!.problems[0]!.title);
    expect(new Set(firstProblems).size).toBe(firstProblems.length);
  });

  it('has a body for every article and an accurate reading time', () => {
    for (const a of ARTICLES) {
      const body = ARTICLE_BODIES[a.slug];
      expect(body, a.slug).toBeDefined();
      expect(a.readingMinutes, a.slug).toBe(computeReadingMinutes(body!));
    }
  });

  it('labels concept projects and never claims outcomes for them', () => {
    for (const p of PROJECTS) {
      if (p.kind === 'concept') {
        expect(p.caseStudy.verifiedOutcomes, p.slug).toEqual([]);
        expect(p.summary.toLowerCase(), p.slug).toContain('concept');
      }
      for (const s of p.services) expect(SERVICES.some((x) => x.slug === s), `${p.slug} -> ${s}`).toBe(true);
    }
  });
});

describe('published apps', () => {
  it('lists real Play Store packages with artwork on disk', async () => {
    const { APPS, appIcon, appFeature, playUrl } = await import('@/data/apps');
    const { existsSync } = await import('node:fs');
    expect(APPS).toHaveLength(8);
    expect(new Set(APPS.map((a) => a.slug)).size).toBe(APPS.length);
    for (const app of APPS) {
      expect(app.packageId, app.slug).toMatch(/^com\.mitulparmar\.[a-z]+$/);
      expect(playUrl(app)).toBe(`https://play.google.com/store/apps/details?id=${app.packageId}`);
      for (const img of [appIcon(app), appFeature(app, 640), appFeature(app, 1024)]) {
        expect(existsSync(`public${img}`), img).toBe(true);
      }
      expect(app.highlights.length, app.slug).toBeGreaterThanOrEqual(2);
    }
  });
});
