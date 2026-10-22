import { Seo } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { PAGE_SEO } from '@/data/seo';
import { sortedArticles } from '@/data/articles';
import { PageHero } from '@/components/sections/PageHero';
import { ArticleCard } from '@/components/sections/ArticleCard';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Insights', path: '/insights' },
];

export default function InsightsPage() {
  const articles = sortedArticles();
  const categories = [...new Set(articles.map((a) => a.category))];
  return (
    <>
      <Seo {...PAGE_SEO.insights} jsonLd={[breadcrumbJsonLd(crumbs)]} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="Insights"
        title="Practical notes on building software"
        description="Short, useful articles on AI-assisted engineering, web development and shaping products, written from hands-on experience."
      />
      <Section labelledBy="articles-heading">
        <div className="container-page">
          <h2 id="articles-heading" className="sr-only">
            Articles
          </h2>
          <p className="text-sm text-muted">
            Topics:{' '}
            {categories.map((c, i) => (
              <span key={c}>
                <span className="font-medium text-ink">{c}</span>
                {i < categories.length - 1 && <span aria-hidden> · </span>}
              </span>
            ))}
          </p>
          {articles.length > 0 ? (
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a, i) => (
                <Reveal as="li" key={a.slug} delay={(i % 3) * 80}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">
              The first articles are on their way.
            </p>
          )}
        </div>
      </Section>
      <CtaBanner />
    </>
  );
}
