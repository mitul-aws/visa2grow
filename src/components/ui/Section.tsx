import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';

interface SectionProps {
  id?: string;
  tone?: 'canvas' | 'white' | 'dark';
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}

export function Section({ id, tone = 'canvas', className, children, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative overflow-x-clip py-20 sm:py-24 lg:py-28',
        tone === 'white' && 'bg-white',
        tone === 'dark' && 'on-dark overflow-hidden bg-navy text-white',
        className,
      )}
    >
      {children}
    </section>
  );
}

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  dark,
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <Tag id={id} className={cn('mt-3 font-bold text-h2', dark ? 'text-white' : 'text-ink')}>
        {title}
      </Tag>
      {description && (
        <p className={cn('mt-4 text-lead', dark ? 'text-slate-300' : 'text-muted')}>{description}</p>
      )}
    </Reveal>
  );
}

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em]',
        dark ? 'text-cyan' : 'text-blue',
      )}
    >
      <span aria-hidden className={cn('h-px w-6', dark ? 'bg-cyan/70' : 'bg-blue/60')} />
      {children}
    </p>
  );
}
