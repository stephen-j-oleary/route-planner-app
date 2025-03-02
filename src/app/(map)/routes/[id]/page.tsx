import type { Metadata } from "next";

import { getUserRouteById } from "@/app/api/user/routes/[id]/actions";
import RouteResults from "@/components/Routes/Results";
import { PageProps } from "@/types/next";
import { checkFeature, features } from "@/utils/features";


export default async function ShowRoute({
  params,
}: PageProps<{ id: string }>) {
  const { id } = await params;

  const route = id ? await getUserRouteById(id) : null;

  const isSaveAllowed = await checkFeature(features.routes_save);

  return (
    <RouteResults
      route={route}
      isSaved
      isSaveAllowed={isSaveAllowed}
    />
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - View Route",
  description: "View your optimized route with Loop Mapping. Get detailed information about your trip and the optimal order for your stops.",
};