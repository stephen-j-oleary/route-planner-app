
import { useCallback, useEffect, useState } from "react";
import { useBetween } from "use-between";

const usePositionStatus = () => {
  const [permissionStatus, setPermissionStatus] = useState("prompt");

  useEffect(
    () => {
      window.navigator.permissions.query({ name: "geolocation" })
        .then(res => {
          setPermissionStatus(res.state);
          res.addEventListener("change", () => {
            setPermissionStatus(res.state);
          });
        });
    },
    []
  )

  return { permissionStatus };
}

export default function usePosition() {
  const { permissionStatus } = useBetween(usePositionStatus);

  const getGeolocator = () => window.navigator?.geolocation;

  const watchLocation = useCallback(
    (successCallback, errorCallback) => {
      if (permissionStatus === "denied") errorCallback("Geolocation permission denied");

      const geo = getGeolocator();
      if (!geo) errorCallback("Geolocation could not be accessed");
      const watcherId = geo.watchPosition(
        ({ coords }) => {
          successCallback({
            lat: coords.latitude,
            lng: coords.longitude
          });
        },
        (error) => {
          errorCallback(`Geolocation error: ${error.message}`);
        },
        { enableHighAccuracy: true }
      );
      return () => geo.clearWatch(watcherId);
    },
    [permissionStatus]
  )

  const requestLocation = useCallback(
    () => {
      return new Promise((resolve, reject) => {
        if (permissionStatus === "denied") reject("Geolocation permission denied");

        const geo = getGeolocator();
        if (!geo) reject("Geolocation could not be accessed");
        geo.getCurrentPosition(
          ({ coords }) => {
            resolve({
              lat: coords.latitude,
              lng: coords.longitude
            });
          },
          (error) => {
            reject(`Geolocation error: ${error.message}`);
          },
          { enableHighAccuracy: true }
        );
      })
    },
    [permissionStatus]
  )

  return {
    permissionStatus,
    watchLocation,
    requestLocation
  }
}
