
import { dropRightWhile, isNil, isEmpty, cloneDeep, get, pick, noop } from "lodash";
import axios from "axios";
import googleLoader from "../../shared/googleMapApiLoader.js";
import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useStopParams from "../../shared/hooks/useStopParams.js";
import { setState, selectIsState, setSelectedStop, setResults, setValues } from "../../redux/slices/routeForm.js";
import Stop from "../../shared/Stop";
import { useRouter } from "next/router.js";
import { setMarkup } from "../../redux/slices/map.js";

import RouteIcon from "@mui/icons-material/RouteRounded";
import StopsAndLegs from "./StopsAndLegs";
import Options from "./Options";
import StopOptions from "./StopOptions";
import { Box, Stack, Alert, useMediaQuery, Skeleton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTheme } from "@mui/material/styles";

const DEFAULT_STOPS = Array(Stop.MINIMUM_STOPS).fill(Stop.create({ value: "" }));

export default function Route(props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const isResults = useSelector(state => selectIsState(state, "results"));
  const isInitialized = useRef(false);

  const formHook = useForm({
    mode: "onSubmit",
    shouldFocusError: false,
    defaultValues: {
      stops: DEFAULT_STOPS,
      origin: 0,
      destination: 0,
      stopTime: 0
    }
  });

  const [paramStops, , isParamsReady] = useStopParams();

  // Set form values from query params
  useEffect(
    () => {
      if (isInitialized.current || !isParamsReady || !router.isReady) return;
      isInitialized.current = true;

      const { origin, destination, stopTime } = router.query;

      const values = formHook.getValues();
      // Drop any default stops above the minimum stop count
      values.stops = dropRightWhile(
        [...paramStops, ...DEFAULT_STOPS],
        (_, i) => (i >= Math.max(paramStops.length, Stop.MINIMUM_STOPS))
      );
      if (!isNil(origin)) values.origin = +origin;
      if (!isNil(destination)) values.destination = +destination;
      if (!isNil(stopTime)) values.stopTime = +stopTime;

      formHook.reset(values);
      dispatch(setState("edit"));
    },
    [isInitialized, isParamsReady, router.isReady, paramStops, router.query, formHook, dispatch]
  );


  const onSubmit = async formData => {
    dispatch(setSelectedStop(-1));
    formHook.clearErrors("submit");

    try {
      const stopsArr = formData.stops
        .map(Stop.toString)
        .map(encodeURIComponent)
        .map((item, i) => {
          if (i === +formData.origin) item = `type:origin;${item}`;
          if (i === +formData.destination) item = `type:destination;${item}`;
          return item;
        })
        .filter(item => !isEmpty(item));
      if (stopsArr.length < Stop.MINIMUM_STOPS) throw new Error("Please enter at least 3 addresses");

      const { data: { routes } } = await axios.request({
        method: "get",
        url: "/api/directions",
        params: { stops: stopsArr.join("|") }
      });
      if (routes.length === 0) throw new Error("No Routes Found");

      const route = routes[0];

      const results = cloneDeep(route);
      results.stops = route.stopOrder.map((originalIndex, index) => {
        const legBefore = get(route.legs, index - 1);
        const legAfter = get(route.legs, index);
        const originalStop = formHook.getValues(`stops.${originalIndex}`);

        const id = legBefore ? `${legBefore.end.lat},${legBefore.end.lng}` : `${legAfter.start.lat},${legAfter.start.lng}`;
        const address = get(legBefore, "end.address.formattedAddress") || get(legAfter, "start.address.formattedAddress");
        const lat = get(legBefore, "end.lat") || get(legAfter, "start.lat");
        const lng = get(legBefore, "end.lng") || get(legAfter, "start.lng");
        const coordinates = [lat, lng].join(",");

        const newStop = cloneDeep(originalStop);
        newStop.id = id;
        newStop.address = address;
        newStop.lat = lat;
        newStop.lng = lng;
        newStop.coordinates = coordinates;
        newStop.stopTime = (legBefore && legAfter) ? ((+formData.stopTime || 0) * 60) : 0;
        return newStop;
      });
      results.travelDuration = route.legs.reduce((total, leg) => (total + leg.duration.value), 0);
      results.stopDuration = results.stops.reduce((total, stop) => (total + stop.stopTime), 0);
      results.duration = results.travelDuration + results.stopDuration;
      results.distance = route.legs.reduce((total, leg) => (total + leg.distance.value), 0);
      results.decodedPolyline = await googleLoader.load().then(g => g.maps.geometry.encoding.decodePath(route.polyline)
        .map(v => ({
          lat: v.lat(),
          lng: v.lng()
        })));
      results.stopMarkers = results.stops.map((item, i) => ({
        id: (i + 1).toString(),
        label: (i + 1).toString(),
        position: pick(item, "lat", "lng"),
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
      formHook.setError("submit", { type: "required", message: err.message });
    }
  };

  // Clear submit error when any input value changes
  useEffect(
    () => {
      const subscription = formHook.watch(() => {
        formHook.clearErrors("submit");
      });
      return subscription.unsubscribe;
    },
    [formHook]
  );

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

          <StopOptions
            sx={{ flex: "1 0 0" }}
          />
        </Box>

        <Stack
          spacing={2}
          padding={2}
          boxShadow={theme.shadows[4]}
          borderTop={`1px solid ${theme.palette.divider}`}
        >
          {
            !!formHook.formState.errors.submit && (
              <Alert severity="error">
                {formHook.formState.errors.submit.message}
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
                >
                  Calculate Route
                </LoadingButton>
              </Skeleton>
            ) : (
              <LoadingButton
                fullWidth
                type="submit"
                size="medium"
                variant="contained"
                startIcon={<RouteIcon />}
                onClick={isResults ? handleContinueEditing : noop}
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
