import { lazyPage, type LazyPage } from './lazyPage';

export interface RouteEntry {
  path: string;
  page: LazyPage;
  /** Source module, used by the prerenderer to emit <link rel="modulepreload">. */
  module: string;
}

/** Every client route. Paths are matched by React Router. */
export const ROUTE_TABLE: RouteEntry[] = [
  { path: '/', module: 'src/pages/HomePage.tsx', page: lazyPage(() => import('@/pages/HomePage')) },
  { path: '/services', module: 'src/pages/ServicesPage.tsx', page: lazyPage(() => import('@/pages/ServicesPage')) },
  { path: '/services/:slug', module: 'src/pages/ServiceDetailPage.tsx', page: lazyPage(() => import('@/pages/ServiceDetailPage')) },
  { path: '/portfolio', module: 'src/pages/PortfolioPage.tsx', page: lazyPage(() => import('@/pages/PortfolioPage')) },
  { path: '/portfolio/:slug', module: 'src/pages/CaseStudyPage.tsx', page: lazyPage(() => import('@/pages/CaseStudyPage')) },
  { path: '/process', module: 'src/pages/ProcessPage.tsx', page: lazyPage(() => import('@/pages/ProcessPage')) },
  { path: '/about', module: 'src/pages/AboutPage.tsx', page: lazyPage(() => import('@/pages/AboutPage')) },
  { path: '/insights', module: 'src/pages/InsightsPage.tsx', page: lazyPage(() => import('@/pages/InsightsPage')) },
  { path: '/insights/:slug', module: 'src/pages/ArticlePage.tsx', page: lazyPage(() => import('@/pages/ArticlePage')) },
  { path: '/contact', module: 'src/pages/ContactPage.tsx', page: lazyPage(() => import('@/pages/ContactPage')) },
  { path: '/privacy', module: 'src/pages/PrivacyPage.tsx', page: lazyPage(() => import('@/pages/PrivacyPage')) },
  { path: '*', module: 'src/pages/NotFoundPage.tsx', page: lazyPage(() => import('@/pages/NotFoundPage')) },
];

export async function preloadAllPages(): Promise<void> {
  await Promise.all(ROUTE_TABLE.map((r) => r.page.preload()));
}
