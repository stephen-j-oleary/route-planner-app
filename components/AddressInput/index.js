
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
import { Fade, List, Paper, Popper } from "@mui/material";

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

  // Suggestions popup
  const suggestionsPopupState = usePopupState({ variant: "popover", popupId: name });
  const [showMarkup, setShowMarkup] = useState(false);


  const updateStopParams = useCallback(
    () => setStops(getValues("stops")),
    [getValues, setStops]
  );

  const handleSelect = useCallback(
    async item => {
      if (!item) return;

      const { id, primary, secondary, value, position } = item;
      const _value = _.isFunction(value) ? await value() : value;
      const coordinates = (!_.isNil(position)) ? [position.lat, position.lng].join(",") : null;

      setValue(`${name}.id`, id);
      setValue(`${name}.coordinates`, coordinates);
      setValue(`${name}.full_text`, full_text);
      setValue(`${name}.main_text`, main_text);
      setValue(`${name}.secondary_text`, secondary_text);
      updateStopParams();
      suggestionsPopupState.close();
    },
    [name, setValue, updateStopParams, suggestionsPopupState]
  );

  // Register additional fields that wont be rendered
  useEffect(() => {
    register(`${name}.id`);
    register(`${name}.coordinates`);
    register(`${name}.main_text`);
    register(`${name}.secondary_text`);
  }, [name, register]);

  useEffect(() => {
    if (suggestionsPopupState.isOpen && !showMarkup) setShowMarkup(true);
    if (!suggestionsPopupState.isOpen && showMarkup) _.delay(setShowMarkup, 1000, false);
  }, [suggestionsPopupState.isOpen, showMarkup]);

  return (
    <>
      <Input
        ref={ref}
        name={`${name}.full_text`}
        type="text"
        placeholder="Enter an address"
        {...mergeProps(props, bindFocus(suggestionsPopupState))}
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
              component={List}
              disablePadding
              elevation={8}
              sx={{
                overflow: "auto",
                maxHeight: "50vh"
              }}
            >
              <AddressSuggestions
                query={watch(`${name}.full_text`)}
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
