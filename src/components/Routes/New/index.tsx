"use client"; // Uses react state

import React from "react";

import { IRoute } from "@/models/Route";
import RouteResults from "../Results";
import RouteForm from "../CreateForm";
import { RouteFormFields } from "../CreateForm/schema";
import useRouteForm from "../CreateForm/hooks";


export default function NewRoute({
  defaultValues,
  userId,
  customerId,
}: {
  defaultValues?: RouteFormFields,
  userId?: string | null,
  customerId?: string | null,
}) {
  const [route, setRoute] = React.useState<Omit<IRoute, "_id"> | null>(null);
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