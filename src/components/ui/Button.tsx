import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outline-dark';
type Size = 'md' | 'lg';

const base =
  'group inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-[background-color,box-shadow,color,transform,border-color] duration-200 select-none disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-gradient text-white shadow-[0_8px_24px_-10px_rgb(40_88_245/0.7)] hover:shadow-[0_12px_30px_-10px_rgb(133_70_248/0.75)] hover:brightness-[1.06]',
  secondary: 'border border-line bg-white text-ink shadow-card hover:border-blue/40 hover:text-blue',
  ghost: 'text-blue hover:bg-blue-50',
  light: 'bg-white text-navy hover:bg-blue-50',
  'outline-dark': 'border border-white/25 text-white hover:border-white/60 hover:bg-white/5',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-13 px-6 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      {children}
      {arrow && (
        <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );
}

export function ButtonLink({ variant = 'primary', size = 'md', arrow, className, children, ...rest }: CommonProps & LinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}

export const Button = forwardRef<HTMLButtonElement, CommonProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  function Button({ variant = 'primary', size = 'md', arrow, className, children, type = 'button', ...rest }, ref) {
    return (
      <button ref={ref} type={type} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
        <Inner arrow={arrow}>{children}</Inner>
      </button>
    );
  },
);

/** Inline text link with an arrow, used for "Learn more" style links. */
export function TextLink({ className, children, ...rest }: LinkProps & { children: ReactNode }) {
  return (
    <Link
      className={cn(
        'group inline-flex items-center gap-1.5 font-semibold text-blue underline-offset-4 hover:underline',
        className,
      )}
      {...rest}
    >
      {children}
      <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
