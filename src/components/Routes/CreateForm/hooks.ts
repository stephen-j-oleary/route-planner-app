import "client-only";

import { isString } from "lodash-es";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { RouteFormFields } from "./schema";
import { Stop } from "@/models/Route";
import pages from "@/pages";


export default function useRouteForm({
  defaultValues,
}: {
  defaultValues: RouteFormFields | undefined,
}) {
  const [stops, setStops] = useState<Partial<Stop>[]>(defaultValues?.stops ?? []);
  const [origin, setOrigin] = useState(defaultValues?.origin ?? 0);
  const [destination, setDestination] = useState(defaultValues?.destination ?? 0);
  const [stopTime, setStopTime] = useState(defaultValues?.stopTime ?? 0);

  return {
    stops,
    setStops,
    origin,
    setOrigin,
    destination,
    setDestination,
    stopTime,
    setStopTime,
  };
}


export function useRouteFormSyncParams(form: ReturnType<typeof useRouteForm>) {
  const { stopTime, origin, destination, stops } = form;
  const searchParams = useSearchParams();


  useEffect(
    function syncUrlParams() {
      const params = new URLSearchParams(searchParams);
      if (stopTime) params.set("stopTime", stopTime.toString());
      else params.delete("stopTime");

      if (origin) params.set("origin", origin.toString())
      else params.delete("origin")

      if (destination) params.set("destination", destination.toString())
      else params.delete("destination")

      const stopsStr = (stops || [])
        .map(v => v?.fullText)
        .filter(isString)
        .map(v => encodeURIComponent(v))
        .join("/");

      window.history.replaceState(null, "", `${pages.routes.new}/${stopsStr}?${params.toString()}`);
    },
    [searchParams, stopTime, origin, destination, stops]
  );
}