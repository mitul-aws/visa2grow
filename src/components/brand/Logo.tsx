import { useId } from 'react';
import type { CSSProperties } from 'react';
import {
  LOCKUP_GAP_EM,
  LOCKUP_SCALE,
  MARK_BASELINE,
  MARK_GRADIENT,
  MARK_PATHS,
  MARK_STROKE,
  MARK_VIEWBOX,
  MARK_VIEWBOX_BOTTOM,
  MARK_VIEWBOX_TOP,
} from './geometry';
import { cn } from '@/lib/cn';

type MarkTone = 'gradient' | 'white' | 'current';

interface LogoMarkProps {
  /** Rendered height in px. Width follows the mark's aspect ratio. */
  height?: number;
  tone?: MarkTone;
  className?: string;
  /** Accessible name. Omit when the mark sits next to visible brand text. */
  title?: string;
  style?: CSSProperties;
}

export function LogoMark({ height = 32, tone = 'gradient', className, title, style }: LogoMarkProps) {
  const gradientId = `v2g-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const stroke = tone === 'gradient' ? `url(#${gradientId})` : tone === 'white' ? '#FFFFFF' : 'currentColor';
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      height={height}
      width={Math.round(height * (79 / 47))}
      className={cn('shrink-0', className)}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {tone === 'gradient' && (
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={MARK_GRADIENT.x1}
            y1={MARK_GRADIENT.y1}
            x2={MARK_GRADIENT.x2}
            y2={MARK_GRADIENT.y2}
          >
            {MARK_GRADIENT.stops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <g fill="none" stroke={stroke} strokeWidth={MARK_STROKE} strokeLinecap="round" strokeLinejoin="round">
        {Object.entries(MARK_PATHS).map(([key, d]) => (
          <path key={key} d={d} />
        ))}
      </g>
    </svg>
  );
}

type LogoVariant = 'light' | 'dark' | 'mono';

interface LogoProps {
  /** light = for light backgrounds, dark = white wordmark for dark backgrounds. */
  variant?: LogoVariant;
  tagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TAGLINE = 'IDEAS · CODE · GROW';

/**
 * Tagline spread edge to edge under the wordmark, so both share the same width
 * at every size. Each character is a flex item; spaces are small fixed-width
 * items, so gaps between words come out wider than gaps between letters.
 */
function Tagline({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('flex justify-between leading-none', className)}>
      {[...TAGLINE].map((ch, i) => (ch === ' ' ? <span key={i} className="w-[0.3em]" /> : <span key={i}>{ch}</span>))}
    </span>
  );
}

/** Wordmark font size per logo size. The mark is derived from it. */
const SIZES = {
  sm: { word: '1.1rem', tag: 'text-[0.5rem]' },
  md: { word: '1.35rem', tag: 'text-[0.56rem]' },
  lg: { word: '2.1rem', tag: 'text-[0.72rem]' },
} as const;

// The mark is sized in em of the wordmark so its "2G" matches the cap height.
// With items-baseline the SVG's bottom edge lands on the text baseline, so it
// is nudged down by the space below the "2G" to put the letters on the line.
const markHeightEm = (MARK_VIEWBOX_BOTTOM - MARK_VIEWBOX_TOP) * LOCKUP_SCALE;
const markStyle: CSSProperties = {
  height: `${markHeightEm}em`,
  width: `${markHeightEm * (79 / 47)}em`,
  position: 'relative',
  top: `${(MARK_VIEWBOX_BOTTOM - MARK_BASELINE) * LOCKUP_SCALE}em`,
  overflow: 'visible',
};

/**
 * Mark + "Visa2Grow" wordmark (+ optional tagline), aligned on one baseline.
 * Renders as live text so it stays crisp and selectable.
 */
export function Logo({ variant = 'light', tagline = false, size = 'md', className }: LogoProps) {
  const s = SIZES[size];
  const wordColor = variant === 'dark' ? 'text-white' : 'text-ink';
  return (
    <span
      className={cn('inline-flex items-baseline leading-none', className)}
      style={{ fontSize: s.word, gap: `${LOCKUP_GAP_EM}em` }}
    >
      <LogoMark tone={variant === 'mono' ? 'current' : 'gradient'} style={markStyle} />
      <span className="inline-flex flex-col">
        <span className={cn('font-bold tracking-[-0.025em]', wordColor)}>
          Visa
          <span className={variant === 'mono' ? undefined : variant === 'dark' ? 'text-gradient-dark' : 'text-gradient'}>2</span>
          Grow
        </span>
        {tagline && (
          <Tagline
            className={cn('mt-[0.5em] font-semibold', s.tag, variant === 'dark' ? 'text-slate-300' : 'text-muted')}
          />
        )}
      </span>
    </span>
  );
}
