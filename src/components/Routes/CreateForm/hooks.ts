import "client-only";

import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

import { RouteFormFields } from "./schema";
import pages from "pages";


export default function useRouteForm({
  defaultValues,
}: {
  defaultValues: RouteFormFields | undefined,
}) {
  const form = useForm({
    shouldFocusError: false,
    defaultValues
  });

  return form;
}


export function useRouteFormSyncParams(form: ReturnType<typeof useRouteForm>) {
  const searchParams = useSearchParams();


  React.useEffect(
    function syncUrlParams() {
      const { unsubscribe } = form.watch(({ stops, origin, destination, stopTime }) => {
        const params = new URLSearchParams(searchParams);
        if (stopTime) params.set("stopTime", stopTime.toString());
        else params.delete("stopTime");

        if (origin) params.set("origin", origin.toString())
        else params.delete("origin")

        if (destination) params.set("destination", destination.toString())
        else params.delete("destination")

        const stopsStr = (stops || [])
          .map(v => v?.fullText)
          .filter(v => v)
          .join("/");

        window.history.replaceState(null, "", `${pages.routes.new}/${stopsStr}?${params.toString()}`);
      });

      return () => unsubscribe();
    },
    [form, searchParams]
  );
}