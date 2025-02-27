import "client-only";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { RouteFormFields } from "./schema";
import { TStop } from "@/models/Stop";
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
      ...(stops.map(v => ({ fullText: decodeURIComponent(v), coordinates: "" }))),
      { fullText: "", coordinates: "" },
    ],
    origin: +(typeof origin === "string" ? origin : "0"),
    destination: +(typeof destination === "string" ? destination : "0"),
    stopTime: +(typeof stopTime === "string" ? stopTime : "0"),
  };

  return defaultValues;
}

export default function useRouteForm(defaultValues: RouteFormFields) {
  const [stops, setStops] = useState<TStop[]>(defaultValues.stops);
  const [origin, setOrigin] = useState(defaultValues.origin);
  const [destination, setDestination] = useState(defaultValues.destination);
  const [stopTime, setStopTime] = useState(defaultValues.stopTime);

  const addStop = (stop: TStop) => setStops(arr => [...arr.filter(({ fullText }) => fullText), stop]);
  const removeStop = (index: number) => setStops(arr => arr.filter((v, i) => i !== index));
  const updateStop = (index: number, value: TStop) => setStops(arr => arr.map((v, i) => i === index ? value : v));


  useEffect(
    function keepEmptyStopFieldAtEnd() {
      const isLastStopEmpty = !stops[stops.length - 1]?.fullText;
      if (!isLastStopEmpty) addStop({ fullText: "", coordinates: "" });
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

  const currSearchStr = searchParams.toString().trim();


  useEffect(
    function syncUrlParams() {
      const newSearchParams = new URLSearchParams(currSearchStr);
      if (stopTime) newSearchParams.set("stopTime", stopTime.toString());
      else newSearchParams.delete("stopTime");

      if (origin) newSearchParams.set("origin", origin.toString())
      else newSearchParams.delete("origin")

      if (destination) newSearchParams.set("destination", destination.toString())
      else newSearchParams.delete("destination")

      const newSearchStr = newSearchParams.toString().trim();
      const newParamsStr = stringifyStops(stops?.map(v => v?.fullText));

      if (currSearchStr === newSearchStr) return;

      window.history.replaceState(
        null,
        "",
        `${
          [
            [pages.routes.new, newParamsStr].filter(v => v).join("/"),
            newSearchStr,
          ].filter(v => v).join("?")
        }`
      );
    },
    [currSearchStr, stopTime, origin, destination, stops]
  );
}

function stringifyStops(stops: (string | undefined)[] | unknown) {
  const _stops = Array.isArray(stops) ? stops : [];
  return _stops
    .filter(v => !!v)
    .map(v => encodeURIComponent(v))
    .join("/");
}