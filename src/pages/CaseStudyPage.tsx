import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { Info } from 'lucide-react';
import { Seo } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { getProject, PROJECTS } from '@/data/projects';
import { SERVICES } from '@/data/services';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { ProjectThumb } from '@/components/illustrations/ProjectThumb';
import { ConceptBadge, Tag } from '@/components/ui/Tag';
import NotFoundPage from './NotFoundPage';

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line pt-10">
      <h2 id={id} className="text-2xl font-bold text-ink">
        {title}
      </h2>
      <div className="mt-5 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-violet" />
          <span className="text-ink/85">{i}</span>
        </li>
      ))}
    </ul>
  );
}

/** Reusable case-study template. Works for concept and (future) client projects. */
export default function CaseStudyPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFoundPage />;

  const path = `/portfolio/${project.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: project.name, path },
  ];
  const cs = project.caseStudy;
  const isConcept = project.kind === 'concept';
  const others = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 2);
  const services = project.services.map((s) => SERVICES.find((x) => x.slug === s)).filter((s) => s !== undefined);

  return (
    <>
      <Seo
        title={`${project.name}${isConcept ? ' (Concept Study)' : ' — Case Study'}`}
        description={project.summary}
        path={path}
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <PageHero breadcrumbs={crumbs} eyebrow={project.category} title={project.name} description={project.summary}>
        <div className="flex flex-wrap items-center gap-3">
          {isConcept && <ConceptBadge />}
          {project.stack.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </PageHero>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_20rem] lg:py-20">
        <article className="min-w-0 space-y-10">
          {isConcept && (
            <aside className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
              <Info aria-hidden className="mt-0.5 size-5 shrink-0" />
              <p>
                <strong className="font-semibold">This is a concept study, not a client project.</strong> It shows how
                we would approach the problem. No product was delivered to a client and no results are claimed.
              </p>
            </aside>
          )}
          <div className="overflow-hidden rounded-xl border border-line shadow-card">
            <ProjectThumb kind={project.thumbnail} wide />
          </div>

          <Block id="cs-problem" title="The problem">
            <p className="text-ink/85">{cs.problem}</p>
          </Block>
          <Block id="cs-requirements" title="Requirements">
            <List items={cs.requirements} />
          </Block>
          <Block id="cs-approach" title="Approach">
            <List items={cs.approach} />
          </Block>
          <Block id="cs-architecture" title="Architecture">
            <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
              {cs.architecture.map((a) => (
                <div key={a.layer} className="grid gap-1 p-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="font-semibold text-ink">{a.layer}</dt>
                  <dd className="text-muted">{a.detail}</dd>
                </div>
              ))}
            </dl>
          </Block>
          <Block id="cs-implementation" title={isConcept ? 'Implementation plan' : 'Implementation'}>
            <List items={cs.implementation} />
          </Block>
          <Block id="cs-outcomes" title="Verified outcomes">
            {cs.verifiedOutcomes.length > 0 ? (
              <List items={cs.verifiedOutcomes} />
            ) : (
              <p className="rounded-xl border border-dashed border-line bg-white p-5">
                None. {isConcept ? 'This is a concept study, so there are no real-world results to report.' : 'Outcomes have not been measured yet.'}
              </p>
            )}
          </Block>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-white p-6 shadow-card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Services involved</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="font-medium text-blue hover:underline">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-navy p-6 text-white">
            <p className="font-semibold">Working on something similar?</p>
            <p className="mt-2 text-sm text-slate-300">Tell us about it and we’ll suggest an approach.</p>
            <Link
              to="/contact"
              className="mt-4 inline-flex font-semibold text-cyan underline-offset-4 hover:underline"
            >
              Start a Project →
            </Link>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="more-work" className="container-page">
          <h2 id="more-work" className="text-2xl font-bold text-ink">
            More concept studies
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
