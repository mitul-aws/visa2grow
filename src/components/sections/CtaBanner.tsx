import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { LogoMark } from '@/components/brand/Logo';

interface CtaBannerProps {
  title?: string;
  description?: string;
  cta?: string;
  to?: string;
}

export function CtaBanner({
  title = 'Have an Idea? Let’s Build It.',
  description = 'Tell us what you’re planning, and let’s explore the right technical approach.',
  cta = 'Discuss Your Project',
  to = '/contact',
}: CtaBannerProps) {
  return (
    <section aria-labelledby="cta-heading" className="px-4 py-20 sm:px-6 sm:py-24">
      <Reveal className="on-dark relative mx-auto max-w-[76rem] overflow-hidden rounded-[1.75rem] bg-navy px-6 py-16 text-center sm:px-12 sm:py-20">
        <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div aria-hidden className="absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-blue/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 right-0 h-72 w-96 rounded-full bg-violet/35 blur-3xl" />
        <div className="relative">
          <LogoMark height={34} className="mx-auto" />
          <h2 id="cta-heading" className="mx-auto mt-6 max-w-2xl text-h2 font-bold text-white">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lead text-slate-300">{description}</p>
          <div className="mt-9 flex justify-center">
            <ButtonLink to={to} size="lg" arrow>
              {cta}
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
