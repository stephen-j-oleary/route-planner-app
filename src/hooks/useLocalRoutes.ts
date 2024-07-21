import "client-only";

import React from "react";

import { ApiPostUserRouteData } from "@/app/api/user/routes/schemas";
import Route, { IRoute } from "@/models/Route";

const SESSION_STORAGE_KEY = "loop-routes";


export default function useLocalRoutes() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(
    () => {
      setReady(true);
      return () => setReady(false);
    },
    []
  );

  const get = React.useCallback(
    () => {
      if (!ready) return [];
      const storageStr = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return (storageStr ? JSON.parse(storageStr) : []) as IRoute[];
    },
    [ready]
  );

  const getById = React.useCallback(
    (id: string) => {
      const routes = get();
      const route = routes.find(item => item._id === id);
      return route;
    },
    [get]
  );

  const create = React.useCallback(
    (routeData: ApiPostUserRouteData & { userId: string }) => {
      if (!ready) throw new Error("Must be called on the client");
      const routes = get();
      const newRoute = new Route(routeData);
      const error = newRoute.validateSync();
      if (error) throw error;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify([...routes, newRoute]));
      return newRoute;
    },
    [ready, get]
  );


  return {
    ready,
    get,
    getById,
    create,
  };
}