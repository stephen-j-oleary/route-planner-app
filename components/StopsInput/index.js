
import styles from "./styles.module.css";
import { forwardRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import classnames from "classnames";
import { useSelector } from "react-redux";
import { selectIsState, selectState } from "../../redux/slices/routeForm.js";
import { fromStopString } from "../../shared/Stop.js";
import useStops from "../../shared/hooks/useStops.js";
import _ from "lodash";

import Button from "../Button";
import { FaTimes, FaPlus } from "react-icons/fa";
import StopInput from "../StopInput";
import PlaceholderButton from "react-bootstrap/PlaceholderButton";

const MINIMUM_STOPS = 3;

export default forwardRef(function StopsInput({ className, ...props }, ref) {
  const { formState: { errors }, getValues } = useFormContext();
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const formState = useSelector(selectState);
  const isDisabled = formState !== "edit";

  const fieldArrayHook = useFieldArray({
    name: "stops",
    rules: { minLength: MINIMUM_STOPS }
  });
  const { fields, update, append, remove } = fieldArrayHook;
  const [, setStops] = useStops();

  const setStopParams = () => {
    setStops(getValues("stops"));
  };

  const createRemoveStop = index => () => {
    remove(index);
    setStopParams();
  };
  const createClearStop = index => () => {
    update(index, fromStopString(""));
    setStopParams();
  };

  return isLoading
    ? <CompPlaceholder />
    : (
      <div
        className={classnames(className, styles.container)}
        {...props}
      >
        {
          fields.map((field, index) => (
            <div key={field.id} className={styles.row}>
              <div className={styles.marker}>
                {
                  _.isUndefined(getValues(`stops.${index}.index`))
                    ? <div className="markerCircle"></div>
                    : <div className="markerIndex">{getValues(`stops.${index}.index`) + 1}</div>
                }
                <div className="markerBar"></div>
              </div>
              <div className={styles.input}>
                <StopInput
                  ref={ref}
                  name={`stops.${index}`}
                  stopIndex={index}
                />
              </div>
              <div className={styles.actions}>
                <Button
                  disabled={isDisabled}
                  onClick={(fields.length <= MINIMUM_STOPS)
                    ? createClearStop(index)
                    : createRemoveStop(index)
                  }
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

        <div className={styles.row}>
          <div className={styles.marker}>
            <div className="markerText">
              <FaPlus />
            </div>
          </div>
          <div className={styles.input}>
            <Button onClick={() => append(fromStopString(""))}>
              Add Stop
            </Button>
            {errors.stops && (
              <label className={styles.error}>
                {errors.stops.message}
              </label>
            )}
          </div>
        </div>
      </div>
    );
})

const CompPlaceholder = () => (
  <div className={styles.container}>
    {
      new Array(3).fill(0).map((_, index) => (
        <div
          key={index}
          className={styles.row}
        >
          <div className={styles.marker}>
            <div className="markerCircle"></div>
            <div className="markerBar"></div>
          </div>
          <div className={styles.input}>
            <StopInput />
          </div>
        </div>
      ))
    }

    <div className={styles.row}>
      <div className={styles.marker}>
        <div className="markerText"><FaPlus /></div>
      </div>
      <div className={styles.input}>
        <PlaceholderButton xs={12} />
      </div>
    </div>
  </div>
)
