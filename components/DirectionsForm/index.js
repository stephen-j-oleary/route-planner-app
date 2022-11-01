
import styles from "./styles.module.css";
import _ from "lodash";
import classNames from "classnames";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { actions as mapActions, MAP_MODES } from "../../redux/slices/map.js";
import { actions as routeFormActions, selectIsState } from "../../redux/slices/routeForm.js";
import { fromStopString, toStopString } from "../../shared/Stop";

import { FaExclamationCircle } from "react-icons/fa";
import StopsInput from "../StopsInput";
import RouteOptions from "../RouteOptions";
import StopOptions from "../StopOptions/index.js";
import Button from "../Button";
import Alert from "react-bootstrap/Alert";
import useStops from "../../shared/hooks/useStops.js";
import { PlaceholderButton } from "react-bootstrap";
import LoadingBar from "../LoadingBar/index.js";

const MINIMUM_STOPS = 3;
const DEFAULT_STOPS = Array(MINIMUM_STOPS).fill(fromStopString(""));

export default function DirectionsForm(props) {
  const dispatch = useDispatch();
  const isResults = useSelector(state => selectIsState(state, "results"));
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const [submitBtnValue, setSubmitBtnValue] = useState("");
  const [error, setError] = useState(null);
  const isInitialized = useRef(false);

  // Read stops from route params
  const [stops, , isReady] = useStops();

  const formHook = useForm({
    mode: "onTouched",
    shouldFocusError: false,
    defaultValues: {
      stops: DEFAULT_STOPS,
      options: {
        stopLength: 0
      }
    }
  });

  useEffect(() => {
    setSubmitBtnValue(
      isResults
        ? "Continue Editing"
        : "Calculate Route"
    );
  }, [isResults]);

  // Set form values from query params
  useEffect(() => {
    // Avoid resetting values on rerenders
    if (!isReady || isInitialized.current) return;
    isInitialized.current = true;

    // Set form data
    const queryStops = _.dropRightWhile(
      [...stops, ...DEFAULT_STOPS],
      (_, i) => (i >= Math.max(stops.length, MINIMUM_STOPS))
    );
    formHook.reset({ stops: queryStops });
    dispatch(routeFormActions.setState("edit"));
  }, [isReady, stops, formHook, dispatch]);


  const onSubmit = async formData => {
    setError(null);
    const stops = formData.stops
      .map(toStopString)
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

      const resultStops = route.stopOrder.map((stopIndex, i) => {
        const legBefore = _.get(route.legs, i - 1);
        const legAfter = _.get(route.legs, i);
        const reqStop = formHook.getValues(`stops.${stopIndex}`);
        const resStop = _.chain(legBefore?.end || legAfter?.start)
          .cloneDeep()
          .update("address", val => val.formattedAddress)
          .setWith("coordinates.any", "any", (v, k, o) => [o.lat, o.lng].join(","))
          .set("modifiers", reqStop.modifiers)
          .set("id", reqStop.id)
          .set("index", i)
          .pick("address", "coordinates", "modifiers", "index")
          .value();

        return resStop;
      });
      /* const resultLegs = ; */

      formHook.reset({
        stops: resultStops
      });

      const mapOptions = {
        mode: MAP_MODES.directions,
        origin: routes[0].legs[0].start.formattedAddress,
        destination: routes[0].legs.at(-1).end.formattedAddress,
        waypoints: routes[0].legs.slice(1, -1).map(l => l.start.formattedAddress)
      };

      dispatch(mapActions.setEmbed(mapOptions));
      dispatch(routeFormActions.setState("results"));
    }
    catch (err) {
      setError(err);
    }
  };

  const handleCalculateClick = () => {
    dispatch(routeFormActions.setSelectedStop(-1));
    if (isResults) {

      dispatch(routeFormActions.setState("edit"));
    }
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
        <StopsInput className={styles.stops} />

        <RouteOptions className={styles.options} />

        <StopOptions className={styles.stopOptions} />

        <div className={styles.actions}>
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
                  className={styles.submitButton}
                  onClick={handleCalculateClick}
                  type="submit"
                  disabled={formHook.formState.isSubmitting}
                  tooltip={formHook.formState.isSubmitting ? {
                    placement: "top",
                    value: "Calculating..."
                  } : false}
                >
                  {submitBtnValue}
                </Button>
              )
          }
        </div>
      </form>
    </FormProvider>
  )
}
