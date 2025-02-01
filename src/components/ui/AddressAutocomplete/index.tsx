// Don't use "use client" here. This component is passed non-serializable props so shouldn't be the client-server boundary
import "client-only";

import { pick } from "lodash-es";
import mergeRefs from "merge-refs";
import { ReactNode, useActionState, useCallback, useRef, useState } from "react";

import { ArrowBackIosRounded, ErrorOutlineRounded } from "@mui/icons-material";
import { Autocomplete, AutocompleteInputChangeReason, AutocompleteProps, AutocompleteRenderInputParams, CircularProgress, IconButton, InputAdornment, TextFieldProps, Tooltip, useMediaQuery } from "@mui/material";

import AddressAutocompleteGroup from "./Group";
import { AddressAutocompleteOption, useAddressAutocomplete } from "./hooks";
import AddressAutocompleteSuggestion from "./Suggestion";
import { useQuickSuggestions } from "./useQuickSuggestions";


export type RenderInputParams =
  & AutocompleteRenderInputParams
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
    coord: ({ lat: number, lng: number }) | string | null | undefined,
    renderInput: (params: Partial<RenderInputParams>) => ReactNode,
  };

export default function AddressAutocomplete({
  value,
  onChange,
  coord,
  renderInput,
  ...props
}: AddressAutocompleteProps) {
  const isMobile = useMediaQuery("@media only screen and (hover: none) and (pointer: coarse)");

  const container = useRef(null);
  const ref = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const quickSuggestions = useQuickSuggestions();
  const autocomplete = useAddressAutocomplete(searchValue, value);

  const [, handleChange, isPending] = useActionState(
    async (prevState: unknown, v: AddressAutocompleteOption | string) => {
      const vObj = typeof v === "string" ? { mainText: v, fullText: v } : v;
      const actionResult = vObj.action && await vObj.action() || {};

      onChange(pick({ ...vObj, ...actionResult }, ["mainText", "fullText", "secondaryText", "coordinates"]));
      handleClose();
    },
    null
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
      if (isMobile) document.body.style.overflow = "hidden";
      setOpen(true);
    },
    [isMobile]
  );
  const handleClose = useCallback(
    () => {
      document.body.style.overflow = "unset";
      setOpen(false);
      ref.current?.blur();
    },
    []
  );


  return (
    <Autocomplete
      ref={container}

      freeSolo
      autoHighlight /* Highlight the first option */
      disableClearable /* Remove the clear button */
      openOnFocus /* Open the dropdown on focus */

      /* Controlled open/close state */
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}

      /* Controlled field values */
      value={value ?? undefined}
      onChange={(_e, v) => handleChange(v)}

      /* Controlled input values */
      inputValue={inputValue ?? ""}
      onInputChange={(_e, v, r) => handleInputChange(v, r)}

      /* Options */
      options={[
        ...quickSuggestions.map(item => ({ ...item, group: "quick" })),
        ...(autocomplete.data || [{ fullText: "" }]).map(item => ({ ...item, group: "main" })),
      ]}
      getOptionLabel={option => (typeof option === "string" ? option : option.fullText) || ""}
      filterOptions={options => options} // Keep all options
      isOptionEqualToValue={(o, v) => (typeof o === "string" ? o : o.fullText) === (typeof v === "string" ? v : v.fullText)}

      renderInput={params => (
        renderInput({
          ...params,
          slotProps: {
            htmlInput: {
              ...params.inputProps,
              ref: mergeRefs(ref, params.inputProps.ref),
            },
            input: {
              ...params.InputProps,
              startAdornment: isMobile && open && (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={handleClose}
                    sx={{ padding: 0 }}
                  >
                    <ArrowBackIosRounded />
                  </IconButton>
                </InputAdornment>
              ),
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
          sx: { gridArea: "input" },
        })
      )}

      /* Render the custom group component to show quick suggestions */
      groupBy={o => (
        typeof o === "object"
          && o.group
          || "main"
      )}
      renderGroup={({ key, ...params }) => (
        <AddressAutocompleteGroup key={key} {...params} />
      )}

      renderOption={({ key, ...params }, option) => (
        <AddressAutocompleteSuggestion
          key={key}
          {...params}
          {...(typeof option === "object" ? pick(option, "fullText", "mainText", "secondaryText", "coordinates", "icon") : {})}
        />
      )}

      {...props}

      /* Styling */
      ListboxProps={{
        sx: {
          padding: 0,
          maxHeight: isMobile ? "unset" : undefined,
          paddingBottom: isMobile ? "5rem" : 0,
        },
      }}
      slotProps={{
        popper: isMobile ? {
          style: {
            width: "100vw",
            height: "100%",
            gridArea: "suggestions",
            overflow: "scroll",
          },
        } : {},
        paper: isMobile ? {
          sx: {
            boxShadow: "none",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          },
        } : {},
      }}
      sx={{
        position: isMobile && open ? "fixed" : "relative",
        inset: isMobile && open ? 0 : "unset",
        paddingTop: isMobile && open ? "calc(env(safe-area-inset-top) + 1rem)" : 0,
        paddingBottom: isMobile && open ? "calc(env(safe-area-inset-bottom) + 1rem)" : 0,
        paddingLeft: isMobile && open ? "calc(env(safe-area-inset-left) + .5rem)" : 0,
        paddingRight: isMobile && open ? "calc(env(safe-area-inset-right) + .5rem)" : 0,
        zIndex: isMobile && open ? theme => theme.zIndex.modal : "unset",
        background: isMobile && open ? "white" : "inherit",
        display: isMobile ? "grid" : undefined,
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto 1fr",
        gridTemplateAreas: `
          "input"
          "suggestions"
        `,
      }}
    />
  );
}