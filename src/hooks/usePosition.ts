
import { useCallback, useEffect, useState } from "react";
import { useBetween } from "use-between";

import geolocationClient from "@/utils/navigatorClient";
import navigatorClient from "@/utils/navigatorClient";


export type PositionState = "prompt" | "granted" | "denied";

const usePositionStatus = () => {
  const [permissionStatus, setPermissionStatus] = useState<PositionState>("prompt");

  useEffect(
    () => {
      navigatorClient?.permissions.query({ name: "geolocation" })
        .then(res => {
          setPermissionStatus(res.state);
          res.onchange = () => setPermissionStatus(res.state);
        });
    },
    []
  )

  return permissionStatus;
}

export default function usePosition() {
  const permissionStatus = useBetween(usePositionStatus);

  const requestLocation = useCallback(
    () => new Promise<{ lat: number, lng: number }>((resolve, reject) => {
      if (permissionStatus === "denied") return reject("Geolocation permission denied");
      if (!geolocationClient?.geolocation) return reject("Geolocation could not be accessed");

      geolocationClient.geolocation.getCurrentPosition(
        ({ coords }) => resolve({
          lat: coords.latitude,
          lng: coords.longitude
        }),
        error => reject(`Geolocation error: ${error.message}`),
        {
          enableHighAccuracy: true,
          timeout: 10_000,
        }
      );
    }),
    [permissionStatus]
  )

  return {
    permissionStatus,
    requestLocation
  }
}
