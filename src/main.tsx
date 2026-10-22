import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/geist/wght.css';
import './styles/index.css';
import { App } from './app/App';
import { SeoProvider } from './lib/seo';
import { matchRouteEntry } from './app/matchRoute';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

const app = (
  <StrictMode>
    <SeoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SeoProvider>
  </StrictMode>
);

// Prerendered pages already contain markup: load this route's page chunk, then
// hydrate so the first client render matches the HTML. In dev the root is empty.
if (container.firstElementChild) {
  void matchRouteEntry(window.location.pathname)
    .page.preload()
    .finally(() => hydrateRoot(container, app));
} else {
  createRoot(container).render(app);
}
