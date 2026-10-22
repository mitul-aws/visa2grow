import { Check } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { HeroVisual } from '@/components/illustrations/HeroVisual';

const VALUE_PROPS = ['AI-assisted development', 'Quality-focused engineering', 'Scalable solutions'];

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-white">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_20%,black,transparent)]" />
      <div aria-hidden className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-blue/12 blur-3xl" />
      <div aria-hidden className="absolute -right-32 top-24 h-[26rem] w-[26rem] rounded-full bg-violet/12 blur-3xl" />

      <div className="container-page relative grid items-center gap-16 pb-24 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-32 lg:pt-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 py-1 pl-1 pr-3.5 text-sm font-medium text-ink shadow-card">
            <span className="rounded-full bg-brand-gradient px-2.5 py-0.5 text-xs font-semibold text-white">AI-first</span>
            Software development studio
          </p>
          <h1 id="hero-heading" className="mt-6 text-display font-bold text-ink">
            Ideas to Impact.{' '}
            <span className="gradient-animated">Powered by&nbsp;AI.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-muted">
            We build modern web applications, mobile experiences and AI-powered solutions that help startups and
            businesses launch faster, automate smarter and scale with confidence.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/contact" size="lg" arrow>
              Start a Project
            </ButtonLink>
            <ButtonLink to="/portfolio" size="lg" variant="secondary">
              Explore Our Work
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-3 text-[0.95rem] font-medium text-ink sm:grid-cols-3 sm:gap-4">
            {VALUE_PROPS.map((v) => (
              <li key={v} className="flex items-center gap-2.5">
                <span aria-hidden className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue ring-1 ring-blue/15">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-6 sm:px-6 lg:px-0 lg:pt-0">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
