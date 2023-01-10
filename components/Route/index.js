
import styles from "./styles.module.css";
import classNames from "classnames";
import _ from "lodash";
import axios from "axios";
import resolve from "../../shared/resolve.js";
import googleLoader from "../../shared/googleMapApiLoader.js";
import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useStops from "../../shared/hooks/useStops.js";
import { setState, selectIsState, setSelectedStop, setResults, setValues, setViewMode } from "../../redux/slices/routeForm.js";
import { fromStopString, toStopString } from "../../shared/Stop";
import { useRouter } from "next/router.js";
import { setMarkup } from "../../redux/slices/map.js";

import { FaExclamationCircle } from "react-icons/fa";
import Alert from "react-bootstrap/Alert";
import PlaceholderButton from "react-bootstrap/PlaceholderButton";
import StopsAndLegs from "./StopsAndLegs";
import Options from "./Options";
import StopOptions from "./StopOptions";
import Button, { RadioButton } from "../Button";
import LoadingBar from "../LoadingBar";

const MINIMUM_STOPS = 3;
const DEFAULT_STOPS = Array(MINIMUM_STOPS).fill(fromStopString(""));

export default function Route(props) {
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
      destination: 0
    }
  });

  // Set form values from query params
  useEffect(
    () => {
      if (isInitialized.current || !isStopsReady || !isQueryReady) return;
      isInitialized.current = true;

      const { origin, destination } = router.query;

      const values = formHook.getValues();
      values.stops = _.dropRightWhile(
        [...stops, ...DEFAULT_STOPS],
        (_, i) => (i >= Math.max(stops.length, MINIMUM_STOPS))
      );
      if (origin) values.origin = +origin;
      if (destination) values.destination = +destination;

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
          .value();
      });
      results.duration = route.legs.reduce((total, leg) => (total + leg.duration.value), 0);
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

  const handleViewMode = newMode => {
    dispatch(setViewMode(newMode));
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
      <form
        {...props}
        className={classNames(
          props.className,
          styles.form
        )}
        onSubmit={formHook.handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.inputArea}>
          <div className={styles.viewMode}>
            <RadioButton
              options={[
                {
                  label: "Map",
                  value: "map"
                },
                {
                  label: "List",
                  value: "list"
                }
              ]}
              onChange={handleViewMode}
              variant="primary"
            />
          </div>

          <StopsAndLegs className={styles.stopsAndLegs} />

          <Options className={styles.options} />

          <StopOptions className={styles.stopOptions} />
        </div>

        <div className={styles.submitArea}>
          <Alert className={styles.error} show={!!error} variant="danger">
            <FaExclamationCircle />
            {error?.message}
          </Alert>
          {
            formHook.formState.isSubmitting
              && <LoadingBar type="flow">Calculating...</LoadingBar>
          }
          {
            isLoading
              ? <PlaceholderButton xs={12} size="lg" />
              : (
                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  disabled={formHook.formState.isSubmitting}
                  tooltip={formHook.formState.isSubmitting ? {
                    placement: "top",
                    value: "Calculating..."
                  } : false}
                  onClick={isResults ? handleContinueEditing : _.noop}
                >
                  {isResults ? "Continue Editing" : "Calculate Route"}
                </Button>
              )
          }
        </div>
      </form>
    </FormProvider>
  )
}
