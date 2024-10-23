import React from "react";
import ReactDOM from "react-dom";

import { LoadingButton } from "@mui/lab";
import { ListItemButton, ListItemButtonProps, ListItemText } from "@mui/material";

import { AddressAutocompleteOption } from "./hooks";
import { useAddressAutocompleteContext } from "./Provider";


export type AddressAutocompleteSuggestionProps =
  & Omit<ListItemButtonProps<"li">, "onChange">
  & {
    fullText?: string,
    mainText?: string,
    secondaryText?: string,
    icon?: React.ReactNode,
    isQuick?: boolean,
    isPending?: boolean,
    onClick?: React.EventHandler<React.SyntheticEvent>,
    onChange?: (value: AddressAutocompleteOption) => void,
  };

export default function AddressAutocompleteSuggestion({
  fullText,
  mainText,
  secondaryText,
  icon,
  isQuick = false,
  isPending = false,
  onClick,
  onChange,
  ...props
}: AddressAutocompleteSuggestionProps) {
  const { quickSuggestionsRef } = useAddressAutocompleteContext();

  if (!mainText && !fullText) return null;

  if (isQuick && quickSuggestionsRef.current) {
    return ReactDOM.createPortal(
      <LoadingButton
        size="medium"
        variant="outlined"
        startIcon={icon}
        loadingPosition="start"
        loading={isPending}
        onClick={onClick}
      >
        {mainText || fullText}
      </LoadingButton>,
      quickSuggestionsRef.current,
    );
  }

  return (
    <ListItemButton
      divider
      component="li"
      onClick={onClick}
      {...props}
    >
      <ListItemText
        primary={mainText || fullText}
        secondary={secondaryText}
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