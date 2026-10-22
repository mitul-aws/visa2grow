import { ChevronDown } from 'lucide-react';
import type { Faq } from '@/types/content';

/** Native <details> so answers are in the HTML and work without JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-card">
      {faqs.map((faq) => (
        <details key={faq.question} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-5 py-5 text-left font-semibold text-ink transition-colors hover:text-blue sm:px-6 [&::-webkit-details-marker]:hidden">
            <h3 className="text-base">{faq.question}</h3>
            <ChevronDown
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="px-5 pb-6 leading-relaxed text-muted sm:px-6">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
