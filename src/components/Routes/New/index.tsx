"use client"; // Uses react state

import { useState } from "react";

import RouteForm from "@/components/Routes/Form";
import useRouteForm from "@/components/Routes/Form/hooks";
import { RouteFormFields } from "@/components/Routes/Form/schema";
import RouteResults from "@/components/Routes/Results";
import { IRoute } from "@/models/Route";


export default function NewRoute({
  defaultValues,
  isSaveAllowed,
}: {
  defaultValues?: RouteFormFields,
  isSaveAllowed: boolean,
}) {
  const [route, setRoute] = useState<Omit<IRoute, "_id"> | null>(null);
  // Form is initialized here so it remains initialized when showing route results
  // Allows the edit route button to easily switch back without the need to re-fetch all the address data
  const form = useRouteForm({ defaultValues });

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