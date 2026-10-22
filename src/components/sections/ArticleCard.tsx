import { Link } from 'react-router';
import type { ArticleMeta } from '@/types/content';
import { formatDate } from '@/data/articles';

export function ArticleCard({ article, headingLevel = 'h3' }: { article: ArticleMeta; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet">{article.category}</p>
      <H className="mt-3 text-lg font-semibold leading-snug text-ink">
        <Link to={`/insights/${article.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {article.title}
        </Link>
      </H>
      <p className="mt-3 flex-1 leading-relaxed text-muted">{article.description}</p>
      <p className="mt-6 text-sm text-muted">
        <time dateTime={article.published}>{formatDate(article.published)}</time>
        <span aria-hidden> · </span>
        {article.readingMinutes} min read
      </p>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-blue ring-offset-2 group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
