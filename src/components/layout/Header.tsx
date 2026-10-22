import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { MAIN_NAV, PRIMARY_CTA } from '@/data/navigation';
import { cn } from '@/lib/cn';

const isActivePath = (pathname: string, to: string) =>
  to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // While open: lock page scroll, trap focus, close on Escape or on resize to desktop.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel?.querySelector<HTMLElement>('a, button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const focusables = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>('a, button')].filter(
        (el): el is HTMLElement => !!el,
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia('(min-width: 64rem)');
    const onMq = () => mq.matches && close(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener?.('change', onMq);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener?.('change', onMq);
    };
  }, [open, close]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300',
          scrolled || open
            ? 'border-line bg-white/85 shadow-[0_1px_12px_-6px_rgb(17_24_39/0.12)] backdrop-blur-xl'
            : 'border-transparent bg-white/60 backdrop-blur-md',
        )}
      >
        <a href="#main" className="sr-only-focusable z-[60] rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
          Skip to content
        </a>
        <div className="container-page flex h-[4.25rem] items-center justify-between gap-6">
          <Link to="/" className="rounded-md">
            <Logo size="md" tagline />
          </Link>
  
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {MAIN_NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'relative rounded-md px-3 py-2 text-[0.94rem] font-medium transition-colors',
                        isActive || isActivePath(pathname, item.to) ? 'text-blue' : 'text-ink/80 hover:text-ink',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
  
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ButtonLink to={PRIMARY_CTA.to} arrow>
                {PRIMARY_CTA.label}
              </ButtonLink>
            </div>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-canvas lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise become the
          containing block for this fixed panel and shrink it to header height. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.25rem] z-40 overflow-y-auto border-t border-line bg-white lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-6">
          <ul className="flex flex-col">
            {MAIN_NAV.map((item) => {
              const active = isActivePath(pathname, item.to);
              return (
                <li key={item.to} className="border-b border-line/70 last:border-0">
                  <Link
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between py-4 text-lg font-semibold',
                      active ? 'text-blue' : 'text-ink',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ButtonLink to={PRIMARY_CTA.to} size="lg" className="mt-8 w-full" arrow>
            {PRIMARY_CTA.label}
          </ButtonLink>
        </nav>
      </div>
    </>
  );
}
