import { ArrowUpRight, Check } from 'lucide-react';
import { appFeature, appIcon, playUrl, shortName, type PublishedApp } from '@/data/apps';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';

interface AppCardProps {
  app: PublishedApp;
  /** Compact cards (homepage) drop highlights and stack. */
  compact?: boolean;
  headingLevel?: 'h2' | 'h3';
}

/** A Visa2Grow app published on Google Play. Links out to the real listing. */
export function AppCard({ app, compact, headingLevel = 'h3' }: AppCardProps) {
  const H = headingLevel;
  const name = shortName(app);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative">
        <img
          src={appFeature(app, 640)}
          srcSet={`${appFeature(app, 640)} 640w, ${appFeature(app, 1024)} 1024w`}
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
          width={1024}
          height={500}
          loading="lazy"
          decoding="async"
          alt={`${name} feature graphic from its Google Play listing`}
          className="aspect-[1024/500] w-full bg-navy object-cover"
        />
        <img
          src={appIcon(app)}
          width={256}
          height={256}
          loading="lazy"
          decoding="async"
          alt=""
          className={cn(
            'absolute left-5 rounded-[22%] shadow-float ring-4 ring-white',
            compact ? '-bottom-6 size-12' : '-bottom-7 size-14',
          )}
        />
      </div>
      <div className={cn('flex flex-1 flex-col p-5', compact ? 'pt-9' : 'pt-10 sm:p-6 sm:pt-11')}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {app.category}
          {!compact && ' · Google Play'}
        </p>
        <H className="mt-1.5 text-lg font-semibold text-ink">{name}</H>
        <p className="mt-1 text-sm font-medium text-violet">{app.tagline}</p>
        {!compact && (
          <>
            <p className="mt-3 leading-relaxed text-muted">{app.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink/85">
              {app.highlights.map((h) => (
                <li key={h} className="flex gap-2.5">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-blue" strokeWidth={2.5} />
                  {h}
                </li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${name} technology stack`}>
              {app.stack.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-auto pt-5">
          <a
            href={playUrl(app)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-blue underline-offset-4 after:absolute after:inset-0 hover:underline focus-visible:outline-none"
          >
            View on Google Play
            <span className="sr-only">: {name} (opens in a new tab)</span>
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-blue ring-offset-2 group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
