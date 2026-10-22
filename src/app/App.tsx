import { useRoutes } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { ROUTE_TABLE } from './routeTable';

const routes = [
  {
    element: <Layout />,
    children: ROUTE_TABLE.map(({ path, page: Page }) => ({ path, element: <Page /> })),
  },
];

export function App() {
  return useRoutes(routes);
}
