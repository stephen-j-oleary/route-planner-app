
import classNames from "classnames";
import _ from "lodash";
import { selectIsSelectedStop, selectIsState, setSelectedStop, selectResults } from "../../../../redux/slices/routeForm.js";
import mergeEvents from "../../../../shared/hooks/mergeEvents.js";
import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import useStops from "../../../../shared/hooks/useStops.js";

import AddressInput from "../../../AddressInput";
import Input from "../../../Input";
import { Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default forwardRef(function StopInput({ stopIndex, ...props }, ref) {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { getValues, watch } = useFormContext();
  const [, setStops] = useStops();
  const resultValue = useSelector(state => _.get(selectResults(state), `stops.${stopIndex}.address`));
  const origin = watch("origin", -1);
  const destination = watch("destination", -1);
  const isOrigin = stopIndex === +origin;
  const isDestination = stopIndex === +destination;

  const isSelected = useSelector(state => selectIsSelectedStop(state, stopIndex));
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const isResults = useSelector(state => selectIsState(state, "results"));

  const handleSelectStop = () => {
    dispatch(setSelectedStop(stopIndex));
  };

  const updateStopParams = () => {
    setStops(getValues("stops"));
  };
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
    ? (
      <Skeleton
        variant="rounded"
        width="100%"
      >
        <Input fullWidth />
      </Skeleton>
    )
    : isResults
    ? (
      <Typography
        variant="subtitle1"
        sx={theme.typography.limitLines(1)}
        {...props}
      >
        {resultValue}
      </Typography>
    )
    : (
      <AddressInput
        ref={ref}
        options={{ required: "Please enter an address" }}
        className={classNames({ focus: isSelected })}
        onFocus={mergeEvents(handleFocus, props.onFocus)}
        onBlur={mergeEvents(handleBlur, props.onBlur)}
        onKeyDown={mergeEvents(handleKeyDown, props.onKeyDown)}
        helperText={(isOrigin || isDestination) && (
          [
            ...(isOrigin) ? ["Origin"] : [],
            ...(isDestination) ? ["Destination"] : []
          ].join(" & ")
        )}
        FormHelperTextProps={{
          sx: { marginY: 0 }
        }}
        {...props}
      />
    )
})
