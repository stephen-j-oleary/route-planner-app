"use client";

import { createContext, ReactNode, useActionState, useTransition } from "react";
import { toast } from "react-toastify";

import { CloseRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, IconButton } from "@mui/material";

import usePermissions from "@/hooks/usePermissions";


export type TGeolocationResult = {
  error?: string,
  lat?: number,
  lng?: number,
};

export type TGeolocation = {
  permission?: PermissionState,
  get?: () => Promise<TGeolocationResult>,
  isPending?: boolean,
  result?: TGeolocationResult,
  prompt?: () => (() => void) | undefined,
};

export const GeolocationContext = createContext<TGeolocation>({});

export default function GeolocationProvider({
  children,
}: {
  children: ReactNode,
}) {
  const permission = usePermissions("geolocation");

  const get = async () => {
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
  };


  const [isPending, startTransition] = useTransition();
  const [result, action] = useActionState(get, undefined);
  const prompt = () => {
    if (permission !== "prompt") return;
    if (result?.lat) return;

    const id = toast(
      ({ closeToast }) => (
        <Alert
          severity={result?.error ? "error" : "info"}
          action={
            <>
              <LoadingButton
                loading={isPending}
                onClick={() => startTransition(() => action())}
              >
                {result?.error ? "Retry" : "Allow"}
              </LoadingButton>

              <IconButton
                onClick={() => closeToast()}
                aria-label="Close alert"
              >
                <CloseRounded />
              </IconButton>
            </>
          }
        >
          {result?.error ?? "Allow location access to get more accurate address and place suggestions"}
        </Alert>
      ),
      { toastId: "geolocation" },
    );

    return () => toast.dismiss(id);
  };

  return (
    <GeolocationContext.Provider value={{
      permission,
      get,
      isPending,
      result,
      prompt,
    }}>
      {children}
    </GeolocationContext.Provider>
  );
}