import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'report' }
  | { name: 'reports' }
  | { name: 'detail'; id: string }
  | { name: 'map' }
  | { name: 'assist' }
  | { name: 'how' }
  | { name: 'privacy' }
  | { name: 'opensource' };

interface RouterContextValue {
  route: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'home' });

  const navigate = useCallback((r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
