import { Seo } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { PAGE_SEO } from '@/data/seo';
import { SITE } from '@/lib/site';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { IconBadge } from '@/components/ui/IconBadge';
import { Logo } from '@/components/brand/Logo';
import { Link } from 'react-router';
import { APPS } from '@/data/apps';
import type { IconName } from '@/components/ui/icons';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

const PRINCIPLES: Array<{ icon: IconName; title: string; body: string }> = [
  { icon: 'sparkles', title: 'AI-first, human-led', body: 'We use AI wherever it makes engineering faster, and keep people accountable for every decision and every line that ships.' },
  { icon: 'shield', title: 'Quality is not optional', body: 'Moving faster is only useful if what we deliver works, is secure and can be maintained by someone else.' },
  { icon: 'target', title: 'Outcomes over output', body: 'We measure success by whether the software helps your business, not by how much of it we write.' },
  { icon: 'layers', title: 'Built to be maintained', body: 'Clear structure, strong typing, tests and documentation, so the product outlives the project.' },
  { icon: 'handshake', title: 'Honest commitments', body: 'Realistic estimates, transparent progress and plain answers, including “we don’t know yet” and “you don’t need this”.' },
  { icon: 'idea', title: 'Startup mindset', body: 'Small, focused and pragmatic. We care about the same things early-stage founders care about: speed, focus and value.' },
];

export default function AboutPage() {
  return (
    <>
      <Seo {...PAGE_SEO.about} jsonLd={[breadcrumbJsonLd(crumbs)]} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="About"
        title={
          <>
            A new software studio, <span className="text-gradient">built on experience</span>
          </>
        }
        description={`Visa2Grow is an emerging AI-first software development business. The company is new; the expertise behind it is not. Our founding experience spans ${SITE.experienceYears} years in the software industry.`}
      />

      <Section labelledBy="story-heading">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading id="story-heading" eyebrow="Why we exist" title="Modern software development should be more accessible" />
            <Reveal className="mt-6 space-y-5 text-lead text-muted">
              <p>
                Building good software has traditionally required either a large budget or a lot of luck. AI-assisted
                engineering changes that equation: routine work that once took days can now take hours, which means
                startups and smaller businesses can afford engineering that is both fast and careful.
              </p>
              <p>
                Visa2Grow was started to deliver exactly that: the efficiency of AI-first workflows combined with the
                judgement that comes from more than a decade of building, maintaining and shipping software in industry.
              </p>
              <p>
                We’re honest about where we are. We are a young company, so our clearest evidence is our own work: a
                family of Android apps we designed, built and published on Google Play. What we can promise is how we
                work: clearly, carefully and with your long-term interests in mind.
              </p>
            </Reveal>
          </div>
          <Reveal delay={100} className="relative">
            <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-blue/15 via-violet/15 to-cyan/15 blur-2xl" />
            <div className="relative rounded-xl border border-line bg-white p-8 shadow-float sm:p-10">
              <Logo size="lg" tagline />
              <dl className="mt-10 grid gap-6">
                <div className="border-t border-line pt-5">
                  <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Positioning</dt>
                  <dd className="mt-1.5 text-lg font-semibold text-ink">AI-First Software Development</dd>
                </div>
                <div className="border-t border-line pt-5">
                  <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Experience behind the company</dt>
                  <dd className="mt-1.5 text-lg font-semibold text-ink">{SITE.experienceYears} years in the software industry</dd>
                </div>
                <div className="border-t border-line pt-5">
                  <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Own products</dt>
                  <dd className="mt-1.5 text-lg font-semibold text-ink">
                    <Link to="/portfolio#apps" className="hover:text-blue">
                      {APPS.length} apps live on Google Play
                    </Link>
                  </dd>
                </div>
                <div className="border-t border-line pt-5">
                  <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Company stage</dt>
                  <dd className="mt-1.5 text-lg font-semibold text-ink">Early-stage startup</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="white" labelledBy="principles-heading">
        <div className="container-page">
          <SectionHeading id="principles-heading" eyebrow="Principles" title="What we stand for" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 3) * 80} className="rounded-xl bg-canvas p-7 ring-1 ring-line">
                <IconBadge icon={p.icon} tone={i % 2 ? 'violet' : 'blue'} />
                <h3 className="mt-5 text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section labelledBy="ai-human-heading">
        <div className="container-page max-w-4xl">
          <SectionHeading
            id="ai-human-heading"
            eyebrow="AI with accountability"
            title="Where AI helps, and where people decide"
          />
          <Reveal className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-7 shadow-card">
              <h3 className="font-semibold text-ink">AI supports</h3>
              <p className="mt-2 leading-relaxed text-muted">
                Code generation and refactoring, reusable components, test generation, documentation, prototyping, workflow
                automation and day-to-day engineering productivity.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-7 shadow-card">
              <h3 className="font-semibold text-ink">Engineers decide</h3>
              <p className="mt-2 leading-relaxed text-muted">
                Architecture, security, data handling, testing strategy and what gets merged. Every change is reviewed by a
                person who understands it and is accountable for it.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
