import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { useRevealObserver } from '@/hooks/useRevealObserver';
import { useScrollManager } from '@/hooks/useScrollManager';
import { preloadAllPages } from '@/app/routeTable';

/** Shown only if a page chunk is still downloading during client navigation. */
function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="size-8 animate-spin rounded-full border-2 border-line border-t-blue" />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useScrollManager();
  useRevealObserver();

  // Once idle, fetch the remaining page chunks so later navigation is instant.
  useEffect(() => {
    const prefetch = () => void preloadAllPages().catch(() => undefined);
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(prefetch);
    else setTimeout(prefetch, 2000);
  }, []);

  // After client-side navigation, move focus to the new page so screen reader
  // and keyboard users start at the top of the new content.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
