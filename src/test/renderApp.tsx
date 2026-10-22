import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { App } from '@/app/App';
import { SeoProvider } from '@/lib/seo';

export function renderApp(path = '/') {
  return render(
    <SeoProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </SeoProvider>,
  );
}
