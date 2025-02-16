import { ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from "@mui/material";

import { AddressAutocompleteOption } from "./hooks";


export type AddressAutocompleteSuggestionProps =
  & Omit<ListItemButtonProps<"li">, "action">
  & AddressAutocompleteOption;

export default function AddressAutocompleteSuggestion({
  fullText,
  mainText,
  secondaryText,
  icon,
  action,
  ...props
}: AddressAutocompleteSuggestionProps) {
  if (!mainText && !fullText) return null;

  return (
    <ListItemButton
      divider
      component="li"
      {...props}
    >
      {
        icon && (
          <ListItemIcon
            sx={{ minWidth: 0, pr: 1 }}
          >
            {icon}
          </ListItemIcon>
        )
      }

      <ListItemText
        primary={mainText || fullText}
        secondary={secondaryText}
        slotProps={{
          primary: {
            variant: "subtitle2",
            sx: theme => theme.limitLines(1),
          },
          secondary: {
            variant: "caption",
            sx: theme => theme.limitLines(1),
          },
        }}
        sx={{ margin: 0 }}
      />
    </ListItemButton>
  );
}