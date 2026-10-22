import { Link } from 'react-router';
import { APPS, appIcon, shortName } from '@/data/apps';

/** Row of app icons linking to the portfolio's apps section. */
export function AppIconStrip() {
  return (
    <ul className="grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-8">
      {APPS.map((app) => (
        <li key={app.slug}>
          <Link to="/portfolio#apps" className="group flex flex-col items-center gap-2 text-center">
            <img
              src={appIcon(app)}
              width={256}
              height={256}
              loading="lazy"
              decoding="async"
              alt=""
              className="size-14 rounded-[22%] shadow-card ring-1 ring-line transition-transform group-hover:-translate-y-0.5"
            />
            <span className="text-xs font-medium text-ink group-hover:text-blue">{shortName(app)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
