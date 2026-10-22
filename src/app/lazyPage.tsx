import { use, type ComponentType } from 'react';

export interface LazyPage {
  (): React.JSX.Element;
  preload: () => Promise<void>;
  isLoaded: () => boolean;
}

/** A promise carrying React's thenable status fields, so `use()` can read it synchronously once settled. */
type TrackedPromise = Promise<void> & { status?: 'pending' | 'fulfilled' | 'rejected'; value?: void; reason?: unknown };

/**
 * Code-split page component that can be preloaded before rendering.
 *
 * - Prerender: every page is preloaded first, so rendering never suspends.
 * - Hydration: the current route's page is preloaded before hydrateRoot, so
 *   the first client render matches the prerendered HTML exactly.
 * - Navigation: pages are prefetched when the browser is idle; if one isn't
 *   ready yet, the nearest <Suspense> shows its fallback briefly.
 *
 * `use()` is called on every render (never conditionally). The promise is
 * tagged with `status` as it settles, which is how React recognises an
 * already-resolved thenable and returns without suspending.
 */
export function lazyPage(load: () => Promise<{ default: ComponentType }>): LazyPage {
  let Loaded: ComponentType | null = null;
  let pending: TrackedPromise | null = null;

  const preload = (): TrackedPromise => {
    if (!pending) {
      const p: TrackedPromise = load().then((m) => {
        Loaded = m.default;
      });
      p.status = 'pending';
      p.then(
        () => {
          p.status = 'fulfilled';
          p.value = undefined;
        },
        (err: unknown) => {
          p.status = 'rejected';
          p.reason = err;
        },
      );
      pending = p;
    }
    return pending;
  };

  const Page = (() => {
    use(preload() as Promise<void>);
    const Component = Loaded as unknown as ComponentType;
    return <Component />;
  }) as LazyPage;
  Page.preload = preload;
  Page.isLoaded = () => Loaded !== null;
  return Page;
}
