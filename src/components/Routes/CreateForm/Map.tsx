"use client";

import React from "react";

import { Backdrop, Box, Typography } from "@mui/material";

import { CreateRouteFormContext } from "./Context";
import GoogleMap from "@/components/Google/Map";
import GoogleMarkup from "@/components/Google/Markup";
import LoadingDots from "@/components/ui/LoadingDots";
import ScrollResize from "@/components/ui/ScrollResize";


export default function CreateRouteFormMap() {
  const { form } = React.useContext(CreateRouteFormContext);
  const watchStops = form?.watch("stops") || [];

  const [isMapLoading, setIsMapLoading] = React.useState(true);
  const handleMapLoad = () => setIsMapLoading(false);


  return (
    <ScrollResize
      min="25dvh"
      max="50dvh"
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <GoogleMap
          onLoad={handleMapLoad}
          defaultCenter={[51.0447, -114.0719]}
          defaultZoom={10}
          RootProps={{
            sx: {
              position: "absolute",
              inset: 0,
            },
          }}
        >
          {
            watchStops
              .map((stop, i) => stop.coordinates && (
                <GoogleMarkup
                  key={i}
                  variant="marker"
                  label={(i + 1).toString()}
                  position={stop.coordinates}
                />
              ))
          }
        </GoogleMap>
        <Backdrop
          open={isMapLoading}
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
      </Box>
    </ScrollResize>
  )
}