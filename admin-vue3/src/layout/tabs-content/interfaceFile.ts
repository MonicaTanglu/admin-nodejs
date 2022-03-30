export interface RouteObject {
    fullPath: string | null;
    name: any;
    path: string | null;
  }
export interface ReactiveObject {
    activeKey: string | null;
    visitedRoutes: RouteObject[] | null;
  }