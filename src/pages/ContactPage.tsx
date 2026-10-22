import { useSearchParams } from 'react-router';
import { Mail } from 'lucide-react';
import { Seo } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { PAGE_SEO } from '@/data/seo';
import { SITE } from '@/lib/site';
import { PageHero } from '@/components/sections/PageHero';
import { ContactForm } from '@/components/forms/ContactForm';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];

const NEXT_STEPS = [
  { title: 'We read your message', body: 'Every inquiry is read by a person, not routed into an automated sequence.' },
  { title: 'We reply with questions', body: 'Usually a few clarifying questions and an initial view on approach.' },
  { title: 'A short call, if useful', body: 'To understand goals, constraints and priorities in more depth.' },
  { title: 'A written proposal', body: 'Scope, approach, milestones and an estimate range with its assumptions.' },
];

export default function ContactPage() {
  const [params] = useSearchParams();
  return (
    <>
      <Seo {...PAGE_SEO.contact} jsonLd={[breadcrumbJsonLd(crumbs)]} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="Start a Project"
        title={
          <>
            Tell us what you’re <span className="text-gradient">planning</span>
          </>
        }
        description="Share a few details about your idea or project. There’s no obligation, and you don’t need a detailed specification. A clear description of the problem is the perfect starting point."
      />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_22rem] lg:py-20">
        <section aria-labelledby="form-heading" className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-10">
          <h2 id="form-heading" className="text-2xl font-bold text-ink">
            Project inquiry
          </h2>
          <div className="mt-6">
            <ContactForm initialService={params.get('service') ?? undefined} />
          </div>
        </section>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="on-dark rounded-xl bg-navy p-7 text-white">
            <h2 className="text-lg font-semibold">What happens next</h2>
            <ol className="mt-6 space-y-5">
              {NEXT_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl bg-white p-6 ring-1 ring-line">
            <h2 className="font-semibold text-ink">Not sure what you need?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Choose “Not sure yet” as the service and describe the problem in your own words. Working out the right
              approach is part of what we do.
            </p>
          </div>
          {SITE.contactEmail && (
            <div className="flex items-start gap-4 rounded-xl bg-white p-6 ring-1 ring-line">
              <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue ring-1 ring-blue/15">
                <Mail className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-semibold text-ink">Prefer email?</h2>
                <a href={`mailto:${SITE.contactEmail}`} className="mt-1 block break-all font-semibold text-blue hover:underline">
                  {SITE.contactEmail}
                </a>
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
