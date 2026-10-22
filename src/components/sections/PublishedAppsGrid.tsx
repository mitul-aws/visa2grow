import { useState } from 'react';
import { APP_GROUPS, APPS, type AppGroup } from '@/data/apps';
import { AppCard } from './AppCard';
import { cn } from '@/lib/cn';

type Filter = 'All' | AppGroup;

export function PublishedAppsGrid() {
  const [filter, setFilter] = useState<Filter>('All');
  const visible = filter === 'All' ? APPS : APPS.filter((a) => a.group === filter);
  return (
    <div>
      <div role="group" aria-label="Filter apps by category" className="flex flex-wrap gap-2">
        {(['All', ...APP_GROUPS] as Filter[]).map((f) => {
          const count = f === 'All' ? APPS.length : APPS.filter((a) => a.group === f).length;
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={cn(
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors',
                active ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-blue/40',
              )}
            >
              {f}
              <span className={cn('text-xs', active ? 'text-white/70' : 'text-muted')}>{count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {`Showing ${visible.length} ${visible.length === 1 ? 'app' : 'apps'}${filter === 'All' ? '' : ` in ${filter}`}`}
      </p>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" data-testid="apps-grid">
        {visible.map((app) => (
          <li key={app.slug}>
            <AppCard app={app} />
          </li>
        ))}
      </ul>
    </div>
  );
}
