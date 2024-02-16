import React from "react";

import geolocationClient from "@/utils/navigatorClient";
import navigatorClient from "@/utils/navigatorClient";


export type PositionState = "prompt" | "granted" | "denied" | "loading";

export default function usePosition() {
  const [status, setStatus] = React.useState<PositionState>("loading");

  React.useEffect(
    () => {
      navigatorClient?.permissions.query({ name: "geolocation" })
        .then(res => {
          setStatus(res.state);
          res.onchange = () => setStatus(res.state);
        });
    },
    []
  );

  const request = React.useCallback(
    () => new Promise<{ lat: number, lng: number }>((resolve, reject) => {
      if (status === "denied") return reject("Geolocation permission denied");
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
    [status]
  );

  return {
    status,
    request,
  };
}