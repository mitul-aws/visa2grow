import { Seo } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { PAGE_SEO } from '@/data/seo';
import { PROCESS } from '@/data/process';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { IconBadge } from '@/components/ui/IconBadge';
import type { IconName } from '@/components/ui/icons';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Process', path: '/process' },
];

const EXPECTATIONS: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'clipboard',
    title: 'Requirements',
    body: 'We write requirements down in plain language and confirm them with you. Anything unclear becomes a question, not an assumption.',
  },
  {
    icon: 'gauge',
    title: 'Estimates',
    body: 'Estimates are ranges with their assumptions listed. When scope changes, we update the estimate before doing the work, not after.',
  },
  {
    icon: 'route',
    title: 'Milestones',
    body: 'Each milestone ends with something you can use or test. Payment schedules, when agreed, follow those milestones.',
  },
  {
    icon: 'message',
    title: 'Communication & feedback',
    body: 'A regular update, a demo of working software at each milestone and one shared channel for questions. Bad news is shared early.',
  },
];

const QA = [
  'Strict type checking and linting on every change',
  'Unit tests for business rules; end-to-end tests for critical journeys',
  'Engineer code review on every merge, including AI-assisted code',
  'Accessibility checks against WCAG 2.2 AA principles',
  'Performance measurement on real devices and network conditions',
  'Security review of authentication, authorisation and data handling',
];

const HANDOVER = [
  'Source code in a repository you own',
  'Architecture overview and key decisions with reasoning',
  'Setup, configuration and deployment instructions',
  'Credentials and accounts transferred to your business',
  'A walkthrough session with your team',
  'An agreed support window after launch',
];

export default function ProcessPage() {
  return (
    <>
      <Seo {...PAGE_SEO.process} jsonLd={[breadcrumbJsonLd(crumbs)]} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="Process"
        title={
          <>
            How we deliver: <span className="text-gradient">clear stages, visible progress</span>
          </>
        }
        description="A good process makes a project predictable. Ours is designed so you always know what is being built, why, and how far along it is, with AI speeding up the routine work and engineers accountable for the result."
      />

      <Section labelledBy="stages-heading">
        <div className="container-page">
          <SectionHeading id="stages-heading" eyebrow="Six stages" title="From first conversation to handover" />
          <ol className="mt-14 space-y-6">
            {PROCESS.map((step, i) => (
              <Reveal
                as="li"
                key={step.id}
                id={step.id}
                className="grid gap-6 rounded-xl border border-line bg-white p-6 shadow-card sm:p-8 lg:grid-cols-[16rem_1fr_17rem] lg:gap-10"
              >
                <div className="flex items-start gap-4">
                  <IconBadge icon={step.icon} tone={i % 2 ? 'violet' : 'blue'} size="lg" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet">Step {i + 1}</p>
                    <h3 className="mt-1 text-xl font-semibold text-ink">{step.title}</h3>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-ink">{step.summary}</p>
                  <ul className="mt-4 space-y-2.5 text-muted">
                    {step.details.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-blue" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <dl className="space-y-4 rounded-lg bg-canvas p-5 text-sm ring-1 ring-line">
                  <div>
                    <dt className="font-semibold text-ink">You provide</dt>
                    <dd className="mt-1 text-muted">{step.youProvide}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">You receive</dt>
                    <dd className="mt-1 text-muted">{step.youReceive}</dd>
                  </div>
                </dl>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="white" labelledBy="expect-heading">
        <div className="container-page">
          <SectionHeading
            id="expect-heading"
            eyebrow="Working together"
            title="What you can expect from us"
            description="Clear expectations on both sides prevent most project problems."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {EXPECTATIONS.map((e, i) => (
              <Reveal as="li" key={e.title} delay={(i % 2) * 80} className="flex gap-5 rounded-xl bg-canvas p-7 ring-1 ring-line">
                <IconBadge icon={e.icon} />
                <div>
                  <h3 className="text-lg font-semibold text-ink">{e.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{e.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="dark" labelledBy="qa-heading">
        <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <div className="container-page relative grid gap-10 lg:grid-cols-2">
          <Reveal className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
            <h2 id="qa-heading" className="text-2xl font-bold text-white">
              Quality assurance
            </h2>
            <p className="mt-3 text-slate-300">
              Quality is built in at every stage, not inspected at the end. AI-generated code goes through exactly the
              same checks as anything else.
            </p>
            <ul className="mt-6 space-y-3 text-slate-200">
              {QA.map((q) => (
                <li key={q} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                  {q}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-bold text-white">Handover</h2>
            <p className="mt-3 text-slate-300">
              You should never depend on us to understand your own product. Every project ends with a complete handover.
            </p>
            <ul className="mt-6 space-y-3 text-slate-200">
              {HANDOVER.map((h) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#b99bff]" />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
