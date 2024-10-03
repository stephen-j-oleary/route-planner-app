import React from "react";

import { TextField, TextFieldProps } from "@mui/material";

import { AddressAutocompleteOption } from "@/components/ui/AddressAutocomplete/hooks";


export type CreateRouteFormAddressProps =
  & Omit<TextFieldProps, "ref" | "value">
  & {
    ref: React.Ref<HTMLElement>,
    value?: AddressAutocompleteOption | undefined,
  };

export default function CreateRouteFormAddress({
  ref,
  ...props
}: CreateRouteFormAddressProps) {
  const { value } = props;

  return (
    <TextField
      inputRef={ref}
      placeholder="Add a stop"
      label={value?.mainText !== value?.fullText ? value?.mainText : ""}
      {...props}
      inputProps={{
        ...props.inputProps,
        style: {
          ...props.inputProps?.style,
          textOverflow: "unset !important",
        },
      }}
    />
  );
}