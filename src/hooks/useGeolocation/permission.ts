import "client-only";

import { useEffect, useState } from "react";


export type GeolocationPermissionState =
  | "prompt"
  | "granted"
  | "denied";


export default function useGeolocationPermission() {
  const [permission, setPermission] = useState<PermissionState | null>(null);

  useEffect(
    () => {
      window.navigator.permissions.query({ name: "geolocation" })
        .then(res => {
          setPermission(res.state);
          res.onchange = () => setPermission(res.state);
        });
    },
    []
  );

  return permission;
}