import "client-only";

import { isString } from "lodash-es";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { RouteFormFields } from "./schema";
import { TStop } from "@/models/Route";
import pages from "@/pages";
import { Params } from "@/types/next";


export type TRouteForm = ReturnType<typeof useRouteForm>;

export function getDefaultValues(
  params: Params & { stops: string[] | undefined }
): RouteFormFields {
  const {
    origin,
    destination,
    stopTime,
    stops = [],
  } = params;

  const defaultValues = {
    stops: [
      ...(stops.map(v => ({ fullText: decodeURIComponent(v) }))),
      { fullText: "" },
    ],
    origin: +(typeof origin === "string" ? origin : "0"),
    destination: +(typeof destination === "string" ? destination : "0"),
    stopTime: +(typeof stopTime === "string" ? stopTime : "0"),
  };

  return defaultValues;
}

export default function useRouteForm(defaultValues: RouteFormFields) {
  const [stops, setStops] = useState<(Partial<Omit<TStop, "fullText">> & Required<Pick<TStop, "fullText">>)[]>(defaultValues.stops);
  const [origin, setOrigin] = useState(defaultValues.origin);
  const [destination, setDestination] = useState(defaultValues.destination);
  const [stopTime, setStopTime] = useState(defaultValues.stopTime);

  const addStop = (stop: Partial<Omit<TStop, "fullText">> & Required<Pick<TStop, "fullText">>) => setStops(arr => [...arr.filter(({ fullText }) => fullText), stop]);
  const removeStop = (index: number) => setStops(arr => arr.filter((v, i) => i !== index));
  const updateStop = (index: number, value: Partial<Omit<TStop, "fullText">> & Required<Pick<TStop, "fullText">>) => setStops(arr => arr.map((v, i) => i === index ? value : v));


  useEffect(
    function keepEmptyStopFieldAtEnd() {
      const isLastStopEmpty = !stops[stops.length - 1]?.fullText;
      if (!isLastStopEmpty) addStop({ fullText: "" });
    },
    [stops]
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