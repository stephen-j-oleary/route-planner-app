import { merge } from "lodash";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useMutation } from "react-query";

import WarningIcon from "@mui/icons-material/WarningRounded";
import { Autocomplete, Button, CircularProgress, InputAdornment, List, ListItem, ListItemButton, ListItemText, Skeleton, Stack, styled, TextField, Tooltip, Typography } from "@mui/material";

import useAddressSuggestions from "@/hooks/useAddressSuggestions";


const SuggestionGroup = styled(List, {
  shouldForwardProp: prop => prop !== "group",
})(({ theme, group }) => (
  group === "quickSuggestions"
    ? {
      display: "flex",
      spacing: theme.spacing(1),
      padding: theme.spacing(1),
      overflow: "scroll hidden",
      borderBottom: 1,
      borderColor: "divider",
      ...theme.hideScrollbar,
    }
    : {}
));
SuggestionGroup.defaultProps = {
  disablePadding: true,
};

function QuickSuggestion({
  variant = "outlined",
  isPlaceholder = false,
  primary,
  secondary,
  ...props
}) {
  return (
    <Button
      size="small"
      variant={variant}
      {...props}
    >
      <Typography
        textAlign="left"
      >
        <Typography
          component="span"
          variant="subtitle2"
          sx={{ display: "block" }}
        >
          {
            isPlaceholder
              ? <Skeleton width="80px" />
              : primary
          }
        </Typography>
        <Typography
          component="span"
          variant="caption"
          sx={{ display: "block" }}
        >
          {
            isPlaceholder
              ? <Skeleton width="70px" />
              : secondary
          }
        </Typography>
      </Typography>
    </Button>
  );
}

function ListSuggestion({
  variant: _variant,
  isPlaceholder = false,
  primary,
  secondary,
  ...props
}) {
  return (
    <ListItemButton {...props}>
      <ListItemText
        primary={
          isPlaceholder
            ? <Skeleton />
            : primary
        }
        secondary={
          isPlaceholder
            ? <Skeleton />
            : secondary
        }
        primaryTypographyProps={{
          variant: "subtitle2",
          sx: theme => theme.typography.limitLines(1),
        }}
        secondaryTypographyProps={{
          variant: "caption",
          sx: theme => theme.typography.limitLines(1),
        }}
        sx={{ margin: 0 }}
      />
    </ListItemButton>
  );
}

function Suggestion({
  group,
  ...props
}) {
  const SuggestionItem = (group === "quickSuggestions")
    ? QuickSuggestion
    : ListSuggestion;

  return (
    <ListItem disablePadding>
      <SuggestionItem {...props} />
    </ListItem>
  );
}


export default function AddressInput({
  name,
  form,
  onSelect,
  textFieldProps = {},
  ...props
}) {
  const { control, watch } = form;

  const [open, setOpen] = useState(false);

  const handleSelect = useMutation(
    async suggestion => {
      const value = await suggestion.getValue();
      onSelect({ ...suggestion, value });
    }
  );

  const addressSuggestions = useAddressSuggestions({
    query: watch(name),
    show: open,
  });


  const SelectStateAdornment = () => (
    <Stack direction="row" spacing={.5}>
      {
        textFieldProps.InputProps?.endAdornment
      }

      {
        handleSelect.isLoading && (
          <InputAdornment position="end">
            <CircularProgress size="1rem" />
          </InputAdornment>
        )
      }

      {
        handleSelect.isError && (
          <Tooltip
            placement="bottom"
            title={handleSelect.error}
          >
            <InputAdornment
              aria-label={handleSelect.error}
              position="end"
            >
              <WarningIcon
                size="1rem"
                sx={{ color: theme => theme.palette.error.dark }}
              />
            </InputAdornment>
          </Tooltip>
        )
      }
    </Stack>
  );


  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, value, onChange, ...field } }) => (
        <Autocomplete
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          autoHighlight
          openOnFocus
          blurOnSelect
          freeSolo
          disableClearable
          disableListWrap
          inputValue={value}
          onInputChange={(_e, data) => onChange(data)}
          options={flattenSuggestionGroups(addressSuggestions)}
          groupBy={option => option.group}
          getOptionLabel={option => option.primary || ""}
          filterOptions={option => option}
          renderInput={params => (
            <TextField
              inputRef={ref}
              placeholder={handleSelect.isLoading ? "Loading..." : "Enter an address"}
              {...merge(
                params,
                textFieldProps,
                {
                  inputProps: {
                    sx: { textOverflow: "unset !important" },
                  },
                  InputProps: {
                    endAdornment: <SelectStateAdornment />,
                  },
                }
              )}
              {...field}
            />
          )}
          renderGroup={params => (
            <SuggestionGroup {...params} />
          )}
          renderOption={(params, option) => (
            <Suggestion
              {...params}
              key={params.id}
              onClick={() => handleSelect.mutate(option)}
              {...option.getProps()}
            />
          )}
          ListboxProps={{
            sx: { padding: 0 },
          }}
          {...props}
        />
      )}
    />
  );
}

function flattenSuggestionGroups(groups) {
  return Object.entries(groups).flatMap(([group, items = []]) => {
    items.forEach(item => {
      item.group = group;
    });
    return items;
  });
}