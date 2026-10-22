import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, dark, className }: { items: Crumb[]; dark?: boolean; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn('flex flex-wrap items-center gap-1.5 text-sm', dark ? 'text-slate-400' : 'text-muted')}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="inline-flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={cn('font-medium', dark ? 'text-slate-200' : 'text-ink')}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link to={item.path} className={cn('hover:underline', dark ? 'hover:text-white' : 'hover:text-blue')}>
                    {item.name}
                  </Link>
                  <ChevronRight aria-hidden className="size-3.5 opacity-60" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
