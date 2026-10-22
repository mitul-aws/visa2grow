import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface RevealProps {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
  id?: string;
}

/**
 * Marks a block for a subtle scroll-in. Purely a CSS class: the observer in
 * useRevealObserver adds `is-visible`. Content is visible without JS and with
 * reduced motion.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, id }: RevealProps) {
  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Tag id={id} className={cn('reveal', className)} style={style}>
      {children}
    </Tag>
  );
}
