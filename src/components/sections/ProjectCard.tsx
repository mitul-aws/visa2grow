import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/types/content';
import { ProjectThumb } from '@/components/illustrations/ProjectThumb';
import { ConceptBadge, Tag } from '@/components/ui/Tag';

export function ProjectCard({ project, headingLevel = 'h3' }: { project: Project; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  const href = `/portfolio/${project.slug}`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
      <ProjectThumb kind={project.thumbnail} className="border-b border-line" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {project.kind === 'concept' && <ConceptBadge />}
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{project.category}</span>
        </div>
        <H className="mt-3 text-lg font-semibold text-ink">
          <Link to={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.name}
          </Link>
        </H>
        <p className="mt-2 flex-1 leading-relaxed text-muted">{project.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technology stack">
          {project.stack.slice(0, 4).map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
        <span aria-hidden className="mt-5 inline-flex items-center gap-1.5 font-semibold text-blue">
          {project.kind === 'concept' ? 'View concept study' : 'Read case study'}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-blue ring-offset-2 group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
