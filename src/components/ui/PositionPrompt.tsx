import { useEffect, useId } from "react";
import { toast } from "react-toastify";

import { CloseRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, IconButton } from "@mui/material";

import useGeolocation from "@/hooks/useGeolocation";


const renderToast = ({
  result,
  isPending = false,
  request,
  closeToast,
}: {
  result?: { error?: string, lat?: number, lng?: number } | null,
  isPending?: boolean,
  request?: () => void,
  closeToast: () => void,
}) => (
  <Alert
    severity={result?.error ? "error" : "info"}
    action={
      <>
        <LoadingButton
          loading={isPending}
          onClick={() => request?.()}
        >
          {result?.error ? "Retry" : "Allow"}
        </LoadingButton>

        <IconButton onClick={() => closeToast()}>
          <CloseRounded />
        </IconButton>
      </>
    }
  >
    {result?.error ?? "Allow location access to get more accurate address and place suggestions"}
  </Alert>
);

export default function PositionPrompt() {
  const id = useId();
  const geolocation = useGeolocation();


  useEffect(
    () => {
      if (geolocation.permission !== "prompt") return;

      toast(
        ({ closeToast }) => renderToast({ closeToast }),
        { toastId: id }
      );

      return () => toast.dismiss(id);
    },
    [id, geolocation.permission]
  );

  useEffect(
    () => {
      toast.update(
        id,
        { render: ({ closeToast }) => renderToast({ ...geolocation, closeToast }) },
      );
    },
    [id, geolocation]
  )

  return null;
}