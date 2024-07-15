import { cookies } from "next/headers";

import { Box, Paper } from "@mui/material";

import { getUserRouteById } from "@/app/api/user/routes/[id]/actions";
import RouteResults from "@/components/Routes/Results";
import RouteResultsMap from "@/components/Routes/Results/Map";
import MapProvider from "@/components/ui/Map/Provider";
import ScrollResize from "@/components/ui/ScrollResize";
import { getLocalRouteById } from "@/services/localRoutes";
import { PageProps } from "@/types/next";
import { auth } from "@/utils/auth";


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
    <MapProvider>
      <ScrollResize
        min="50dvh"
        max="80dvh"
      >
        <Box
          position="relative"
          width="100%"
          height="100%"
        >
          <RouteResultsMap route={route} />
        </Box>
      </ScrollResize>

      <Paper>
        <RouteResults
          route={route}
          isSaved={!!savedId}
        />
      </Paper>
    </MapProvider>
  );
}

export const metadata = {
  title: "Loop Mapping - View Route",
};