import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/types/content';
import { IconBadge } from '@/components/ui/IconBadge';
import { Tag } from '@/components/ui/Tag';

const TONES = ['blue', 'violet', 'cyan'] as const;

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const href = `/services/${service.slug}`;
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-blue/30 hover:shadow-lift">
      <div aria-hidden className="absolute inset-x-6 top-0 h-px scale-x-0 bg-brand-gradient transition-transform duration-500 group-hover:scale-x-100" />
      <IconBadge icon={service.icon} tone={TONES[index % TONES.length]} size="lg" />
      <h3 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-ink">
        <Link to={href} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none">
          {service.name}
        </Link>
      </h3>
      <p className="mt-3 flex-1 leading-relaxed text-muted">{service.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${service.name} technologies`}>
        {service.tags.map((t) => (
          <li key={t}>
            <Tag>{t}</Tag>
          </li>
        ))}
      </ul>
      <span aria-hidden className="mt-6 inline-flex items-center gap-1.5 font-semibold text-blue">
        Learn More
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
      {/* Visible focus ring for the stretched link */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-blue ring-offset-2 group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
