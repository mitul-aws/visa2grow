import { Seo } from '@/lib/seo';
import { professionalServiceJsonLd } from '@/lib/jsonld';
import { PAGE_SEO } from '@/data/seo';
import { SERVICES } from '@/data/services';
import { APPS } from '@/data/apps';
import { sortedArticles } from '@/data/articles';
import { Hero } from '@/components/sections/Hero';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { AiSection } from '@/components/sections/AiSection';
import { WhyUs } from '@/components/sections/WhyUs';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { AppCard } from '@/components/sections/AppCard';
import { ArticleCard } from '@/components/sections/ArticleCard';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, TextLink } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <>
      <Seo {...PAGE_SEO.home} jsonLd={[professionalServiceJsonLd(SERVICES.map((s) => s.name))]} />
      <Hero />

      <Section labelledBy="services-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="services-heading"
              eyebrow="Services"
              title="From first idea to software that scales"
              description="From auditing the system you already have to designing, building and scaling new products. Each service works on its own or together with the others."
            />
            <Reveal className="shrink-0">
              <TextLink to="/services">All services</TextLink>
            </Reveal>
          </div>
          <div className="mt-14">
            <ServicesGrid />
          </div>
        </div>
      </Section>

      <AiSection />

      <Section tone="white" labelledBy="why-heading">
        <div className="container-page">
          <SectionHeading
            id="why-heading"
            eyebrow="Why Visa2Grow"
            title="A new studio, built on deep experience"
            description="We’re a young company with a long engineering background. That combination means modern, AI-first workflows, guided by judgement earned over years of shipping software."
          />
          <div className="mt-14">
            <WhyUs />
          </div>
        </div>
      </Section>

      <Section labelledBy="process-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="process-heading"
              eyebrow="Our process"
              title="A clear path from first call to launch"
              description="Six stages, each with a visible output, so you always know what’s happening and what comes next."
            />
            <Reveal className="shrink-0">
              <TextLink to="/process">How we work</TextLink>
            </Reveal>
          </div>
          <div className="mt-16">
            <ProcessTimeline />
          </div>
        </div>
      </Section>

      <Section tone="white" labelledBy="work-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="work-heading"
              eyebrow="Portfolio"
              title="Real apps, live on Google Play"
              description="We design, build and publish our own products, so you can try our work before you talk to us. These Android apps are built with React Native, Expo and TypeScript and listed under the Visa2Grow name."
            />
            <Reveal className="shrink-0">
              <TextLink to="/portfolio">Full portfolio</TextLink>
            </Reveal>
          </div>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {APPS.map((app, i) => (
              <Reveal as="li" key={app.slug} delay={(i % 4) * 70} className={i >= 4 ? 'hidden sm:block' : undefined}>
                <AppCard app={app} compact />
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-dashed border-blue/30 bg-blue-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-ink">
              <strong className="font-semibold">Want your product built to the same standard?</strong>{' '}
              <span className="text-muted">Tell us what you’re planning and we’ll suggest a practical approach.</span>
            </p>
            <ButtonLink to="/contact" variant="secondary" arrow>
              Discuss Your Project
            </ButtonLink>
          </Reveal>
        </div>
      </Section>

      <Section labelledBy="insights-heading" className="!pb-4">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="insights-heading"
              eyebrow="Insights"
              title="Notes on building software well"
            />
            <Reveal className="shrink-0">
              <TextLink to="/insights">All insights</TextLink>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {sortedArticles()
              .slice(0, 3)
              .map((a, i) => (
                <Reveal as="li" key={a.slug} delay={i * 80}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
          </ul>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
