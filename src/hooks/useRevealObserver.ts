import { useEffect } from 'react';

const IN_VIEW = 0.95; // fraction of the viewport height counted as "on screen"

/**
 * Fades `.reveal` blocks in as they scroll into view.
 *
 * Pages are code-split and can mount after this hook runs (always in dev,
 * sometimes after client-side navigation), so new blocks are picked up with a
 * MutationObserver rather than a one-off scan. Blocks that are already on
 * screen, or already scrolled past, when they appear are shown immediately, so
 * nothing flickers and nothing is left invisible.
 *
 * Content is fully visible without JavaScript: the hidden state only applies
 * once `html.reveal-ready` is set here.
 */
export function useRevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const show = (el: Element) => el.classList.add('is-visible');

    // No animation wanted (or possible): just make sure everything is shown,
    // including content that mounts later.
    if (reduced || typeof IntersectionObserver === 'undefined') {
      const showAll = () => document.querySelectorAll('.reveal:not(.is-visible)').forEach(show);
      showAll();
      if (typeof MutationObserver === 'undefined') return;
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Visible now, or jumped past (anchor link, End key): reveal and stop watching.
          if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    const track = (el: Element) => {
      if (el.classList.contains('is-visible')) return;
      const r = el.getBoundingClientRect();
      const onScreen = r.top < window.innerHeight * IN_VIEW && r.bottom > 0;
      if (onScreen || r.bottom <= 0) show(el);
      else io.observe(el);
    };
    const scan = (node: Element | Document) => {
      if (node instanceof Element && node.classList.contains('reveal')) track(node);
      node.querySelectorAll('.reveal').forEach(track);
    };

    scan(document);
    root.classList.add('reveal-ready');

    // MutationObserver callbacks run before the next paint, so blocks that
    // mount on screen are marked visible before they could render hidden.
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);
}
