import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Seo } from '@/lib/seo';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { ARTICLES, formatDate, getArticle } from '@/data/articles';
import { ARTICLE_BODIES } from '@/data/article-bodies';
import { SERVICES } from '@/data/services';
import type { ArticleBlock } from '@/types/content';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { ArticleCard } from '@/components/sections/ArticleCard';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { Eyebrow } from '@/components/ui/Section';
import NotFoundPage from './NotFoundPage';

function renderBlock(block: ArticleBlock, i: number) {
  switch (block.type) {
    case 'p':
      return <p key={i}>{block.text}</p>;
    case 'h2':
      return (
        <h2 key={i} id={block.id}>
          {block.text}
        </h2>
      );
    case 'h3':
      return <h3 key={i}>{block.text}</h3>;
    case 'ul':
      return (
        <ul key={i}>
          {block.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i}>
          {block.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote key={i}>
          <p>{block.text}</p>
        </blockquote>
      );
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticle(slug);
  const body = article ? ARTICLE_BODIES[article.slug] : undefined;
  if (!article || !body) return <NotFoundPage />;

  const path = `/insights/${article.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Insights', path: '/insights' },
    { name: article.title, path },
  ];
  const toc = body.filter((b): b is Extract<ArticleBlock, { type: 'h2' }> => b.type === 'h2');
  const related = ARTICLES.filter((a) => a.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 2);
  const services = article.relatedServices.map((s) => SERVICES.find((x) => x.slug === s)).filter((s) => s !== undefined);

  return (
    <>
      <Seo
        title={article.title}
        description={article.description}
        path={path}
        ogType="article"
        article={{ publishedTime: article.published, modifiedTime: article.updated, section: article.category }}
        jsonLd={[
          articleJsonLd({
            title: article.title,
            description: article.description,
            path,
            datePublished: article.published,
            dateModified: article.updated,
            section: article.category,
          }),
          breadcrumbJsonLd(crumbs),
        ]}
      />
      <header className="relative overflow-hidden border-b border-line bg-white">
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="container-page relative max-w-6xl pb-14 pt-10">
          <Breadcrumbs items={crumbs} className="mb-10" />
          <div className="max-w-4xl">
          <Eyebrow>{article.category}</Eyebrow>
          <h1 className="mt-4 text-h1 font-bold text-ink">{article.title}</h1>
          <p className="mt-5 text-lead text-muted">{article.description}</p>
          <p className="mt-6 text-sm text-muted">
            By Visa2Grow · <time dateTime={article.published}>{formatDate(article.published)}</time> ·{' '}
            {article.readingMinutes} min read
          </p>
          </div>
        </div>
      </header>

      <div className="container-page grid max-w-6xl gap-12 py-14 lg:grid-cols-[1fr_16rem] lg:py-20">
        <article className="prose-v2g min-w-0 max-w-[44rem]">{body.map(renderBlock)}</article>
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          {toc.length > 0 && (
            <nav aria-labelledby="toc-heading" className="rounded-xl border border-line bg-white p-5">
              <h2 id="toc-heading" className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
                On this page
              </h2>
              <ol className="mt-3 space-y-2 text-sm">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-ink/80 hover:text-blue">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {services.length > 0 && (
            <div className="rounded-xl bg-canvas p-5 ring-1 ring-line">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Related services</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`} className="font-medium text-blue hover:underline">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-articles" className="container-page max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 id="related-articles" className="text-2xl font-bold text-ink">
              Related insights
            </h2>
            <Link to="/insights" className="inline-flex items-center gap-1.5 font-semibold text-blue hover:underline">
              <ArrowLeft aria-hidden className="size-4" /> All insights
            </Link>
          </div>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {related.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <CtaBanner />
    </>
  );
}
