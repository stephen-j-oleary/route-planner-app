import { isArray } from "lodash";
import React from "react";

import { Paper } from "@mui/material";

import RouteResults from "@/components/Routes/Results";
import RouteResultsMap from "@/components/Routes/Results/Map";
import DefaultLayout from "@/components/ui/Layouts/Default";
import useRouterQuery from "@/hooks/useRouterQuery";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetRouteById, useGetRouteLocalById } from "@/reactQuery/useRoutes";


const ShowRoute: NextPageWithLayout = () => {
  const query = useRouterQuery();
  let routeId = query.get("route");
  if (isArray(routeId)) routeId = routeId[0];

  const routeFromDb = useGetRouteById(routeId, { enabled: query.isReady });
  const routeFromLocal = useGetRouteLocalById(routeId, { enabled: query.isReady });
  const routeQuery = (routeFromDb.isSuccess && routeFromDb.data && routeFromDb) // Return the db route if the query is successful and has data
    || (routeFromLocal.isSuccess && routeFromLocal.data && routeFromLocal) // Return the local route if query is successful and has data
    || routeFromDb // Return the db query if neither query has successfully retrieved data yet


  return (
    <>
      <RouteResultsMap
        routeQuery={routeQuery}
      />

      <Paper>
        <RouteResults
          routeQuery={routeQuery}
        />
      </Paper>
    </>
  );
}

ShowRoute.getLayout = props => (
  <DefaultLayout
    title="View Route"
    headingComponent="p"
    {...props}
  />
);

export default ShowRoute;