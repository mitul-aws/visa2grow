import { useMemo, useState } from 'react';
import type { Project, ProjectCategory } from '@/types/content';
import { PROJECT_CATEGORIES } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/cn';

type Filter = 'All' | ProjectCategory;

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('All');
  const available = useMemo(
    () => PROJECT_CATEGORIES.filter((c) => projects.some((p) => p.category === c)),
    [projects],
  );
  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter);
  const filters: Filter[] = ['All', ...available];

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === 'All' ? projects.length : projects.filter((p) => p.category === f).length;
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
        {`Showing ${visible.length} ${visible.length === 1 ? 'project' : 'projects'}${filter === 'All' ? '' : ` in ${filter}`}`}
      </p>
      {visible.length > 0 ? (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} headingLevel="h3" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
