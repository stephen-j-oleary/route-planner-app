import { ListItemButton, ListItemButtonProps, ListItemText } from "@mui/material";


type AddressAutocompleteSuggestionProps =
  & ListItemButtonProps<"li">
  & {
    primary: string,
    secondary?: string,
  }

export default function AddressAutocompleteSuggestion({
  primary,
  secondary,
  ...props
}: AddressAutocompleteSuggestionProps) {
  return primary ? (
    <ListItemButton divider component="li" {...props}>
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
  ) : null;
}