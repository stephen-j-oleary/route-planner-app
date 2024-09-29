"use client";

import { Map as GMap, MapProps as GMapProps } from "@vis.gl/react-google-maps";
import React from "react";

import { Backdrop, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useMap } from "./hooks";
import LoadingDots from "@/components/ui/LoadingDots";


export type MapProps =
  & GMapProps
  & { children?: React.ReactNode };

export default function Map({
  mapTypeControl = false,
  fullscreenControl = false,
  streetViewControl = false,
  gestureHandling = "cooperative",
  backgroundColor = "rgb(240 240 255)",
  children,
  ...props
}: MapProps) {
  const theme = useTheme();
  const map = useMap();

  const { loaded = false, tilesLoaded } = map?.tiles || {};


  return (
    <>
      <GMap
        onTilesLoaded={() => tilesLoaded?.()}
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

      <Backdrop
        open={!loaded}
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
    </>
  );
}