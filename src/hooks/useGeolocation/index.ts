import "client-only";

import { useActionState, useTransition } from "react";

import useGeolocationPermission from "./permission";


export type GeolocationState =
  | "idle"
  | "pending"
  | "success"
  | "error";

export default function useGeolocation() {
  const permission = useGeolocationPermission();

  const [isPending, startTransition] = useTransition();
  const [result, startGeolocation] = useActionState(
    async () => {
      try {
        if (permission === "denied") return { error: "Permission denied" };
        if (!window.navigator.geolocation) return { error: "Geolocation not available" };

        const pos = await new Promise<GeolocationPosition>((resolve, reject) => window.navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10_000,
          },
        ));

        return {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      }
      catch (err) {
        return {
          error: (err && typeof err === "object" && "message" in err && typeof err.message === "string") ? err.message : "Unable to find location",
        };
      }
    },
    null,
  );

  const request = () => startTransition(() => startGeolocation());

  return {
    permission,
    isPending,
    result,
    request,
  };
}