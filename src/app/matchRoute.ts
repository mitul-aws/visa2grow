import { matchRoutes } from 'react-router';
import { ROUTE_TABLE, type RouteEntry } from './routeTable';

const matchable = ROUTE_TABLE.map((r) => ({ path: r.path, entry: r }));

/** The route-table entry React Router would render for a pathname. */
export function matchRouteEntry(pathname: string): RouteEntry {
  const matches = matchRoutes(matchable, pathname);
  const last = matches?.[matches.length - 1]?.route as { entry: RouteEntry } | undefined;
  return last?.entry ?? (ROUTE_TABLE[ROUTE_TABLE.length - 1] as RouteEntry);
}
