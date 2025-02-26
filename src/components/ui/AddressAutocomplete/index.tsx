// Don't use "use client" here. This component is passed non-serializable props so shouldn't be the client-server boundary
import "client-only";

import { pick } from "lodash-es";
import mergeRefs from "merge-refs";
import { InputHTMLAttributes, ReactNode, useActionState, useCallback, useEffect, useRef, useState } from "react";

import { ErrorOutlineRounded, HistoryRounded } from "@mui/icons-material";
import { AutocompleteInputChangeReason, AutocompleteProps, Box, CircularProgress, InputAdornment, List, TextFieldProps, Tooltip, useAutocomplete, useMediaQuery } from "@mui/material";

import { AddressAutocompleteOption, useAddressAutocomplete } from "./hooks";
import { saveRecentStop, useRecentStops } from "./recent";
import AddressAutocompleteSuggestion from "./Suggestion";
import { useQuickSuggestions } from "./useQuickSuggestions";


export type RenderInputParams =
  & InputHTMLAttributes<HTMLInputElement>
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value: AddressAutocompleteOption,
    onChange: (v: AddressAutocompleteOption) => void,
  };

export type AddressAutocompleteProps =
  & Omit<AutocompleteProps<AddressAutocompleteOption | string, false, true, true>, "value" | "onChange" | "options" | "renderInput">
  & {
    value: AddressAutocompleteOption,
    onChange: (option: AddressAutocompleteOption) => void,
    open: boolean,
    onOpen: () => void,
    onClose: () => void,
    coord: ({ lat: number, lng: number }) | string | null | undefined,
    renderInput: (params: Partial<RenderInputParams>) => ReactNode,
  };

export default function AddressAutocomplete({
  value,
  onChange,
  open,
  onOpen,
  onClose,
  coord,
  renderInput,
}: AddressAutocompleteProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isMobile = useMediaQuery("@media only screen and (hover: none) and (pointer: coarse)");

  const ref = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value.fullText ?? "");
  const [searchValue, setSearchValue] = useState(value.fullText ?? "");

  const quickSuggestions = useQuickSuggestions();
  const recentStops = useRecentStops();
  const autocomplete = useAddressAutocomplete(searchValue, value);

  const [, handleChange, isPending] = useActionState(
    async (prevState: unknown, val: AddressAutocompleteOption | string) => {
      const vObj: AddressAutocompleteOption = typeof val === "string"
        ? { fullText: val, coordinates: "" }
        : val;
      const actionResult = "action" in vObj && vObj.action && await vObj.action() || {};

      const stop = pick({ ...vObj, ...actionResult }, ["mainText", "fullText", "secondaryText", "coordinates"]);
      onChange(stop);
      saveRecentStop(stop);
      handleClose();
    },
    null
  );

  useEffect(
    () => {
      if (!isInitialLoad || !autocomplete.data) return;

      if (!value.coordinates && autocomplete.data.length && inputValue === autocomplete.query) handleChange(autocomplete.data[0]);
      setIsInitialLoad(false);
    },
    [isInitialLoad, autocomplete, value, inputValue, handleChange]
  );

  const handleInputChange = useCallback(
    (v: string, reason: AutocompleteInputChangeReason) => {
      if (reason === "input") setSearchValue(v);
      setInputValue(v);
    },
    []
  );

  const handleOpen = useCallback(
    () => {
      document.body.style.overflow = "hidden";
      onOpen();
    },
    [onOpen]
  );
  const handleClose = useCallback(
    () => {
      document.body.style.overflow = "unset";
      onClose();
      ref.current?.blur();
    },
    [onClose]
  );


  const {
    groupedOptions,
    getInputProps,
    getListboxProps,
    getOptionProps,
    popupOpen,
  } = useAutocomplete({
    freeSolo: true,
    // Highlight the first option
    autoHighlight: true,
    // Remove the clear button
    disableClearable: true,
    openOnFocus: true,
    open,
    onOpen: handleOpen,
    onClose: handleClose,
    value,
    onChange: (_e, v) => handleChange(v),
    inputValue,
    onInputChange: (_e, v, r) => handleInputChange(v, r),
    options: autocomplete.data?.length
      ? autocomplete.data
      : recentStops.data?.map(item => ({ ...item, icon: <HistoryRounded fontSize="inherit" /> }))
      || [{ fullText: "", coordinates: "" }],
    getOptionKey: (option) => (typeof option === "string" ? option : option.fullText) || "",
    getOptionLabel: option => (typeof option === "string" ? option : option.fullText) || "",
    filterOptions: options => options, // Keep all options
    isOptionEqualToValue: (o, v) => (typeof o === "string" ? o : o.fullText) === (typeof v === "string" ? v : v.fullText),
  });

  const inputParams = getInputProps();

  return (
    <>
      <Box gridArea="input">
        {
          renderInput({
            slotProps: {
              htmlInput: {
                ...inputParams,
                ref: mergeRefs(ref, inputParams.ref),
              },
              input: {
                endAdornment: (autocomplete.isFetching || isPending)
                  ? (
                    <InputAdornment position="end">
                      <CircularProgress size="1rem" />
                    </InputAdornment>
                  )
                  : (!open && inputValue && !coord)
                  && (
                    <InputAdornment position="end">
                      <Tooltip title="Couldn't find address">
                        <ErrorOutlineRounded fontSize="inherit" color="error" />
                      </Tooltip>
                    </InputAdornment>
                  ),
              },
            },
          })
        }
      </Box>

      {
        popupOpen && (
          <Box
            {...getListboxProps()}
            component="ul"
            gridArea="suggestions"
            px={0}
            py={1}
            maxHeight="unset"
            paddingBottom={isMobile ? "5rem" : 0}
            overflow="auto"
          >
            <List
              disablePadding
              sx={{
                margin: 0,
                borderColor: "divider",
                borderStyle: "solid",
                borderWidth: 0,
                borderBottomWidth: ".25rem",
              }}
            >
              {
                quickSuggestions.map(item => (
                  <AddressAutocompleteSuggestion
                    key={item.fullText ?? ""}
                    onClick={() => handleChange(item)}
                    {...item}
                  />
                ))
              }
            </List>

            <List
              disablePadding
              sx={{ margin: 0 }}
            >
              {
                groupedOptions.map((option, index) => {
                  const { key, ...params } = getOptionProps({ option, index });
                  const {
                    fullText = "",
                    mainText = undefined,
                    secondaryText = undefined,
                    coordinates = "",
                    icon = undefined,
                  } = typeof option === "object" ? option : {};

                  return (
                    <AddressAutocompleteSuggestion
                      key={key}
                      fullText={fullText}
                      mainText={mainText}
                      secondaryText={secondaryText}
                      coordinates={coordinates}
                      icon={icon}
                      {...params}
                    />
                  );
                })
              }
            </List>
          </Box>
        )
      }
    </>
  );
}