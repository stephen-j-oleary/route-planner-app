import { cookies } from "next/headers";

import { Paper } from "@mui/material";

import RouteResults from "@/components/Routes/Results";
import RouteResultsMap from "@/components/Routes/Results/Map";
import { getLocalRouteById } from "@/services/localRoutes";
import { getUserRouteById } from "@/services/routes";
import { PageProps } from "@/types/next";
import { auth } from "@/utils/auth/server";


export default async function ShowRoute({
  params,
}: PageProps<{ slug: string[] }>) {
  const { userId } = await auth(cookies());

  const { slug } = params;

  const savedId = (slug.length === 2 && slug[0] === "saved") ? slug[1] : null;
  const localId = (slug.length === 1) ? slug[0] : null;

  const savedRoute = (userId && savedId) ? await getUserRouteById(savedId) : null;
  const localRoute = (userId && localId) ? await getLocalRouteById(localId) : null;

  const route = savedRoute || localRoute || null;


  return (
    <>
      <RouteResultsMap
        route={route}
      />

      <Paper>
        <RouteResults
          route={route}
          isSaved={!!savedId}
        />
      </Paper>
    </>
  );
}

export const metadata = {
  title: "Loop Mapping - View Route",
};