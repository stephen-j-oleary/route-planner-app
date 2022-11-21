
import classNames from "classnames";
import _ from "lodash";
import { selectIsSelectedStop, selectIsState, setSelectedStop, selectResults } from "../../../../redux/slices/routeForm.js";
import mergeEvents from "../../../../shared/hooks/mergeEvents.js";
import { forwardRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import useStops from "../../../../shared/hooks/useStops.js";

import AddressInput from "../../../AddressInput";
import Input from "../../../Input";
import Placeholder from "react-bootstrap/Placeholder";

export default forwardRef(function StopInput({ stopIndex, ...props }, ref) {
  const dispatch = useDispatch();
  const { getValues } = useFormContext();
  const [, setStops] = useStops();
  const value = useSelector(state => _.get(selectResults(state), `stops.${stopIndex}.address`));

  const isSelected = useSelector(state => selectIsSelectedStop(state, stopIndex));
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const isResults = useSelector(state => selectIsState(state, "results"));

  const handleSelectStop = () => {
    dispatch(setSelectedStop(stopIndex));
  };

  const updateStopParams = useCallback(
    () => setStops(getValues("stops")),
    [getValues, setStops]
  );

  const handleFocus = () => {
    handleSelectStop();
  };
  const handleBlur = () => {
    updateStopParams();
  };
  const handleKeyDown = e => {
    if (e.key === "Enter") updateStopParams();
  };

  return isLoading
    ? <CompPlaceholder {...props} />
    : isResults
    ? (
      <div {...props} className="input-like">
        {value}
      </div>
    )
    : (
      <AddressInput
        {...props}
        ref={ref}
        options={{
          required: "Please enter an address"
        }}
        className={classNames({ focus: isSelected })}
        onFocus={mergeEvents(handleFocus, props.onFocus)}
        onBlur={mergeEvents(handleBlur, props.onBlur)}
        onKeyDown={mergeEvents(handleKeyDown, props.onKeyDown)}
      />
    )
})

const CompPlaceholder = props => (
  <Placeholder
    {...props}
    as={Input}
    animation="wave"
    disabled
  />
)
