import { ReactNode } from "react";

import { ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from "@mui/material";


export type AddressAutocompleteSuggestionProps =
  & ListItemButtonProps<"li">
  & {
    fullText?: string,
    mainText?: string,
    secondaryText?: string,
    icon?: ReactNode,
  };

export default function AddressAutocompleteSuggestion({
  fullText,
  mainText,
  secondaryText,
  icon,
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