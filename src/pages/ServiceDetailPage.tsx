import { Link, useParams } from 'react-router';
import { Check } from 'lucide-react';
import { Seo } from '@/lib/seo';
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/jsonld';
import { getService, SERVICES } from '@/data/services';
import { SERVICE_DETAILS } from '@/data/service-details';
import { PROJECTS } from '@/data/projects';
import { ARTICLES } from '@/data/articles';
import { PageHero } from '@/components/sections/PageHero';
import { FaqList } from '@/components/sections/FaqList';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { IconBadge } from '@/components/ui/IconBadge';
import { Tag } from '@/components/ui/Tag';
import { AppIconStrip } from '@/components/sections/AppIconStrip';
import NotFoundPage from './NotFoundPage';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const summary = getService(slug);
  const detail = summary ? SERVICE_DETAILS[summary.slug] : undefined;
  if (!summary || !detail) return <NotFoundPage />;
  const service = { ...summary, ...detail };

  const path = `/services/${service.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.name, path },
  ];
  const related = service.related.map((s) => SERVICES.find((x) => x.slug === s)).filter((s) => s !== undefined);
  const projects = PROJECTS.filter((p) => p.services.includes(service.slug));
  const articles = ARTICLES.filter((a) => a.relatedServices.includes(service.slug));
  const contactHref = `/contact?service=${service.slug}`;

  return (
    <>
      <Seo
        title={service.seo.title}
        description={service.seo.description}
        path={path}
        jsonLd={[
          serviceJsonLd({ name: service.name, description: service.seo.description, path, serviceType: service.seo.serviceType }),
          breadcrumbJsonLd(crumbs),
        ]}
      />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow={service.name}
        title={service.headline}
        description={service.intro}
        aside={
          <Reveal className="hidden lg:block">
            <div className="rounded-xl border border-line bg-white p-7 shadow-float">
              <IconBadge icon={service.icon} tone="gradient" size="lg" />
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-muted">Typical technologies</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.technologies.flatMap((g) => g.items).slice(0, 10).map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to={contactHref} size="lg" arrow>
            Discuss Your Project
          </ButtonLink>
          <ButtonLink to="/process" size="lg" variant="secondary">
            See how we work
          </ButtonLink>
        </div>
      </PageHero>

      <Section labelledBy="problems-heading">
        <div className="container-page">
          <SectionHeading id="problems-heading" eyebrow="Problems we solve" title="Sound familiar?" />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {service.problems.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 2) * 80} className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-7">
                <h3 className="text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2.5 leading-relaxed text-muted">{p.description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="white" labelledBy="capabilities-heading">
        <div className="container-page grid gap-14 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <SectionHeading id="capabilities-heading" eyebrow="Capabilities" title="What we can build for you" />
            <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {service.capabilities.map((c) => (
                <li key={c.title} className="border-t border-line pt-5">
                  <h3 className="font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{c.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="self-start rounded-xl bg-canvas p-7 ring-1 ring-line lg:sticky lg:top-24">
            <h3 className="text-lg font-semibold text-ink">What you receive</h3>
            <ul className="mt-5 space-y-3.5">
              {service.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-ink/90">
                  <span aria-hidden className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue ring-1 ring-blue/15">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" labelledBy="tech-heading">
        <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <div className="container-page relative grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              id="tech-heading"
              dark
              eyebrow="Technology"
              title="Tools chosen for the job, not the trend"
              description="Technology names describe what we work with. They don’t imply any partnership or endorsement."
            />
            <Reveal className="mt-8 rounded-xl border border-violet/30 bg-violet/10 p-6">
              <p className="flex items-center gap-2 font-semibold text-white">
                Where AI fits in
              </p>
              <p className="mt-2.5 leading-relaxed text-slate-300">{service.aiNote}</p>
            </Reveal>
          </div>
          <dl className="grid content-start items-start gap-5 self-start sm:grid-cols-2">
            {service.technologies.map((g, i) => (
              <Reveal key={g.group} delay={i * 60} className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
                <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan">{g.group}</dt>
                <dd className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <Tag key={t} dark>
                      {t}
                    </Tag>
                  ))}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </Section>

      <Section labelledBy="workflow-heading">
        <div className="container-page">
          <SectionHeading
            id="workflow-heading"
            eyebrow="Typical engagement"
            title="How a typical engagement runs"
            description={
              <>
                This adapts our <Link to="/process" className="font-medium text-blue underline-offset-4 hover:underline">delivery process</Link> to this kind of work.
              </>
            }
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {service.workflow.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 70} className="relative rounded-xl border border-line bg-white p-6 shadow-card">
                <span className="text-gradient text-3xl font-bold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {service.slug === 'mobile-app-development' && (
        <Section tone="white" labelledBy="own-apps-heading" className="!pb-0">
          <div className="container-page">
            <Reveal className="flex flex-col gap-7 rounded-xl bg-canvas p-7 ring-1 ring-line">
              <div className="max-w-2xl">
                <h2 id="own-apps-heading" className="text-xl font-bold text-ink">
                  See our own apps on Google Play
                </h2>
                <p className="mt-2 text-muted">
                  We build and publish our own React Native apps too, so you can install them and judge the quality first-hand.
                </p>
              </div>
              <AppIconStrip />
            </Reveal>
          </div>
        </Section>
      )}

      <Section tone="white" labelledBy="faq-heading">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-heading" eyebrow="FAQ" title={`${service.name}: common questions`} />
          <Reveal>
            <FaqList faqs={service.faqs} />
          </Reveal>
        </div>
      </Section>

      {(projects.length > 0 || articles.length > 0) && (
        <Section labelledBy="further-heading" className="!pb-0">
          <div className="container-page">
            <h2 id="further-heading" className="text-2xl font-bold text-ink">Further reading</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {projects.map((p) => (
                <li key={p.slug} className="rounded-xl border border-line bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">Concept study</p>
                  <TextLink to={`/portfolio/${p.slug}`} className="mt-1.5">
                    {p.name}
                  </TextLink>
                </li>
              ))}
              {articles.map((a) => (
                <li key={a.slug} className="rounded-xl border border-line bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet">Insight</p>
                  <TextLink to={`/insights/${a.slug}`} className="mt-1.5">
                    {a.title}
                  </TextLink>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <Section labelledBy="related-heading" className="!pb-0">
        <div className="container-page">
          <h2 id="related-heading" className="text-2xl font-bold text-ink">Related services</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((r, i) => (
              <li key={r.slug}>
                <ServiceCard service={r} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBanner
        title={`Ready to talk about ${service.name}?`}
        description="Share a few details and we’ll reply with questions and a suggested approach. No obligation."
        to={contactHref}
      />
    </>
  );
}
