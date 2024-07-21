"use client";

import { Marker } from "@vis.gl/react-google-maps";
import React from "react";

import { useTheme } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

import { Polyline } from "@/components/ui/Map/Polyline";
import { IRoute } from "@/models/Route";
import { decodePolyline } from "@/utils/Radar/utils";



export type RouteResultsMarkupProps = {
  route: IRoute | undefined | null,
};

export default function RouteResultsMarkup({
  route,
}: RouteResultsMarkupProps) {
  const theme = useTheme();

  return (
    <>
      {
        route?.stops
          .map((stop, i) => stop.coordinates && (
            <Marker
              key={i}
              label={(i + 1).toString()}
              position={{ lat: stop.coordinates[0], lng: stop.coordinates[1] }}
            />
          ))
      }

      {
        route?.legs
          .map((leg, i) => leg.polyline && (
            <React.Fragment key={i}>
              <Polyline
                path={decodePolyline(leg.polyline)}
                strokeColor={blueGrey[100]}
                strokeWeight={6}
              />

              <Polyline
                path={decodePolyline(leg.polyline)}
                strokeColor={theme.palette.primary.main}
                strokeWeight={4}
              />
            </React.Fragment>
          ))
      }
    </>
  );
}