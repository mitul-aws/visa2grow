import { SITE, absoluteUrl } from './site';
import { APPS, PLAY_DEVELOPER_URL, appIcon, playUrl } from '@/data/apps';

export type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;

/**
 * Only verifiable facts: no address, ratings, reviews, employee counts or
 * founding claims. Add `sameAs` once official social profiles exist.
 */
export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl('/brand/visa2grow-symbol-512.png'),
    slogan: 'Ideas to Impact. Powered by AI.',
    description: SITE.description,
    sameAs: [PLAY_DEVELOPER_URL],
    ...(SITE.contactEmail ? { email: SITE.contactEmail } : {}),
  };
}

const APP_CATEGORY = { Puzzle: 'GameApplication', 'Health & Fitness': 'HealthApplication', Education: 'EducationalApplication' } as const;

/** Our own published apps. No ratings or download counts. */
export function publishedAppsJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Apps published by Visa2Grow on Google Play',
    itemListElement: APPS.map((app, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'MobileApplication',
        name: app.name,
        operatingSystem: 'Android',
        applicationCategory: APP_CATEGORY[app.category],
        description: app.summary,
        url: playUrl(app),
        image: absoluteUrl(appIcon(app)),
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
      },
    })),
  };
}

export function professionalServiceJsonLd(serviceNames: string[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    image: absoluteUrl(SITE.ogImage),
    description: SITE.description,
    parentOrganization: { '@id': ORG_ID },
    knowsAbout: serviceNames,
  };
}

export function serviceJsonLd(input: { name: string; description: string; path: string; serviceType: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { '@id': ORG_ID },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  section: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    url: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    articleSection: input.section,
    image: absoluteUrl(SITE.ogImage),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  };
}
