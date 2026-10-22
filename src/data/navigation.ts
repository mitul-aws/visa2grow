export interface NavItem {
  label: string;
  to: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Process', to: '/process' },
  { label: 'About', to: '/about' },
  { label: 'Insights', to: '/insights' },
  { label: 'Contact', to: '/contact' },
];

export const PRIMARY_CTA: NavItem = { label: 'Start a Project', to: '/contact' };
