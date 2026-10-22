import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/navigation/Breadcrumbs';
import { Eyebrow } from '@/components/ui/Section';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
  aside?: ReactNode;
}

/** Shared header for inner pages: breadcrumb, eyebrow, H1, lead. */
export function PageHero({ eyebrow, title, description, breadcrumbs, children, aside }: PageHeroProps) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-white">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden className="absolute -right-24 -top-40 h-96 w-96 rounded-full bg-violet/10 blur-3xl" />
      <div aria-hidden className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />
      <div className="container-page relative pb-16 pt-10 sm:pb-20 sm:pt-12">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-10" />}
        <div className={aside ? 'grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]' : undefined}>
          <div className="max-w-3xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className="mt-4 text-h1 font-bold text-ink">{title}</h1>
            {description && <p className="mt-5 text-lead text-muted">{description}</p>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {aside}
        </div>
      </div>
    </header>
  );
}
