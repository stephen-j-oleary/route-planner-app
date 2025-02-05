"use client";

import { MapProps as GMapProps } from "@vis.gl/react-google-maps";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

import { Backdrop, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
  backgroundColor = "rgb(240 240 255)",
  children,
  ...props
}: MapProps) {
  const theme = useTheme();


  return (
    <GMap
      mapTypeControl={mapTypeControl}
      fullscreenControl={fullscreenControl}
      streetViewControl={streetViewControl}
      gestureHandling={gestureHandling}
      backgroundColor={backgroundColor}
      styles={theme.components?.Map?.defaultProps.styles}
      {...props}
    >
      {children}
    </GMap>
  );
}