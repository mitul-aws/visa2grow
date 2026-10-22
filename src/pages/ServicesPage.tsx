import { Link } from 'react-router';
import { Seo } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { PAGE_SEO } from '@/data/seo';
import { SERVICES } from '@/data/services';
import { PageHero } from '@/components/sections/PageHero';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
];

const COMBINATIONS = [
  {
    title: 'Launching an MVP',
    body: 'Product design to shape the scope, then web or mobile development with a lean backend and an automated release pipeline.',
    services: ['ui-ux-design', 'web-development', 'backend-api-development'],
  },
  {
    title: 'Adding AI to an existing product',
    body: 'A short AI feasibility prototype, then integration into your backend and interface with evaluation and monitoring.',
    services: ['ai-automation', 'backend-api-development', 'web-development'],
  },
  {
    title: 'Scaling an existing system',
    body: 'Start with a code audit to see what the current system can support, plan the roadmap, then strengthen pipelines, tests and infrastructure.',
    services: ['code-audit', 'scaling-consulting', 'cloud-devops-qa'],
  },
];

export default function ServicesPage() {
  const name = (slug: string) => SERVICES.find((s) => s.slug === slug)?.name ?? slug;
  return (
    <>
      <Seo {...PAGE_SEO.services} jsonLd={[breadcrumbJsonLd(crumbs)]} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="Services"
        title={
          <>
            Software development services, <span className="text-gradient">AI-first and human-led</span>
          </>
        }
        description="Whether you need a complete product, an audit of the system you have, or help scaling it, every service follows the same principles: clear scope, modern technology, AI-assisted delivery and engineering review on everything that ships."
      >
        <ButtonLink to="/contact" size="lg" arrow>
          Start a Project
        </ButtonLink>
      </PageHero>

      <Section labelledBy="all-services">
        <div className="container-page">
          <h2 id="all-services" className="sr-only">
            All services
          </h2>
          <ServicesGrid />
        </div>
      </Section>

      <Section tone="white" labelledBy="combos-heading">
        <div className="container-page">
          <SectionHeading
            id="combos-heading"
            eyebrow="Common combinations"
            title="Services that work well together"
            description="Most projects need more than one discipline. These are typical starting points, which we adjust to your situation."
          />
          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {COMBINATIONS.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 80} className="rounded-xl border border-line bg-canvas p-7">
                <h3 className="text-lg font-semibold text-ink">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{c.body}</p>
                <ul className="mt-5 space-y-2">
                  {c.services.map((slug) => (
                    <li key={slug}>
                      <Link to={`/services/${slug}`} className="font-medium text-blue hover:underline">
                        {name(slug)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
