import "client-only";

import { isString } from "lodash-es";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { RouteFormFields } from "./schema";
import { TStop } from "@/models/Route";
import pages from "@/pages";


export type TRouteForm = ReturnType<typeof useRouteForm>;

export default function useRouteForm({
  defaultValues,
}: {
  defaultValues: Pick<RouteFormFields, "stops" | "origin" | "destination" | "stopTime"> | undefined,
}) {
  const [stops, setStops] = useState<Partial<TStop>[]>(defaultValues?.stops ?? []);
  const [origin, setOrigin] = useState(defaultValues?.origin ?? 0);
  const [destination, setDestination] = useState(defaultValues?.destination ?? 0);
  const [stopTime, setStopTime] = useState(defaultValues?.stopTime ?? 0);

  const addStop = (stop: Partial<TStop>) => setStops(arr => [...arr, stop]);
  const removeStop = (index: number) => setStops(arr => arr.filter((v, i) => i !== index));
  const updateStop = (index: number, value: Partial<TStop>) => setStops(arr => arr.map((v, i) => i === index ? value : v));


  const isLastStopEmpty = !stops[stops.length - 1]?.fullText;
  useEffect(
    function keepEmptyStopFieldAtEnd() {
      if (!isLastStopEmpty) addStop({ fullText: "" });
    },
    [isLastStopEmpty, stops]
  );


  return {
    stops,
    setStops,
    addStop,
    removeStop,
    updateStop,
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