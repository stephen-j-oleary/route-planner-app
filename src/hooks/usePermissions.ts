import "client-only";

import { useEffect, useState } from "react";


export default function usePermissions(name: PermissionName) {
  const [permission, setPermission] = useState<PermissionState | undefined>(undefined);

  useEffect(
    () => {
      window.navigator.permissions.query({ name })
        .then(res => {
          setPermission(res.state);
          res.onchange = () => setPermission(res.state);
        });
    },
    [name]
  );

  return permission;
}