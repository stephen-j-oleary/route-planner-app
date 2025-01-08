import "client-only";

import { pick } from "lodash-es";
import mergeRefs from "merge-refs";
import { FunctionComponent, ReactNode, useCallback, useRef, useState } from "react";

import { ArrowBackIosRounded } from "@mui/icons-material";
import { Autocomplete, AutocompleteProps, AutocompleteRenderInputParams, CircularProgress, IconButton, InputAdornment, TextFieldProps, useMediaQuery } from "@mui/material";

import AddressAutocompleteGroup from "./Group";
import { AddressAutocompleteOption, hasCoordinate, useAddressAutocomplete } from "./hooks";
import AddressAutocompleteSuggestion, { AddressAutocompleteSuggestionProps } from "./Suggestion";


export type RenderInputParams =
  & AutocompleteRenderInputParams
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value: Partial<AddressAutocompleteOption>,
    onChange: (v: Partial<AddressAutocompleteOption>) => void,
  };

export type AddressAutocompleteProps =
  & Omit<AutocompleteProps<Partial<AddressAutocompleteOption> | string, false, true, true>, "value" | "onChange" | "options" | "renderInput">
  & {
    value: Partial<AddressAutocompleteOption>,
    onChange: (option: Partial<AddressAutocompleteOption>) => void,
    renderInput: (params: Partial<RenderInputParams>) => ReactNode,
    quickSuggestions?: { key: string, Component: FunctionComponent<AddressAutocompleteSuggestionProps> }[],
  };

export default function AddressAutocomplete({
  value,
  onChange,
  renderInput,
  quickSuggestions = [],
  ...props
}: AddressAutocompleteProps) {
  const isMobile = useMediaQuery("@media only screen and (hover: none) and (pointer: coarse)");

  const container = useRef(null);
  const ref = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlighted, setHighlighted] = useState<Partial<AddressAutocompleteOption> | string | null>(null);

  const autocomplete = useAddressAutocomplete(inputValue, value);

  const handleInputChange = useCallback(
    (v: string) => setInputValue(v),
    []
  );

  const handleAutoselect = useCallback(
    () => {
      if (!highlighted || typeof highlighted !== "object") return;
      onChange(highlighted);
      handleInputChange(highlighted.fullText || "");
    },
    [highlighted, onChange, handleInputChange]
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

      handleAutoselect();
    },
    [handleAutoselect]
  );

  const handleChange = useCallback(
    (v: Partial<AddressAutocompleteOption> | string) => {
      const vObj = typeof v === "string" ? { mainText: v, fullText: v } : v;
      onChange(vObj);
      handleClose();
    },
    [onChange, handleClose]
  );

  const handleHighlightChange = useCallback(
    (v: Partial<AddressAutocompleteOption> | string | null) => {
      setHighlighted(v);
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
      onInputChange={(_e, v) => handleInputChange(v)}

      onHighlightChange={(_e, v) => handleHighlightChange(v)}

      /* Options */
      options={[
        ...quickSuggestions.map(item => ({ group: "quick" as const, ...item })),
        (!autocomplete.data?.length && value && hasCoordinate(value)) ? value : "",
        ...(autocomplete.data || []),
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
              endAdornment: autocomplete.isFetching && (
                <InputAdornment position="end">
                  <CircularProgress size="1rem" />
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
      renderGroup={({ key, group, ...params }) => (
        <AddressAutocompleteGroup
          key={key}
          variant={group === "quick" ? "quick" : "main"}
          onChange={handleChange}
          {...params}
        />
      )}

      renderOption={({ key, onChange, ...params }, option) => (typeof option === "object" && option.Component)
        ? (
          <option.Component
            key={key}
            onChange={handleChange}
          />
        )
        : (
          <AddressAutocompleteSuggestion
            key={key}
            {...params}
            {...(typeof option === "object" ? pick(option, "fullText", "mainText", "secondaryText", "coordinates", "icon", "isQuick", "isPending", "onClick") : {})}
          />
        )
      }

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