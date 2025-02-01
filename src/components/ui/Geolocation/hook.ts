"use client";

import { useContext, useEffect } from "react";

import { GeolocationContext } from "./Provider";


export default function useGeolocation({
  autoPrompt = false,
}: {
  autoPrompt?: boolean,
} = {}) {
  const geolocation = useContext(GeolocationContext);

  useEffect(
    () => {
      if (!autoPrompt || !geolocation.prompt) return

      const dismiss = geolocation.prompt();

      return () => dismiss?.();
    },
    [autoPrompt, geolocation]
  );

  return geolocation;
}