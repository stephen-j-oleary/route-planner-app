"use client";

import { Map as GMap, MapProps as GMapProps } from "@vis.gl/react-google-maps";
import React from "react";

import { Backdrop, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import LoadingDots from "@/components/ui/LoadingDots";


export type MapProps =
  & GMapProps
  & {
    /** Default: 'focus' */
    boundStyle?: "extend" | "focus",
    children?: React.ReactNode,
  };

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

  const [isLoading, setIsLoading] = React.useState(true);


  return (
    <>
      <GMap
        onTilesLoaded={() => setIsLoading(false)}
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
        open={isLoading}
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