import { beforeAll, describe, expect, it } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/test/renderApp';
import { preloadAllPages } from '@/app/routeTable';

beforeAll(async () => {
  await preloadAllPages();
});

describe('Header navigation', () => {
  it('lists every main section and the primary CTA', () => {
    renderApp('/');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const label of ['Home', 'Services', 'Portfolio', 'Process', 'About', 'Insights', 'Contact']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('link', { name: /start a project/i }).length).toBeGreaterThan(0);
  });

  it('navigates client-side between pages and updates the document title', async () => {
    const user = userEvent.setup();
    renderApp('/');
    // Pages render through React's use(); React expects such updates inside an
    // awaited act() so it can flush their effects (head updates) afterwards.
    await act(async () => {
      await user.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Services' }));
    });
    expect(await screen.findByRole('heading', { level: 1, name: /software development services/i })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('Software Development Services: Web, Mobile & AI | Visa2Grow'));
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://www.visa2grow.com/services');
  });

  it('opens and closes the mobile menu accessibly', async () => {
    const user = userEvent.setup();
    renderApp('/');
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog', { name: 'Site menu' })).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const dialog = screen.getByRole('dialog', { name: 'Site menu' });
    expect(within(dialog).getByRole('link', { name: 'Home' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Site menu' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes the mobile menu after choosing a page', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(within(screen.getByRole('dialog', { name: 'Site menu' })).getByRole('link', { name: 'About' }));
    expect(await screen.findByRole('heading', { level: 1, name: /new software studio/i })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Site menu' })).not.toBeInTheDocument();
  });

  it('shows the not-found page for unknown routes', async () => {
    renderApp('/definitely-not-a-page');
    expect(await screen.findByRole('heading', { level: 1, name: /doesn’t exist/i })).toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow'));
  });

  it('links service cards to their service pages', async () => {
    renderApp('/services');
    const links = await screen.findAllByRole('link', { name: 'AI & Automation' });
    expect(links.length).toBeGreaterThanOrEqual(2); // card + footer
    for (const link of links) expect(link).toHaveAttribute('href', '/services/ai-automation');
  });
});
