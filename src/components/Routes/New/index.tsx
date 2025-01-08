"use client"; // Uses react state

import { useState } from "react";

import RouteForm from "@/components/Routes/CreateForm";
import useRouteForm from "@/components/Routes/CreateForm/hooks";
import { RouteFormFields } from "@/components/Routes/CreateForm/schema";
import RouteResults from "@/components/Routes/Results";
import { IRoute } from "@/models/Route";


export default function NewRoute({
  defaultValues,
  userId,
  customerId,
}: {
  defaultValues?: RouteFormFields,
  userId?: string | null,
  customerId?: string | null,
}) {
  const [route, setRoute] = useState<Omit<IRoute, "_id"> | null>(null);
  const form = useRouteForm({ defaultValues });

  return route
    ? (
      <RouteResults
        userId={userId}
        customerId={customerId}
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