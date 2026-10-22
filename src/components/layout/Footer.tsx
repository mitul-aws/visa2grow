import { Link } from 'react-router';
import { Logo } from '@/components/brand/Logo';
import { SERVICES } from '@/data/services';
import { SITE } from '@/lib/site';

const COMPANY_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Process', to: '/process' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Insights', to: '/insights' },
  { label: 'Contact', to: '/contact' },
];

export function Footer() {
  const year = __BUILD_YEAR__;
  return (
    <footer className="on-dark relative overflow-hidden bg-navy text-slate-300">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue/70 to-transparent" />
      <div className="container-page relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link to="/" className="inline-block rounded-md">
            <Logo variant="dark" tagline size="md" />
          </Link>
          <p className="mt-5 leading-relaxed text-slate-400">
            AI-first software development. Web, mobile and AI solutions built with modern tools and human-reviewed
            engineering, backed by {SITE.experienceYears} years of industry experience.
          </p>
          {SITE.contactEmail && (
            <p className="mt-5">
              <a href={`mailto:${SITE.contactEmail}`} className="font-medium text-white hover:text-cyan">
                {SITE.contactEmail}
              </a>
            </p>
          )}
        </div>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Services
          </h2>
          <ul className="mt-5 space-y-3">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Company
          </h2>
          <ul className="mt-5 space-y-3">
            {COMPANY_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Visa2Grow. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/contact" className="hover:text-white">
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
