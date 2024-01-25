import polyline from "@mapbox/polyline";
import React from "react";
import { UseQueryResult } from "react-query";

import { Backdrop, Box, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

import GoogleMap from "@/components/Google/Map";
import GoogleMarkup from "@/components/Google/Markup";
import LoadingDots from "@/components/ui/LoadingDots";
import ScrollResize from "@/components/ui/ScrollResize";
import { IRoute } from "@/models/Route";

// Radar polylines seem to need to be divided by 10 to display correctly
const decodePolyline = (poly: string): [number, number][] => polyline.decode(poly).map(([lat, lng]) => [lat / 10, lng / 10]);


export type RouteResultsMapProps = {
  routeQuery: UseQueryResult<IRoute | undefined | null>,
};

export default function RouteResultsMap({
  routeQuery,
}: RouteResultsMapProps) {
  const [isMapLoading, setIsMapLoading] = React.useState(true);
  const handleMapLoad = () => setIsMapLoading(false);

  return (
    <ScrollResize
      min="50dvh"
      max="80dvh"
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
            routeQuery.data?.stops
              .map((stop, i) => stop.coordinates && (
                <GoogleMarkup
                  key={i}
                  variant="marker"
                  label={(i + 1).toString()}
                  position={stop.coordinates}
                />
              ))
          }

          {
            routeQuery.data?.legs
              .map((leg, i) => leg.polyline && (
                <React.Fragment key={i}>
                  <GoogleMarkup
                    variant="polyline"
                    path={decodePolyline(leg.polyline)}
                  />

                  <GoogleMarkup
                    variant="polyline"
                    path={decodePolyline(leg.polyline)}
                    strokeColor={blueGrey[100]}
                    strokeWeight={6}
                  />
                </React.Fragment>
              ))
          }
        </GoogleMap>
        <Backdrop
          open={isMapLoading || routeQuery.isIdle || routeQuery.isLoading || routeQuery.isError}
          unmountOnExit
          sx={{
            color: "common.white",
            position: "absolute",
            inset: 0,
            flexDirection: "column",
          }}
        >
          {
            ((isMapLoading && !routeQuery.isError) || routeQuery.isIdle || routeQuery.isLoading)
              && <LoadingDots />
          }

          <Typography
            component="p"
            variant="h5"
            color="inherit"
          >
            {
              ((isMapLoading && !routeQuery.isError) || routeQuery.isIdle || routeQuery.isLoading)
                ? "Loading..."
                : "Route not found"
            }
          </Typography>
        </Backdrop>
      </Box>
    </ScrollResize>
  );
}