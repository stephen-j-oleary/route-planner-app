import polyline from "@mapbox/polyline";
import { Marker } from "@vis.gl/react-google-maps";
import React from "react";

import { blueGrey } from "@mui/material/colors";

import Map from "@/components/ui/Map";
import { Polyline } from "@/components/ui/Map/Polyline";
import { IRoute } from "@/models/Route";

// Radar polylines seem to need to be divided by 10 to display correctly
const decodePolyline = (poly: string): { lat: number, lng: number }[] => polyline.decode(poly).map(([lat, lng]) => ({ lat: lat / 10, lng: lng / 10 }));


export type RouteResultsMapProps = {
  route: IRoute | undefined | null,
};

export default function RouteResultsMap({
  route,
}: RouteResultsMapProps) {
  return (
    <Map
      defaultCenter={{ lat: 51.0447, lng: -114.0719 }}
      defaultZoom={10}
    >
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
              />

              <Polyline
                path={decodePolyline(leg.polyline)}
                strokeColor={blueGrey[100]}
                strokeWeight={6}
              />
            </React.Fragment>
          ))
      }
    </Map>
  );
}