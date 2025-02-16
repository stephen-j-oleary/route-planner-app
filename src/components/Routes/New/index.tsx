"use client"; // Uses react state

import { useState } from "react";

import RouteForm from "@/components/Routes/Form";
import useRouteForm, { getDefaultValues } from "@/components/Routes/Form/hooks";
import RouteResults from "@/components/Routes/Results";
import { TRoute } from "@/models/Route";
import { Params } from "@/types/next";


export default function NewRoute({
  isSaveAllowed,
  params,
}: {
  isSaveAllowed: boolean,
  params: Params & { stops: string[] | undefined },
}) {
  const [route, setRoute] = useState<Omit<TRoute, "_id"> | null>(null);
  // Form is initialized here so it remains initialized when showing route results
  // Allows the edit route button to easily switch back without the need to re-fetch all the address data
  const form = useRouteForm(getDefaultValues(params));

  return route
    ? (
      <RouteResults
        isSaveAllowed={isSaveAllowed}
        route={route}
        onEdit={() => setRoute(null)}
      />
    )
    : (
      <RouteForm
        form={form}
        onSuccess={data => setRoute(data)}
      />
    );
}