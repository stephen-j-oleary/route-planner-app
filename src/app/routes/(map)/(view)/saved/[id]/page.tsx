import { getUserRouteById } from "@/app/api/user/routes/[id]/actions";
import RouteResults from "@/components/Routes/Results";
import { PageProps } from "@/types/next";


export default async function ShowRoute({
  params,
}: PageProps<{ id: string }>) {
  const { id } = params;

  const route = id ? await getUserRouteById(id) : null;


  return (
    <RouteResults
      route={route}
      isSaved
    />
  );
}