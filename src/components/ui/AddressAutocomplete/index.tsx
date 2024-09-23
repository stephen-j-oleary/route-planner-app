import "client-only";

import React from "react";
import { pick } from "lodash-es";

import { ArrowBackIosRounded, MyLocationRounded } from "@mui/icons-material";
import { Autocomplete, AutocompleteProps, AutocompleteRenderInputParams, CircularProgress, IconButton, InputAdornment, SxProps, useMediaQuery } from "@mui/material";

import AddressAutocompleteGroup from "./Group";
import AddressAutocompleteSuggestion from "./Suggestion";
import { useAddressAutocomplete, AddressAutocompleteOption, useCurrentLocation, hasCoordinate } from "./hooks";


export type RenderInputParams =
  & AutocompleteRenderInputParams
  & {
    ref: React.RefObject<HTMLInputElement>,
    error: boolean,
    helperText: string,
    sx: SxProps,
  };

export type AddressAutocompleteProps =
  & Omit<AutocompleteProps<Partial<AddressAutocompleteOption> | string, false, true, true>, "value" | "onChange" | "options" | "renderInput">
  & {
    value: Partial<AddressAutocompleteOption> | null,
    onChange: (option: Partial<AddressAutocompleteOption> | null) => void,
    renderInput: (params: Partial<RenderInputParams>) => React.ReactNode,
  };

export default function AddressAutocomplete({
  value,
  onChange,
  renderInput,
  ...props
}: AddressAutocompleteProps) {
  const isMobile = useMediaQuery("@media only screen and (hover: none) and (pointer: coarse)");

  const container = React.useRef(null);
  const ref = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [highlighted, setHighlighted] = React.useState<Partial<AddressAutocompleteOption> | string | null>(null);

  const autocomplete = useAddressAutocomplete(inputValue, value);

  const handleInputChange = (v: string) => {
    setInputValue(v);
  }

  const handleChange = (v: Partial<AddressAutocompleteOption> | string | null) => {
    const vObj = typeof v === "string" ? { mainText: v, fullText: v } : v;
    onChange(vObj);
    handleClose();
  }

  const handleHighlightChange = (v: Partial<AddressAutocompleteOption> | string | null) => {
    setHighlighted(v);
  };

  const handleOpen = () => {
    if (isMobile) document.body.style.overflow = "hidden";
    setOpen(true);
  };
  const handleClose = () => {
    document.body.style.overflow = "unset";
    setOpen(false);

    // Autoselect
    if (typeof highlighted !== "object") return;
    onChange(highlighted);
    handleInputChange(highlighted?.fullText || "");
  };

  // Blur on close
  // Prevents keyboard reappearing on mobile after pressing back button
  React.useEffect(
    () => void (!open && ref.current?.blur()),
    [open]
  );


  const location = useCurrentLocation();

  React.useEffect(
    () => {
      if (!location.data) return;
      handleChange({
        mainText: "Current location",
        fullText: location.data,
        coordinates: location.data,
      });
    },
    [location.data]
  );

  const currentLocationOption: AddressAutocompleteOption = {
    isQuick: true,
    icon: <MyLocationRounded fontSize="inherit" />,
    mainText: "Current location",
    isPending: location.isFetching,
    onClick: () => location.fetch(),
  };


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
      onClose={() => {
        // Handle closing differently on mobile
        if (!isMobile) handleClose();
      }}

      /* Controlled field values */
      value={value ?? undefined}
      onChange={(_e, v) => handleChange(v)}

      /* Controlled input values */
      inputValue={inputValue ?? ""}
      onInputChange={(_e, v) => handleInputChange(v)}

      onHighlightChange={(_e, v) => handleHighlightChange(v)}

      /* Options */
      options={[
        currentLocationOption,
        (!autocomplete.data?.length && value && hasCoordinate(value)) ? value : "",
        ...(autocomplete.data || []),
      ]}
      getOptionLabel={option => (typeof option === "string" ? option : option.fullText) || ""}
      filterOptions={options => options} // Keep all options
      isOptionEqualToValue={(o, v) => (typeof o === "string" ? o : o.fullText) === (typeof v === "string" ? v : v.fullText)}

      renderInput={params => (
        renderInput({
          ref,
          ...params,
          InputProps: {
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
          sx: { gridArea: "input" },
        })
      )}

      /* Render the custom group component to show quick suggestions */
      groupBy={() => "main"}
      renderGroup={({ key, ...params }) => (
        <AddressAutocompleteGroup
          key={key}
          onChange={handleChange}
          {...params}
        />
      )}

      renderOption={({ key, ...params }, option) => option && (
        <AddressAutocompleteSuggestion
          key={key}
          {...params}
          {...(typeof option === "object" ? pick(option, "fullText", "mainText", "secondaryText", "coordinates", "icon", "isQuick", "isPending", "onClick") : {})}
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