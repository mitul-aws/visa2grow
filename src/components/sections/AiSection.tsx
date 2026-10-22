import { Check, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { TextLink } from '@/components/ui/Button';

const AI_ACCELERATES = [
  'Code generation and refactoring',
  'Reusable component development',
  'Test generation and automation',
  'Documentation',
  'Rapid prototyping',
  'Workflow automation',
];

const HUMANS_OWN = [
  'Architecture and technical decisions',
  'Review of every change before it ships',
  'Security validation and data handling',
  'Test strategy and quality assurance',
  'Product judgement and trade-offs',
  'Accountability for the result',
];

export function AiSection() {
  return (
    <Section tone="dark" labelledBy="ai-heading">
      <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden className="absolute -top-40 left-1/4 h-80 w-[36rem] rounded-full bg-blue/25 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 right-0 h-80 w-[30rem] rounded-full bg-violet/25 blur-3xl" />
      <div className="container-page relative">
        <SectionHeading
          id="ai-heading"
          dark
          align="center"
          eyebrow="How we use AI"
          title={
            <>
              AI-first. <span className="text-gradient-dark">Human-led.</span>
            </>
          }
          description="AI makes routine engineering work faster, which leaves more time for the decisions that need experience. It supports our engineers. It doesn’t replace their judgement."
        />

        <div className="relative mt-16 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <Reveal className="rounded-xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-md bg-violet/20 text-[#b99bff] ring-1 ring-violet/30">
                <Sparkles className="size-5" />
              </span>
              <h3 className="text-lg font-semibold text-white">What AI accelerates</h3>
            </div>
            <ul className="mt-6 space-y-3.5">
              {AI_ACCELERATES.map((item) => (
                <li key={item} className="flex gap-3 text-slate-300">
                  <Check aria-hidden className="mt-0.5 size-4.5 shrink-0 text-[#b99bff]" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} className="flex items-center justify-center lg:px-2">
            <div className="flex items-center gap-3 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2.5 text-sm font-semibold text-cyan lg:flex-col lg:rounded-2xl lg:px-4 lg:py-6">
              <ShieldCheck aria-hidden className="size-5" />
              <span className="lg:[writing-mode:vertical-rl] lg:rotate-180">Human review gate</span>
            </div>
          </Reveal>

          <Reveal delay={200} className="rounded-xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-md bg-cyan/15 text-cyan ring-1 ring-cyan/30">
                <UserCheck className="size-5" />
              </span>
              <h3 className="text-lg font-semibold text-white">What engineers own</h3>
            </div>
            <ul className="mt-6 space-y-3.5">
              {HUMANS_OWN.map((item) => (
                <li key={item} className="flex gap-3 text-slate-300">
                  <Check aria-hidden className="mt-0.5 size-4.5 shrink-0 text-cyan" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-12 text-center">
          <TextLink to="/insights/ai-assisted-development-what-it-speeds-up" className="text-cyan">
            Read: what AI speeds up, and what it shouldn’t
          </TextLink>
        </div>
      </div>
    </Section>
  );
}
