
import styles from "./styles.module.scss";
import classNames from "classnames";
import _ from "lodash";
import moment from "moment";
import { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { selectIsState, selectSelectedStop, setSelectedStop, selectResults } from "../../../redux/slices/routeForm.js";
import { fromStopString } from "../../../shared/Stop.js";

import { Fragment } from "react";
import Button from "../../Button";
import { FaTimes, FaPlus } from "react-icons/fa";
import Stop from "./Stop";
import Leg from "./Leg";
import PlaceholderButton from "react-bootstrap/PlaceholderButton";
import LoadingPlaceholder from "../../LoadingPlaceholder";
import Label from "../../Label";
import useStops from "../../../shared/hooks/useStops.js";

const MINIMUM_STOPS = 3;

export default function Stops(props) {
  const dispatch = useDispatch();
  const { formState: { errors }, getValues } = useFormContext();
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const isResults = useSelector(state => selectIsState(state, "results"));
  const selectedStop = useSelector(selectSelectedStop);
  const [, setStops] = useStops();
  const results = useSelector(selectResults);

  const fieldArrayHook = useFieldArray({
    name: "stops",
    rules: { minLength: MINIMUM_STOPS }
  });
  const { fields, update, append, remove } = fieldArrayHook;

  const updateStopParams = useCallback(
    () => setStops(getValues("stops")),
    [getValues, setStops]
  );

  const handleRemoveStop = (index, _e) => {
    remove(index);
    updateStopParams();
    dispatch(setSelectedStop(-1));
  };
  const handleClearStop = (index, _e) => {
    update(index, fromStopString(""));
    updateStopParams();
  };
  const handleAddStop = () => {
    append(fromStopString(""));
    dispatch(setSelectedStop(getValues("stops").length - 1));
  };

  return (
    <div
      {...props}
      className={classNames(
        styles.container,
        props.className
      )}
    >
      <div className={styles.stops}>
        <div className={styles.markerBar}></div>

        <div className={styles.body}>
          <LoadingPlaceholder
            isLoading={isLoading}
            placeholder={CompPlaceholder}
          >
            {
              isResults
                ? results.stops.map((_, index) => (
                  <Fragment key={index}>
                    <div>
                      <div className={styles.marker}>
                        <div>{index + 1}</div>
                      </div>
                      <div className={styles.input}>
                        <Stop stopIndex={index}/>
                      </div>
                    </div>

                    {
                      (index < results.stops.length - 1) && (
                        <div>
                          <div className={classNames(styles.marker, styles.spacer)}></div>
                          <div className={styles.input}>
                            <Leg legIndex={index}/>
                          </div>
                        </div>
                      )
                    }
                  </Fragment>
                ))
                : fields.map((field, index) => (
                  <div
                    key={field.id}
                    data-selected={selectedStop === index}
                  >
                    <div
                      className={classNames(
                        styles.marker,
                        styles.circle
                      )}
                    >
                      <div></div>
                    </div>
                    <div className={styles.input}>
                      <Stop
                        name={`stops.${index}`}
                        stopIndex={index}
                      />
                    </div>
                    <div className={styles.actions}>
                      <Button
                        size="icon-sm"
                        variant="text"
                        onClick={_.partial(
                          (fields.length <= MINIMUM_STOPS)
                            ? handleClearStop
                            : handleRemoveStop,
                          index
                        )}
                        tooltip={{
                          placement: "bottom",
                          value: (fields.length <= MINIMUM_STOPS)
                            ? "Clear this stop"
                            : "Remove this stop"
                        }}
                      >
                        <FaTimes />
                      </Button>
                    </div>
                  </div>
                ))
            }

            {
              !isResults && (
                <div>
                  <div className={styles.marker}>
                    <div><FaPlus /></div>
                  </div>
                  <div className={styles.input}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleAddStop}
                    >
                      Add Stop
                    </Button>
                    {
                      errors.stops && (
                        <Label
                          className={styles.error}
                          label={errors.stops.message}
                        />
                      )
                    }
                  </div>
                </div>
              )
            }
          </LoadingPlaceholder>
        </div>
      </div>
      {
        isResults && (
          <div className={styles.summary}>
            <Label
              label="Summary"
            />
            <p>
              <span>{
                (() => {
                  const duration = moment.duration(results.duration, "seconds");
                  const days = duration.days();
                  const hours = duration.hours();
                  const minutes = duration.minutes();

                  return [
                    days ? `${days} days` : undefined,
                    hours ? `${hours} hours` : undefined,
                    minutes ? `${minutes} mins` : undefined
                  ].join(" ")
                })()
              }</span>
              <span>({_.round(results.distance / 1000, 1)} kms)</span>
            </p>
          </div>
        )
      }
    </div>
  );
}

const CompPlaceholder = () => (
  <>
    {
      new Array(MINIMUM_STOPS).fill(0).map((_, index) => (
        <div key={index}>
          <div className={classNames(styles.marker, styles.circle)}>
            <div></div>
          </div>
          <div className={styles.input}>
            <Stop />
          </div>
        </div>
      ))
    }

    <div>
      <div className={styles.marker}>
        <div><FaPlus /></div>
      </div>
      <div className={styles.input}>
        <PlaceholderButton xs={12} />
      </div>
    </div>
  </>
)
