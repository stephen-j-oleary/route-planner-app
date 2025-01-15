import { cookies } from "next/headers";

import { getUserRouteById } from "@/app/api/user/routes/[id]/actions";
import RouteResults from "@/components/Routes/Results";
import { PageProps } from "@/types/next";
import { features, hasFeatureAccess } from "@/utils/features";


export default async function ShowRoute({
  params,
}: PageProps<{ id: string }>) {
  const { id } = params;

  const route = id ? await getUserRouteById(id) : null;

  const isSaveAllowed = await hasFeatureAccess(features.routes_save, cookies());

  return (
    <RouteResults
      route={route}
      isSaved
      isSaveAllowed={isSaveAllowed}
    />
  );
}

export const metadata = {
  title: "Loop Mapping - View Route",
};