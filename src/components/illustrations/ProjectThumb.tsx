import type { Project } from '@/types/content';
import { cn } from '@/lib/cn';

/** Abstract interface illustrations for concept projects. Decorative only. */
export function ProjectThumb({ kind, wide, className }: { kind: Project['thumbnail']; wide?: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden bg-gradient-to-br',
        wide ? 'aspect-[21/9]' : 'aspect-[16/10]',
        kind === 'dashboard' && 'from-blue-50 via-white to-cyan-50',
        kind === 'mobile' && 'from-cyan-50 via-white to-violet-50',
        kind === 'assistant' && 'from-violet-50 via-white to-blue-50',
        className,
      )}
    >
      <div className="bg-grid absolute inset-0 opacity-70" />
      {kind === 'dashboard' && <Dashboard />}
      {kind === 'mobile' && <Mobile />}
      {kind === 'assistant' && <Assistant />}
    </div>
  );
}

const Bar = ({ w, c = 'bg-line' }: { w: string; c?: string }) => <div className={cn('h-1.5 rounded-full', c)} style={{ width: w }} />;

function Dashboard() {
  return (
    <div className="absolute inset-x-[8%] top-[14%] bottom-0 rounded-t-lg border border-line bg-white shadow-float">
      <div className="flex h-full">
        <div className="w-[18%] border-r border-line p-3">
          <div className="mb-3 size-4 rounded bg-brand-gradient" />
          {[70, 85, 60, 75].map((w, i) => (
            <div key={i} className="mb-2.5">
              <Bar w={`${w}%`} c={i === 0 ? 'bg-blue/50' : undefined} />
            </div>
          ))}
        </div>
        <div className="flex-1 p-3">
          <div className="grid grid-cols-3 gap-2">
            {['bg-blue', 'bg-violet', 'bg-cyan'].map((c) => (
              <div key={c} className="rounded-md border border-line p-2">
                <Bar w="50%" />
                <div className={cn('mt-2 h-2.5 w-2/3 rounded-sm opacity-80', c)} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex h-[38%] items-end gap-1.5 rounded-md border border-line p-2">
            {[40, 65, 50, 80, 60, 90, 72, 55, 85].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-blue/70 to-violet/60" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-2 space-y-1.5">
            {[90, 75, 82].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn('size-1.5 rounded-full', i === 1 ? 'bg-amber-400' : 'bg-emerald-400')} />
                <Bar w={`${w}%`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Mobile() {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-4">
      {[0, 1].map((p) => (
        <div
          key={p}
          className={cn(
            'w-[26%] rounded-t-[1.1rem] border-4 border-b-0 border-navy bg-white p-2 shadow-float',
            p === 0 ? 'h-[78%]' : 'h-[64%] opacity-90',
          )}
        >
          <div className="mx-auto mb-2 h-1 w-1/3 rounded-full bg-navy/80" />
          <div className="flex items-center justify-between">
            <Bar w="45%" c="bg-ink/60" />
            <span className="rounded-full bg-amber-100 px-1 text-[0.4rem] font-bold text-amber-700">OFFLINE</span>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="mt-2 flex items-center gap-1.5 rounded-md border border-line p-1.5">
              <div className={cn('size-2.5 rounded-sm', i < 3 ? 'bg-emerald-400' : 'border border-line')} />
              <Bar w={`${50 + i * 8}%`} />
            </div>
          ))}
          <div className="mt-2 h-6 rounded-md bg-brand-gradient opacity-90" />
        </div>
      ))}
    </div>
  );
}

function Assistant() {
  return (
    <div className="absolute inset-x-[12%] top-[12%] bottom-0 rounded-t-lg border border-line bg-white p-4 shadow-float">
      <div className="ml-auto w-[55%] rounded-lg rounded-br-sm bg-blue px-3 py-2">
        <Bar w="90%" c="bg-white/80" />
        <div className="mt-1.5">
          <Bar w="60%" c="bg-white/60" />
        </div>
      </div>
      <div className="mt-3 w-[75%] rounded-lg rounded-bl-sm border border-line bg-canvas px-3 py-2.5">
        <Bar w="95%" />
        <div className="mt-1.5">
          <Bar w="80%" />
        </div>
        <div className="mt-1.5">
          <Bar w="55%" />
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {['bg-violet/20 text-violet', 'bg-cyan/20 text-[#0b7fa3]'].map((c, i) => (
            <span key={i} className={cn('rounded px-1.5 py-0.5 text-[0.45rem] font-bold', c)}>
              SOURCE {i + 1}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-full border border-line px-3 py-2">
        <Bar w="60%" />
        <div className="ml-auto size-4 rounded-full bg-brand-gradient" />
      </div>
    </div>
  );
}
