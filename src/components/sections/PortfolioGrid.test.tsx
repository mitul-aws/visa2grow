import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { PortfolioGrid } from './PortfolioGrid';
import { PROJECTS } from '@/data/projects';

describe('PortfolioGrid', () => {
  it('filters projects by category and marks the active filter', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PortfolioGrid projects={PROJECTS} />
      </MemoryRouter>,
    );
    const group = screen.getByRole('group', { name: /filter projects/i });
    expect(within(group).getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('article')).toHaveLength(PROJECTS.length);

    await user.click(within(group).getByRole('button', { name: /^Mobile/ }));
    expect(within(group).getByRole('button', { name: /^Mobile/ })).toHaveAttribute('aria-pressed', 'true');
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(PROJECTS.filter((p) => p.category === 'Mobile').length);
    expect(screen.getByText(/showing 1 project in Mobile/i)).toBeInTheDocument();

    await user.click(within(group).getByRole('button', { name: /^All/ }));
    expect(screen.getAllByRole('article')).toHaveLength(PROJECTS.length);
  });

  it('labels every concept project as a concept', () => {
    render(
      <MemoryRouter>
        <PortfolioGrid projects={PROJECTS} />
      </MemoryRouter>,
    );
    expect(screen.getAllByText('Concept project')).toHaveLength(PROJECTS.filter((p) => p.kind === 'concept').length);
  });
});
