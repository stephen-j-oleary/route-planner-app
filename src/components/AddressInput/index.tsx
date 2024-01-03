import { isString, merge } from "lodash";
import React from "react";
import { useQuery } from "react-query";

import { MyLocationRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, AutocompleteProps, AutocompleteRenderGroupParams, LinearProgress, List, ListItem, ListItemButton, ListItemButtonProps, ListItemText, Stack, TextField, TextFieldProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { AddressSuggestion, useAddressSuggestions } from "@/hooks/useAddressSuggestions";
import usePosition from "@/hooks/usePosition";


type SuggestionGroupProps =
  & AutocompleteRenderGroupParams
  & {
    onChange: (option: AddressSuggestion) => void,
    isLoading: boolean,
  }

function SuggestionGroup({
  onChange,
  isLoading,
  children,
  ...props
}: SuggestionGroupProps) {
  const theme = useTheme();

  const { requestLocation } = usePosition();

  const locationQuery = useQuery({
    queryKey: ["location"],
    queryFn: () => requestLocation(),
  });

  return (
    <List
      disablePadding
      {...props}
    >
      <Stack
        direction="row"
        spacing={1}
        padding={1}
        sx={{
          overflow: "scroll hidden",
          borderBottom: 1,
          borderColor: "divider",
          ...theme.hideScrollbar,
        }}
      >
        <LoadingButton
          size="small"
          variant="outlined"
          startIcon={<MyLocationRounded fontSize="inherit" />}
          loadingPosition="start"
          loading={locationQuery.isLoading}
          disabled={locationQuery.isIdle}
          onClick={() => onChange({
            mainText: "Current location",
            fullText: `${locationQuery.data.lat}, ${locationQuery.data.lng}`,
          })}
        >
          Current location
        </LoadingButton>
      </Stack>

      {
        isLoading && (
          <ListItem disablePadding>
            <LinearProgress sx={{ width: "100%" }} />
          </ListItem>
        )
      }

      {children}
    </List>
  );
}


type SuggestionProps =
  & ListItemButtonProps<"li">
  & {
    primary: string,
    secondary?: string,
  }

function Suggestion({
  primary,
  secondary,
  ...props
}: SuggestionProps) {
  return (
    <ListItemButton component="li" {...props}>
      <ListItemText
        primary={primary}
        secondary={secondary}
        primaryTypographyProps={{
          variant: "subtitle2",
          sx: theme => theme.limitLines(1),
        }}
        secondaryTypographyProps={{
          variant: "caption",
          sx: theme => theme.limitLines(1),
        }}
        sx={{ margin: 0 }}
      />
    </ListItemButton>
  );
}


export type AddressInputProps =
  & Omit<AutocompleteProps<AddressSuggestion, false, true, true>, "value" | "onChange" | "options" | "renderInput">
  & {
    value: AddressSuggestion | null,
    onChange: (option: AddressSuggestion | null) => void,
    label?: string,
    textFieldProps?: Partial<TextFieldProps>,
  }

const AddressInput = React.forwardRef(function AddressInput({
  value,
  onChange,
  label,
  textFieldProps = {},
  ...props
}: AddressInputProps, ref) {
  const [open, setOpen] = React.useState(false);

  const addressSuggestions = useAddressSuggestions({
    q: value?.fullText,
    enabled: open,
  });

  const handleChange = (v: AddressSuggestion | string) =>
    onChange(isString(v) ? { mainText: v, fullText: v } : v);


  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      autoHighlight
      openOnFocus
      blurOnSelect
      freeSolo
      disableClearable
      value={value ?? undefined}
      inputValue={value?.fullText ?? ""}
      onChange={(_e, v) => handleChange(v)}
      onInputChange={(_e, v) => handleChange(v)}
      options={[
        value || { fullText: "" },
        ...(addressSuggestions.data || []),
      ]}
      getOptionLabel={option => (isString(option) ? option : option.fullText) || ""}
      filterOptions={options => options} // Keep all options
      renderInput={params => (
        <TextField
          inputRef={ref}
          placeholder="Enter an address"
          label={label || (value?.mainText !== value?.fullText ? value?.mainText : "")}
          {...merge(
            params,
            textFieldProps,
            {
              inputProps: {
                sx: { textOverflow: "unset !important" },
              },
            }
          )}
        />
      )}

      /* Render the custom group component to show quick suggestions */
      groupBy={() => "main"}
      renderGroup={params => (
        <SuggestionGroup
          onChange={handleChange}
          isLoading={addressSuggestions.isFetching}
          {...params}
        />
      )}

      renderOption={(params, option) => (
        <Suggestion
          {...params}
          key={params.id}
          primary={option.mainText || option.fullText}
          secondary={option.secondaryText}
        />
      )}
      ListboxProps={{
        sx: { padding: 0 },
      }}
      {...props}
    />
  );
})

export default AddressInput