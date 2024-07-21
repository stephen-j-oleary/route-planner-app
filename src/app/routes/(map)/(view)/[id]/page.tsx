"use client";

import RouteResults from "@/components/Routes/Results";
import useLocalRoutes from "@/hooks/useLocalRoutes";
import { PageProps } from "@/types/next";


export default function ShowRoute({
  params,
}: PageProps<{ id: string }>) {
  const { id } = params;

  const localRoutes = useLocalRoutes();
  const route = localRoutes.getById(id);

  return (
    <RouteResults
      route={route}
      isSaved={false}
    />
  );
}