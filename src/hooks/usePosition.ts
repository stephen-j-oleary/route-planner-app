import "client-only";

import React from "react";


export type GeolocationState = "prompt" | "granted" | "denied" | "loading";
export type GeolocationPosition = {
  lat: number,
  lng: number,
};

export default function useGeolocation() {
  const [state, setState] = React.useState<GeolocationState>("loading");
  const [position, setPosition] = React.useState<GeolocationPosition | null>(null);

  React.useEffect(
    () => {
      window.navigator.permissions.query({ name: "geolocation" })
        .then(res => {
          setState(res.state);
          res.onchange = () => setState(res.state);
        });
    },
    []
  );

  const request = React.useCallback(
    () => new Promise<{ lat: number, lng: number }>((resolve, reject) => {
      if (state === "denied") return reject("Geolocation permission denied");
      if (!window.navigator.geolocation) return reject("Geolocation could not be accessed");

      window.navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const value = {
            lat: coords.latitude,
            lng: coords.longitude,
          };

          setPosition(value);
          resolve(value);
        },
        error => reject(`Geolocation error: ${error.message}`),
        {
          enableHighAccuracy: true,
          timeout: 10_000,
        }
      );
    }),
    [state]
  );

  return {
    state,
    position,
    request,
  };
}