import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";

import { ArrowBackIosRounded } from "@mui/icons-material";
import { Autocomplete, AutocompleteProps, AutocompleteRenderInputParams, CircularProgress, IconButton, InputAdornment, SxProps, useMediaQuery } from "@mui/material";

import AddressAutocompleteGroup from "./Group";
import AddressAutocompleteSuggestion from "./Suggestion";
import { AddressSuggestion, useAddressSuggestions } from "@/hooks/useAddressSuggestions";
import usePosition from "@/hooks/usePosition";
import { getGeocode } from "@/services/geocode";
import { COORDINATES } from "@/utils/patterns";


export type RenderInputParams =
  & AutocompleteRenderInputParams
  & {
    ref: React.RefObject<HTMLInputElement>,
    error: boolean,
    helperText: string,
    sx: SxProps,
  };

export type AddressAutocompleteProps =
  & Omit<AutocompleteProps<AddressSuggestion | string, false, true, true>, "value" | "onChange" | "options" | "renderInput">
  & {
    value: AddressSuggestion | null,
    onChange: (option: AddressSuggestion | null) => void,
    renderInput: (params: RenderInputParams) => React.ReactNode,
  };

export default function AddresAutocomplete({
  value,
  onChange,
  renderInput,
  ...props
}: AddressAutocompleteProps) {
  const isMobile = useMediaQuery("@media only screen and (hover: none) and (pointer: coarse)");
  const position = usePosition();

  const container = React.useRef(null);
  const ref = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const locationQuery = useQuery({
    queryKey: ["location", position.status],
    queryFn: () => position.request(),
    enabled: position.status === "granted",
    select: ({ lat, lng }) => `${lat}, ${lng}`,
  });

  const addressSuggestions = useAddressSuggestions({
    q: inputValue,
    params: locationQuery.isSuccess ? {
      location: locationQuery.data,
    } : undefined,
    enabled: open,
  });

  const geocodeMutation = useMutation({
    mutationFn: async (stop: string) => {
      if (COORDINATES.test(stop)) {
        const [lat, lng] = stop.split(",");
        const tuple: [number, number] = [+lat!.trim(), +lng!.trim()];
        return tuple;
      }
      const res = await getGeocode({ q: stop });
      if (!res?.results?.[0]?.coordinates) throw new Error("Couldn't find address. Please try a different address");
      return res.results[0].coordinates;
    },
  });

  const handleInputChange = (v: string) => {
    geocodeMutation.reset();
    setInputValue(v);
  }

  const handleChange = (v: AddressSuggestion | string) => {
    geocodeMutation.reset();
    const vObj = typeof v === "string" ? { mainText: v, fullText: v } : v;
    if (!vObj.coordinates && vObj.fullText) geocodeMutation.mutateAsync(vObj.fullText).then(coordinates => onChange({ ...vObj, coordinates })).catch(() => {});
    onChange(vObj);
    handleClose();
  }

  const handleOpen = () => {
    if (isMobile) document.body.style.overflow = "hidden";
    setOpen(true);
  };
  const handleClose = () => {
    document.body.style.overflow = "unset";
    setOpen(false);
  };

  // Blur on close
  // Prevents keyboard reappearing on mobile after pressing back button
  React.useEffect(
    () => void (!open && ref.current?.blur()),
    [open]
  );


  return (
    <Autocomplete
      ref={container}

      freeSolo /* Allow text input */
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

      /* Options */
      options={[
        { fullText: inputValue || "" }, /* Include the input in the suggestions */
        ...(addressSuggestions.data || []),
      ]}
      getOptionLabel={option => (typeof option === "string" ? option : option.fullText) || ""}
      filterOptions={options => options} // Keep all options

      renderInput={params => (
        renderInput({
          ref,
          ...params,
          error: geocodeMutation.error instanceof Error,
          helperText: geocodeMutation.error instanceof Error ? geocodeMutation.error.message : "",
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
            endAdornment: geocodeMutation.isPending && (
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
      renderGroup={params => (
        <AddressAutocompleteGroup
          onChange={handleChange}
          isFetching={addressSuggestions.isFetching}
          {...params}
        />
      )}

      renderOption={(params, option) => (
        <AddressAutocompleteSuggestion
          {...params}
          key={params.id}
          primary={
            typeof option === "string"
              ? option
              : (option.mainText || option.fullText)
          }
          secondary={
            typeof option !== "string"
              ? option.secondaryText
              : ""
          }
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