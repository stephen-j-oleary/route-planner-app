"use client";

import { MapProps as GMapProps } from "@vis.gl/react-google-maps";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

import { Backdrop, Typography } from "@mui/material";

import LoadingDots from "@/components/ui/LoadingDots";

const GMap = dynamic(
  () => import("@vis.gl/react-google-maps").then(mod => mod.Map),
  {
    ssr: false,
    loading: () => (
      <Backdrop
        open
        unmountOnExit
        sx={{
          color: "common.white",
          position: "absolute",
          inset: 0,
          flexDirection: "column",
        }}
      >
        <LoadingDots />

        <Typography
          component="p"
          variant="h4"
          color="inherit"
        >
          Loading...
        </Typography>
      </Backdrop>
    ),
  }
);


export type MapProps =
  & GMapProps
  & { children?: ReactNode };

export default function Map({
  mapTypeControl = false,
  fullscreenControl = false,
  streetViewControl = false,
  gestureHandling = "greedy",
  children,
  ...props
}: MapProps) {
  return (
    <GMap
      mapTypeControl={mapTypeControl}
      fullscreenControl={fullscreenControl}
      streetViewControl={streetViewControl}
      gestureHandling={gestureHandling}
      {...props}
    >
      {children}
    </GMap>
  );
}