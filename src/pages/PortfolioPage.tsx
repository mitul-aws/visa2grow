import { FolderOpen } from 'lucide-react';
import { Seo } from '@/lib/seo';
import { breadcrumbJsonLd, publishedAppsJsonLd } from '@/lib/jsonld';
import { APPS, PLAY_DEVELOPER_URL } from '@/data/apps';
import { PublishedAppsGrid } from '@/components/sections/PublishedAppsGrid';
import { PAGE_SEO } from '@/data/seo';
import { PROJECTS } from '@/data/projects';
import { PageHero } from '@/components/sections/PageHero';
import { PortfolioGrid } from '@/components/sections/PortfolioGrid';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
];

export default function PortfolioPage() {
  const clientWork = PROJECTS.filter((p) => p.kind === 'client');
  const concepts = PROJECTS.filter((p) => p.kind === 'concept');
  return (
    <>
      <Seo {...PAGE_SEO.portfolio} jsonLd={[breadcrumbJsonLd(crumbs), publishedAppsJsonLd()]} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="Portfolio"
        title="Work you can download and try"
        description="Every app below was designed, built and published by Visa2Grow and is live on Google Play, so you can judge the quality yourself. We also publish concept studies showing how we approach other kinds of problems. Client case studies will appear here once clients agree to share them."
      />

      <Section id="apps" labelledBy="apps-heading" className="!pb-8">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h2 id="apps-heading" className="text-2xl font-bold text-ink">
                Our apps on Google Play
              </h2>
              <p className="mt-3 text-muted">
                {APPS.length} Android apps built with React Native, Expo and TypeScript, from puzzle games to a
                fitness tracker and a developer-learning library. Listed under the developer name Visa2Grow.
              </p>
            </div>
            <a
              href={PLAY_DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 font-semibold text-blue underline-offset-4 hover:underline"
            >
              Visa2Grow on Google Play<span className="sr-only"> (opens in a new tab)</span> ↗
            </a>
          </div>
          <div className="mt-8">
            <PublishedAppsGrid />
          </div>
        </div>
      </Section>

      <Section labelledBy="client-heading" className="!py-8">
        <div className="container-page">
          <h2 id="client-heading" className="text-2xl font-bold text-ink">
            Client case studies
          </h2>
          {clientWork.length === 0 ? (
            <div className="mt-6 flex flex-col items-start gap-5 rounded-xl border border-dashed border-line bg-white p-8 sm:flex-row sm:items-center">
              <span aria-hidden className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-canvas text-muted ring-1 ring-line">
                <FolderOpen className="size-6" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-ink">No client case studies published yet.</p>
                <p className="mt-1 text-muted">
                  We only publish client work with permission and verified outcomes. Until then, our own apps above and
                  the concept studies below show the standard we work to.
                </p>
              </div>
              <ButtonLink to="/contact" variant="secondary" arrow>
                Start a Project
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-8">
              <PortfolioGrid projects={clientWork} />
            </div>
          )}
        </div>
      </Section>

      <Section labelledBy="concepts-heading">
        <div className="container-page">
          <h2 id="concepts-heading" className="text-2xl font-bold text-ink">
            Concept studies
          </h2>
          <p className="mt-3 max-w-3xl text-muted">
            Self-initiated explorations. They are not client engagements and make no claims about results.
          </p>
          <div className="mt-8">
            <PortfolioGrid projects={concepts} />
          </div>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
