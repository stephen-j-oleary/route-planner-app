import NextLink from "next/link";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { CloseRounded } from "@mui/icons-material";
import { Alert, Button, IconButton } from "@mui/material";

import useGeolocation from "@/hooks/useGeolocation";
import pages from "pages";


export default function PositionPrompt() {
  const geolocation = useGeolocation();

  useEffect(
    () => {
      if (["loading", "granted"].includes(geolocation.state)) return;

      const id = toast(
        ({ closeToast }) => (
          <Alert
            severity="info"
            action={
              <>
                {
                  geolocation.state === "prompt"
                    ? <Button onClick={() => geolocation.request()}>Allow</Button>
                    : <Button component={NextLink} href={pages.enableLocation} target="_blank">Allow</Button>
                }

                <IconButton onClick={() => closeToast()}>
                  <CloseRounded />
                </IconButton>
              </>
            }
          >
            Allow location access to get more accurate address and place suggestions
          </Alert>
        ),
      );

      return () => toast.dismiss(id);
    },
    [geolocation]
  );

  return null;
}