import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Scroll to top on page change, or to the #hash target when present. */
export function useScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}
