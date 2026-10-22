import { ICONS, type IconName } from './icons';
import { cn } from '@/lib/cn';

interface IconBadgeProps {
  icon: IconName;
  tone?: 'blue' | 'violet' | 'cyan' | 'gradient' | 'dark';
  size?: 'md' | 'lg';
  className?: string;
}

const tones = {
  blue: 'bg-blue-50 text-blue ring-blue/15',
  violet: 'bg-violet-50 text-violet ring-violet/15',
  cyan: 'bg-cyan-50 text-[#0b7fa3] ring-cyan/25',
  gradient: 'bg-brand-gradient text-white ring-transparent shadow-[0_8px_20px_-8px_rgb(40_88_245/0.6)]',
  dark: 'bg-white/8 text-cyan ring-white/12',
} as const;

export function IconBadge({ icon, tone = 'blue', size = 'md', className }: IconBadgeProps) {
  const Icon = ICONS[icon];
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md ring-1',
        size === 'lg' ? 'size-12' : 'size-10',
        tones[tone],
        className,
      )}
    >
      <Icon className={size === 'lg' ? 'size-6' : 'size-5'} strokeWidth={1.8} />
    </span>
  );
}
