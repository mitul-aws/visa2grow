import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './app/App';
import { SeoProvider, buildHead, type HeadCollector } from './lib/seo';
import { PAGE_SEO } from './data/seo';

export { getStaticPaths, getLastModified } from './app/routes';
export { preloadAllPages } from './app/routeTable';
export { matchRouteEntry } from './app/matchRoute';
export { SITE } from './lib/site';

/** Renders one URL to HTML plus its <head> tags. Used by scripts/prerender.mjs. */
export function render(url: string): { html: string; head: string } {
  const collector: HeadCollector = {};
  const html = renderToString(
    <StrictMode>
      <SeoProvider collector={collector}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </SeoProvider>
    </StrictMode>,
  );
  return { html, head: buildHead(collector.data ?? PAGE_SEO.notFound) };
}
