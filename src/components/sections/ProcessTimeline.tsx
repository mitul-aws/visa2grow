import { PROCESS } from '@/data/process';
import { ICONS } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';

/** Horizontal on large screens, vertical below. */
export function ProcessTimeline() {
  return (
    <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-5">
      <div aria-hidden className="absolute left-[1.45rem] top-2 bottom-2 w-px bg-gradient-to-b from-blue via-violet to-cyan lg:inset-x-[8%] lg:top-[1.45rem] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r" />
      {PROCESS.map((step, i) => {
        const Icon = ICONS[step.icon];
        return (
          <Reveal as="li" key={step.id} delay={i * 70} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
            <span className="relative z-10 inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-white text-blue shadow-card">
              <Icon aria-hidden className="size-5" strokeWidth={1.9} />
            </span>
            <div className="lg:mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet">Step {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.summary}</p>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
