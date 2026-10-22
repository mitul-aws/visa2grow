import { Seo } from '@/lib/seo';
import { PAGE_SEO } from '@/data/seo';
import { ButtonLink } from '@/components/ui/Button';
import { LogoMark } from '@/components/brand/Logo';
import { Link } from 'react-router';

const SUGGESTIONS = [
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Insights', to: '/insights' },
  { label: 'About', to: '/about' },
];

export default function NotFoundPage() {
  return (
    <>
      <Seo {...PAGE_SEO.notFound} />
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="container-page relative flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <LogoMark height={40} />
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-blue">Error 404</p>
          <h1 className="mt-3 text-h1 font-bold text-ink">This page doesn’t exist</h1>
          <p className="mt-4 max-w-md text-lead text-muted">
            The link may be broken or the page may have moved. Here are some places to continue.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/" arrow>
              Back to home
            </ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Start a Project
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {SUGGESTIONS.map((s) => (
              <li key={s.to}>
                <Link to={s.to} className="font-medium text-blue hover:underline">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
