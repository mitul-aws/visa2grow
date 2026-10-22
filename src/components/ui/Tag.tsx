import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Tag({ children, dark, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        dark ? 'bg-white/8 text-slate-200 ring-1 ring-white/10' : 'bg-canvas text-muted ring-1 ring-line',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Visible label for concept / demo content. Never remove it from concept work. */
export function ConceptBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200',
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-amber-500" />
      Concept project
    </span>
  );
}
