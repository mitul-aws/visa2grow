import type { IconName } from '@/components/ui/icons';
import { IconBadge } from '@/components/ui/IconBadge';
import { Reveal } from '@/components/ui/Reveal';
import { SITE } from '@/lib/site';

const REASONS: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'workflow',
    title: 'AI-first development workflows',
    body: 'AI tools are built into how we scaffold, test, refactor and document, so routine work moves quickly.',
  },
  {
    icon: 'compass',
    title: `${SITE.experienceYears} years of industry experience`,
    body: 'Our founding expertise comes from more than a decade in the software industry. Visa2Grow itself is a new company, and we’re upfront about that.',
  },
  {
    icon: 'userCheck',
    title: 'Human-reviewed engineering',
    body: 'Every change is reviewed by an engineer. AI drafts; people decide what ships.',
  },
  {
    icon: 'layers',
    title: 'Maintainable, scalable architecture',
    body: 'Typed code, clear boundaries and tests, so your product stays easy to change as it grows.',
  },
  {
    icon: 'message',
    title: 'Transparent communication',
    body: 'Estimates as ranges with written assumptions, regular demos and early warning when something changes.',
  },
  {
    icon: 'target',
    title: 'Business-focused delivery',
    body: 'We start from the outcome you need and scope accordingly, including advising when not to build something.',
  },
];

export function WhyUs() {
  return (
    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {REASONS.map((r, i) => (
        <Reveal as="li" key={r.title} delay={(i % 3) * 80} className="flex gap-4">
          <IconBadge icon={r.icon} tone={i === 1 ? 'gradient' : 'blue'} />
          <div>
            <h3 className="font-semibold text-ink">{r.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{r.body}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
