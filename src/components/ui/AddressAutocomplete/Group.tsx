import { List, ListProps } from "@mui/material";


type AddressAutocompleteGroupProps =
  & ListProps
  & { group: string };

export default function AddressAutocompleteGroup({
  group,
  children,
  ...props
}: AddressAutocompleteGroupProps) {
  const dividerStyles = {
    borderColor: "divider",
    borderStyle: "solid",
    borderWidth: 0,
    borderBottomWidth: ".5rem",
  };

  return (
    <List
      disablePadding
      sx={{
        margin: 0,
        ...(group !== "main" ? dividerStyles : {}),
      }}
      {...props}
    >
      {children}
    </List>
  );
}