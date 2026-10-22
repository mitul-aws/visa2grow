import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

/** Label + control + hint + error, wired with matching ids. */
export function Field({ id, label, optional, hint, error, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-danger">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, opts: { hint?: boolean; error?: boolean }): string | undefined {
  const ids = [opts.hint && `${id}-hint`, opts.error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

export const controlClass = (invalid: boolean) =>
  cn(
    'block w-full rounded-md border bg-white px-3.5 text-[0.98rem] text-ink shadow-[inset_0_1px_2px_rgb(17_24_39/0.04)] transition-[border-color,box-shadow] placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-canvas',
    invalid
      ? 'border-danger focus:border-danger focus:ring-danger/15'
      : 'border-line hover:border-slate-300 focus:border-blue focus:ring-blue/15',
  );
