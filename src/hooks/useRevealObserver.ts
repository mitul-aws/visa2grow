import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Reveals `.reveal` blocks as they scroll into view. Anything already on
 * screen is marked visible synchronously before the hidden state is enabled,
 * so above-the-fold content never flickers.
 */
export function useRevealObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));

    if (reduced || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }

    const vh = window.innerHeight;
    for (const n of nodes) {
      const r = n.getBoundingClientRect();
      if (r.top < vh * 0.95 && r.bottom > 0) n.classList.add('is-visible');
    }
    root.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    nodes.filter((n) => !n.classList.contains('is-visible')).forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [pathname]);
}
