
import _ from "lodash";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import sameWidthModifier from "../../shared/popperModifiers/sameWidth.js";
import useStopParams from "../../shared/hooks/useStopParams.js";
import { useTheme } from "@mui/material/styles";
import { AddressSuggestions } from "../../shared/hooks/useAddressSuggestions";
import { usePopupState, bindFocus, bindPopper } from "material-ui-popup-state/hooks";
import { mergeProps } from "@react-aria/utils";

import Input from "../Input";
import { CircularProgress, Fade, InputAdornment, Paper, Popper, Tooltip } from "@mui/material";
import { FaExclamationTriangle } from "react-icons/fa";

const offsetModifier = {
  name: "offset",
  enabled: true,
  options: {
    offset: [0, 4]
  }
};

const AddressInput = forwardRef(function AddressInput({
  name,
  ...props
}, ref) {
  const theme = useTheme();

  const { register, setValue, getValues, watch } = useFormContext();
  const [, setStops] = useStopParams();

  // Suggestions state
  const [suggestionsState, setSuggestionsState] = useState({
    loading: false,
    error: null
  });
  const suggestionsPopupState = usePopupState({ variant: "popover", popupId: name });
  const [showMarkup, setShowMarkup] = useState(false);


  const updateStopParams = useCallback(
    () => setStops(getValues("stops")),
    [getValues, setStops]
  );

  const handleSelect = useCallback(
    async item => {
      if (!item) return;
      try {
        suggestionsPopupState.close();
        setSuggestionsState(v => ({ ...v, loading: true }));

        const { id, primary, secondary, value, position } = item;
        const _value = _.isFunction(value) ? await value() : value;
        const coordinates = (!_.isNil(position)) ? [position.lat, position.lng].join(",") : null;

        setValue(`${name}.id`, id);
        setValue(`${name}.coordinates`, coordinates);
        setValue(`${name}.primary`, primary);
        setValue(`${name}.secondary`, secondary);
        setValue(`${name}.value`, _value);
        updateStopParams();
      }
      catch (err) {
        setSuggestionsState(v => ({ ...v, error: err }))
      }
      finally {
        setSuggestionsState(v => ({ ...v, loading: false }));
      }
    },
    [name, setValue, updateStopParams, suggestionsPopupState]
  );

  // Register additional fields that wont be rendered
  useEffect(() => {
    register(`${name}.id`);
    register(`${name}.coordinates`);
    register(`${name}.primary`);
    register(`${name}.secondary`);
  }, [name, register]);

  useEffect(() => {
    if (suggestionsPopupState.isOpen && !showMarkup) setShowMarkup(true);
    if (!suggestionsPopupState.isOpen && showMarkup) _.delay(setShowMarkup, 1000, false);
  }, [suggestionsPopupState.isOpen, showMarkup]);

  return (
    <>
      <Input
        ref={ref}
        name={`${name}.value`}
        type="text"
        placeholder={suggestionsState.loading ? "Loading..." : "Enter an address"}
        InputProps={{
          endAdornment: suggestionsState.loading
            ? (
              <InputAdornment position="end">
                <CircularProgress size="1rem" />
              </InputAdornment>
            )
            : suggestionsState.error
            ? (
              <Tooltip
                placement="bottom"
                title={`Current location could not be found: ${suggestionsState.error}`}
              >
                <InputAdornment position="end">
                  <FaExclamationTriangle size="1rem" color={theme.palette.error.dark} />
                </InputAdornment>
              </Tooltip>
            )
            : undefined
        }}
        {...mergeProps(props, bindFocus(suggestionsPopupState), {
          onFocus: () => {
            if (suggestionsState.error) setSuggestionsState(v => ({ ...v, error: null }));
          }
        })}
      />
      <Popper
        {...bindPopper(suggestionsPopupState)}
        transition
        disablePortal
        keepMounted
        placement="bottom"
        modifiers={[offsetModifier, sameWidthModifier]}
        sx={{ zIndex: theme.zIndex.drawer }}
      >
        {({ TransitionProps }) => (
          <Fade
            {...TransitionProps}
            timeout={300}
          >
            <Paper
              elevation={8}
              sx={{
                overflow: "auto",
                maxHeight: "50vh"
              }}
            >
              <AddressSuggestions
                query={watch(`${name}.value`)}
                onSelect={handleSelect}
                show={{
                  suggestions: suggestionsPopupState.isOpen,
                  markup: showMarkup
                }}
              />
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
})

export default AddressInput
