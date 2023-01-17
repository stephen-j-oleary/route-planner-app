
import styles from "./styles.module.css";
import _ from "lodash";
import axios from "axios";
import resolve from "../../shared/resolve.js";
import googleLoader from "../../shared/googleMapApiLoader.js";
import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useStops from "../../shared/hooks/useStops.js";
import { setState, selectIsState, setSelectedStop, setResults, setValues } from "../../redux/slices/routeForm.js";
import { fromStopString, toStopString } from "../../shared/Stop";
import { useRouter } from "next/router.js";
import { setMarkup } from "../../redux/slices/map.js";

import { FaRoute } from "react-icons/fa";
import StopsAndLegs from "./StopsAndLegs";
import Options from "./Options";
import StopOptions from "./StopOptions";
import { Box, Stack, Alert, useMediaQuery, Skeleton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTheme } from "@mui/material/styles";

const MINIMUM_STOPS = 3;
const DEFAULT_STOPS = Array(MINIMUM_STOPS).fill(fromStopString(""));

export default function Route(props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const dispatch = useDispatch();
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const isResults = useSelector(state => selectIsState(state, "results"));
  const [error, setError] = useState(null);
  const isInitialized = useRef(false);

  // Read stops from route params
  const [stops, , isStopsReady] = useStops();
  const router = useRouter();
  const isQueryReady = router.isReady;

  const formHook = useForm({
    mode: "onTouched",
    shouldFocusError: false,
    defaultValues: {
      stops: DEFAULT_STOPS,
      origin: 0,
      destination: 0,
      stopTime: 0
    }
  });

  // Set form values from query params
  useEffect(
    () => {
      if (isInitialized.current || !isStopsReady || !isQueryReady) return;
      isInitialized.current = true;

      const { origin, destination, stopTime } = router.query;

      const values = formHook.getValues();
      values.stops = _.dropRightWhile(
        [...stops, ...DEFAULT_STOPS],
        (_, i) => (i >= Math.max(stops.length, MINIMUM_STOPS))
      );
      if (origin) values.origin = +origin;
      if (destination) values.destination = +destination;
      if (stopTime) values.stopTime = +stopTime * 60;

      formHook.reset(values);
      dispatch(setState("edit"));
    },
    [isInitialized, isStopsReady, stops, isQueryReady, router.query, formHook, dispatch]
  );


  const onSubmit = async formData => {
    dispatch(setSelectedStop(-1));
    setError(null);
    const stops = formData.stops
      .map(toStopString)
      .map((item, i) => {
        if (i === +formData.origin) item = `type:origin;${item}`;
        if (i === +formData.destination) item = `type:destination;${item}`;
        return item;
      })
      .join("|");

    const config = {
      method: "get",
      url: "/api/directions",
      params: { stops }
    };

    try {
      const res = await axios.request(config);

      const { routes } = res.data;
      if (routes.length === 0) throw new Error("No Routes Found");

      const route = routes[0];

      const results = _.cloneDeep(route);
      results.stops = route.stopOrder.map((originalIndex, index) => {
        const legBefore = _.get(route.legs, index - 1);
        const legAfter = _.get(route.legs, index);
        const originalStop = formHook.getValues(`stops.${originalIndex}`);

        const id = legBefore ? `${legBefore.end.lat},${legBefore.end.lng}` : `${legAfter.start.lat},${legAfter.start.lng}`;
        const address = _.get(legBefore, "end.address.formattedAddress") || _.get(legAfter, "start.address.formattedAddress");
        const lat = _.get(legBefore, "end.lat") || _.get(legAfter, "start.lat");
        const lng = _.get(legBefore, "end.lng") || _.get(legAfter, "start.lng");
        const coordinates = [lat, lng].join(",");

        return _.chain(originalStop)
          .cloneDeep()
          .set("id", id)
          .set("address", address)
          .set("lat", lat)
          .set("lng", lng)
          .set("coordinates", coordinates)
          .set("stopTime", (legBefore && legAfter) ? ((+formData.stopTime || 0) * 60) : 0)
          .value();
      });
      results.travelDuration = route.legs.reduce((total, leg) => (total + leg.duration.value), 0);
      results.stopDuration = results.stops.reduce((total, stop) => (total + stop.stopTime), 0);
      results.duration = results.travelDuration + results.stopDuration;
      results.distance = route.legs.reduce((total, leg) => (total + leg.distance.value), 0);
      results.decodedPolyline = await googleLoader.load().then(g => g.maps.geometry.encoding.decodePath(route.polyline)
        .map(v => ({
          lat: resolve(v.lat),
          lng: resolve(v.lng)
        })));
      results.stopMarkers = results.stops.map((item, i) => ({
        id: (i + 1).toString(),
        label: (i + 1).toString(),
        position: _.pick(item, "lat", "lng"),
        title: item.address
      }));

      dispatch(setValues(formData));
      dispatch(setResults(results));
      dispatch(setState("results"));
      dispatch(setMarkup([
        ...results.stopMarkers.map(v => ({ ...v, type: "marker" })),
        { type: "polyline", path: results.decodedPolyline }
      ]));
    }
    catch (err) {
      setError(err);
    }
  };

  const handleContinueEditing = e => {
    e.preventDefault();
    dispatch(setState("edit"));
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <FormProvider {...formHook}>
      <Stack
        component="form"
        direction="column"
        flex={1}
        boxShadow={theme.shadows[2]}
        borderRight={isDesktop ? `1px solid ${theme.palette.divider}` : "none"}
        borderTop={!isDesktop ? `1px solid ${theme.palette.divider}` : "none"}
        background={theme.palette.background.paper}
        onSubmit={formHook.handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <Box
          flex="1 0 0"
          overflow="hidden scroll"
        >
          <StopsAndLegs
            borderBottom={`1px solid ${theme.palette.divider}`}
            boxShadow={theme.shadows[2]}
          />

          <Options
            borderBottom={`8px solid ${theme.palette.divider}`}
          />

          <StopOptions className={styles.stopOptions} />
        </Box>

        <Stack
          spacing={2}
          padding={2}
          boxShadow={theme.shadows[4]}
          borderTop={`1px solid ${theme.palette.divider}`}
        >
          {
            !!error && (
              <Alert severity="error">
                {error?.message}
              </Alert>
            )
          }

          {
            isLoading ? (
              <Skeleton
                variant="rounded"
                sx={{ maxWidth: "none" }}
              >
                <LoadingButton
                  fullWidth
                  size="medium"
                  variant="contained"
                  children="Calculate Route"
                />
              </Skeleton>
            ) : (
              <LoadingButton
                fullWidth
                type="submit"
                size="medium"
                variant="contained"
                startIcon={<FaRoute />}
                onClick={isResults ? handleContinueEditing : _.noop}
                loading={formHook.formState.isSubmitting}
                loadingPosition="start"
              >
                {isResults ? "Edit Stops" : "Calculate Route"}
              </LoadingButton>
            )
          }
        </Stack>
      </Stack> {/* form */}
    </FormProvider>
  )
}
