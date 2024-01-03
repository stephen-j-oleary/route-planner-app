import { get, pick } from "lodash";
import { useEffect, useRef, useState } from "react";

import { Backdrop, Box, Paper, Typography, useTheme } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

import GoogleMap from "@/components/Google/Map";
import Marker from "@/components/Google/Markup/Marker";
import Polyline from "@/components/Google/Markup/Polyline";
import RouteResults from "@/components/Routes/Results";
import DefaultLayout from "@/components/ui/Layouts/Default";
import LoadingDots from "@/components/ui/LoadingDots";
import ScrollResize from "@/components/ui/ScrollResize";
import useRouterQuery from "@/hooks/useRouterQuery";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetRouteById } from "@/reactQuery/useRoutes";
import connectGoogleMapsApi from "@/utils/connectGoogleMapsApi";


const ShowRoute: NextPageWithLayout = () => {
  const theme = useTheme();
  const scroll = useRef(null);

  useEffect(
    function getWindow() {
      scroll.current = window;
    },
    []
  );

  const query = useRouterQuery();
  const routeId = query.get("routeId");

  const route = useGetRouteById(
    routeId,
    { enabled: query.isReady }
  );

  const [isMapLoading, setIsMapLoading] = useState(true);
  const [markup, setMarkup] = useState([]);

  const handleMapLoad = () => setIsMapLoading(false);

  useEffect(
    function populateMapMarkup() {
      if (!route.data) return;

      const stops = route.data.stopOrder.map((_originalIndex, index) => {
        const legBefore = get(route.data.legs, index - 1);
        const legAfter = get(route.data.legs, index);

        const address = get(legBefore, "end.address.formattedAddress") || get(legAfter, "start.address.formattedAddress");
        const lat = get(legBefore, "end.lat") || get(legAfter, "start.lat");
        const lng = get(legBefore, "end.lng") || get(legAfter, "start.lng");

        return {
          address,
          lat,
          lng,
        };
      });

      const stopMarkers = stops.map((item, i) => ({
        id: (i + 1).toString(),
        label: (i + 1).toString(),
        position: pick(item, "lat", "lng"),
        title: item.address
      }));

      connectGoogleMapsApi().then(google => {
        const path = google.maps.geometry.encoding.decodePath(route.data.polyline)
          .map(v => ({
            lat: v.lat(),
            lng: v.lng()
          }));
        setMarkup([
          ...stopMarkers.map(v => ({ ...v, component: Marker })),
          { id: "polyline-outline", component: Polyline, path, strokeColor: blueGrey[100], strokeWeight: theme.components.Polyline.defaultProps.strokeWeight + 2 },
          { id: "polyline", component: Polyline, path },
        ]);
      });
    },
    [route.data, theme]
  );

  return (
    <>
      <ScrollResize
        scroll={scroll}
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
            markupItems={markup}
            listeners={{
              tilesloaded: handleMapLoad,
            }}
            RootProps={{
              sx: {
                position: "absolute",
                inset: 0,
              },
            }}
            defaultCenter={{
              lat: 51.0478,
              lng: -114.0593,
            }}
            defaultZoom={4}
          />
          <Backdrop
            open={isMapLoading || route.isIdle || route.isLoading}
            unmountOnExit
            sx={{
              color: "common.white",
              position: "absolute",
              inset: 0,
              flexDirection: "column",
            }}
          >
            {
              (isMapLoading || route.isIdle || route.isLoading)
                && <LoadingDots />
            }

            <Typography
              component="p"
              variant="h5"
              color="inherit"
            >
              {
                (isMapLoading || route.isIdle || route.isLoading)
                  ? "Loading..."
                  : "Route not found"
              }
            </Typography>
          </Backdrop>
        </Box>
      </ScrollResize>

      <Paper>
        <RouteResults
          loading={route.isIdle || route.isLoading}
          error={route.isError}
          data={route.isSuccess && route.data}
        />
      </Paper>
    </>
  );
}

ShowRoute.getLayout = props => (
  <DefaultLayout
    title="View Route"
    headingComponent="p"
    {...props}
  />
)

export default ShowRoute