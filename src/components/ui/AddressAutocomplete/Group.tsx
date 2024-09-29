import React from "react";

import { List, ListProps, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useAddressAutocompleteContext } from "./Provider";
import { AddressAutocompleteOption } from "@/components/ui/AddressAutocomplete/hooks";


type AddressAutocompleteGroupProps =
  & Omit<ListProps, "onChange">
  & {
    ref?: React.Ref<HTMLUListElement>,
    onChange: (option: Partial<AddressAutocompleteOption> | string) => void,
  }

export default function AddressAutocompleteGroup({
  ref,
  onChange,
  children,
  ...props
}: AddressAutocompleteGroupProps) {
  const { quickSuggestionsRef } = useAddressAutocompleteContext();
  const theme = useTheme();

  return (
    <List
      ref={ref}
      disablePadding
      sx={{ margin: 0 }}
      {...props}
    >
      <Stack
        spacing={1}
        padding={1}
        sx={{
          overflow: "scroll hidden",
          borderColor: "divider",
          borderStyle: "solid",
          borderWidth: 0,
          borderBottomWidth: ".5rem",
          ...theme.hideScrollbar,
        }}
      >
        <Stack
          ref={quickSuggestionsRef}
          direction="row"
          spacing={1}
        />
      </Stack>

      {children}
    </List>
  );
}