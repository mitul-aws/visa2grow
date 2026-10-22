import { Check, GitPullRequest } from 'lucide-react';

/**
 * Decorative product visual: an editor with an AI suggestion awaiting human
 * review, a review checklist and a delivery pipeline. Hidden from assistive
 * tech; the surrounding copy carries the meaning. Contains no metrics.
 */
export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[34rem] select-none lg:max-w-none">
      {/* glow */}
      <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-tr from-blue/20 via-violet/20 to-cyan/20 blur-3xl" />

      {/* editor window */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-white shadow-float">
        <div className="flex items-center gap-3 border-b border-line bg-canvas/80 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff6b6b]/70" />
            <span className="size-2.5 rounded-full bg-[#ffc94d]/80" />
            <span className="size-2.5 rounded-full bg-[#3ccf91]/80" />
          </div>
          <div className="flex min-w-0 items-center gap-2 rounded-md bg-white px-2.5 py-1 text-[0.7rem] font-medium text-muted ring-1 ring-line">
            <span className="size-2 rounded-sm bg-blue/80" />
            <span className="truncate">orders/create-order.ts</span>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-x-4 px-4 py-4 font-mono text-[0.68rem] leading-[1.75] sm:text-[0.74rem]">
          <div className="text-right text-slate-500">
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <div className="min-w-0 overflow-hidden whitespace-pre text-ink/85">
            <div>
              <span className="text-violet">export async function</span> <span className="text-blue">createOrder</span>(input) {'{'}
            </div>
            <div>
              {'  '}<span className="text-violet">const</span> data = OrderSchema.<span className="text-blue">parse</span>(input);
            </div>
            <div>
              {'  '}<span className="text-violet">const</span> order = <span className="text-violet">await</span> db.order.
              <span className="text-blue">create</span>({'{ data }'});
            </div>
            <div>
              {'  '}<span className="text-violet">await</span> events.<span className="text-blue">publish</span>(
              <span className="text-[#0a6b49]">'order.created'</span>);
            </div>
            <div>
              {'  '}<span className="text-violet">return</span> order;
            </div>
            <div>{'}'}</div>
            <div>&nbsp;</div>
            <div className="-mx-2 rounded-md bg-violet-50 px-2 ring-1 ring-violet/15">
              <span className="text-[#6a2bd9]">test</span>(<span className="text-[#0a6b49]">'rejects an empty cart'</span>, ...);
            </div>
            <div className="-mx-2 rounded-md bg-violet-50 px-2 ring-1 ring-violet/15">
              <span className="text-[#6a2bd9]">test</span>(<span className="text-[#0a6b49]">'publishes order.created'</span>, ...);
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 font-sans text-[0.68rem] font-semibold text-violet">
              AI-suggested tests · awaiting engineer review
            </div>
          </div>
        </div>
        <div className="hidden h-24 sm:block" />
        <div className="flex items-center justify-end gap-4 border-t border-line bg-canvas/80 px-4 py-2 text-[0.65rem] font-medium text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#3ccf91]" />
            feature/checkout
          </span>
          <span>TypeScript</span>
          <span>Review requested</span>
        </div>
      </div>

      {/* review checklist */}
      <div className="relative -mt-10 ml-auto w-[15.5rem] rounded-lg border border-line bg-white/95 p-4 shadow-float backdrop-blur sm:absolute sm:-bottom-8 sm:-left-8 sm:mt-0 sm:ml-0 lg:-left-12 motion-safe:animate-float">
        <div className="flex items-center gap-2 text-[0.78rem] font-semibold text-ink">
          <GitPullRequest className="size-4 text-blue" />
          Review checklist
        </div>
        <ul className="mt-3 space-y-2 text-[0.74rem] text-muted">
          {['Types & lint', 'Unit tests', 'Accessibility checks'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#e7f7f0] text-[#0a6b49]">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
          <li className="flex items-center gap-2 font-medium text-ink">
            <span className="relative inline-flex size-4 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-blue/20 motion-safe:animate-ping" />
              <span className="size-2 rounded-full bg-blue" />
            </span>
            Engineer review
          </li>
        </ul>
      </div>

      {/* pipeline */}
      <div className="absolute -right-3 -top-7 hidden w-[13.5rem] rounded-lg border border-white/10 bg-navy p-4 text-white shadow-float sm:block lg:-right-8">
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cyan">Pipeline</div>
        <ol className="mt-3 flex items-center justify-between text-[0.68rem]">
          {['Build', 'Test', 'Preview'].map((step, i) => (
            <li key={step} className="flex flex-1 items-center">
              <span className="flex flex-col items-center gap-1.5">
                <span
                  className={
                    i < 2
                      ? 'inline-flex size-6 items-center justify-center rounded-full bg-cyan/15 text-cyan ring-1 ring-cyan/40'
                      : 'inline-flex size-6 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/25'
                  }
                >
                  {i < 2 ? <Check className="size-3.5" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-white/70" />}
                </span>
                <span className="text-slate-300">{step}</span>
              </span>
              {i < 2 && <span className="mx-1 mb-5 h-px flex-1 bg-gradient-to-r from-cyan/60 to-white/20" />}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
