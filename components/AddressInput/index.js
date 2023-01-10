
import _ from "lodash";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import sameWidthModifier from "../../shared/popperModifiers/sameWidth.js";
import useStops from "../../shared/hooks/useStops.js";
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

  const { register, setValue, getValues } = useFormContext();
  const [, setStops] = useStops();

  // Suggestions popup
  const suggestionsPopupState = usePopupState({ variant: "popover", popupId: name });
  const [showMarkup, setShowMarkup] = useState(false);


  const updateStopParams = useCallback(
    () => setStops(getValues("stops")),
    [getValues, setStops]
  );

  const handleSelect = useCallback(
    item => {
      if (!item) return;

      const { data: { id, lat, lng, address } } = item;

      const coordinates = (!_.isUndefined(lat) && !_.isUndefined(lng)) ? [lat, lng].join(",") : null;
      const addressStr = (!_.isUndefined(address?.formatted_address)) ? address.formatted_address : null;

      if (!_.isUndefined(id)) setValue(`${name}.id`, id);
      if (coordinates) setValue(`${name}.coordinates`, [lat, lng].join(","));
      if (addressStr || coordinates) setValue(`${name}.address`, addressStr || coordinates);
      updateStopParams();
      suggestionsPopupState.close();
    },
    [name, setValue, updateStopParams, suggestionsPopupState]
  );

  // Register additional fields that wont be rendered
  useEffect(() => {
    register(`${name}.id`);
    register(`${name}.coordinates`);
  }, [name, register]);

  useEffect(() => {
    if (suggestionsPopupState.isOpen && !showMarkup) setShowMarkup(true);
    if (!suggestionsPopupState.isOpen && showMarkup) _.delay(setShowMarkup, 1000, false);
  }, [suggestionsPopupState.isOpen, showMarkup]);

  return (
    <>
      <Input
        ref={ref}
        name={`${name}.address`}
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
                query={getValues(`${name}.address`)}
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
