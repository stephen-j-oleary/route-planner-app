
import classNames from "classnames";
import { actions as mapActions, MAP_MODES } from "../../redux/slices/map.js";
import { actions as routeFormActions, selectIsSelectedStop, selectIsState } from "../../redux/slices/routeForm.js";
import mergeEvents from "../../shared/hooks/mergeEvents.js";
import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import useDebounce from "../../shared/hooks/useDebounce.js";
import usePosition from "../../shared/hooks/usePosition.js";
import useStops from "../../shared/hooks/useStops.js";

import AddressInput from "../AddressInput/index.js";
import Input from "../Input";
import Placeholder from "react-bootstrap/Placeholder";

export default forwardRef(function StopInput({ stopIndex, ...props }, ref) {
  const dispatch = useDispatch();
  const { lat, lng } = usePosition();
  const { getValues } = useFormContext();
  const [, setStops] = useStops();

  const isSelected = useSelector(state => selectIsSelectedStop(state, stopIndex));
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const isDisabled = !useSelector(state => selectIsState(state, "edit"));

  const handleSelectStop = () => {
    dispatch(routeFormActions.setSelectedStop(stopIndex));
  };
  const handleUpdateMap = searchValue => {
    const args = searchValue
      ? [MAP_MODES.place, searchValue]
      : [MAP_MODES.view];

    dispatchMapChange(...args);
  }

  // Dispatch changes to the map
  const dispatchMapChange = useDebounce((mode, q) => {
    const options = {
      mode,
      q,
      center: `${lat}, ${lng}`
    };

    dispatch(mapActions.setEmbed(options));
  }, 1000, [lat, lng]);

  const setStopParams = () => {
    setStops(getValues("stops"));
  };

  const handleChange = e => {
    const { value } = e.currentTarget;
    const args = value
      ? [MAP_MODES.search, `${value}+near+${lat},${lng}`]
      : [MAP_MODES.view];

    dispatchMapChange(...args);
  };
  const handleFocus = e => {
    const { value } = e.currentTarget;
    handleSelectStop();
    handleUpdateMap(value);
  };
  const handleBlur = () => {
    setStopParams();
  };
  const handleKeyDown = e => {
    if (e.key === "Enter") setStopParams();
  };

  return isLoading
    ? <CompPlaceholder {...props} />
    : (
      <AddressInput
        {...props}
        ref={ref}
        disabled={isDisabled}
        options={{
          required: "Please enter an address"
        }}
        className={classNames({ focus: isSelected })}
        onChange={mergeEvents(props.onChange, handleChange)}
        onFocus={mergeEvents(props.onFocus, handleFocus)}
        onBlur={mergeEvents(props.onBlur, handleBlur)}
        onKeyDown={mergeEvents(props.onKeyDown, handleKeyDown)}
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
