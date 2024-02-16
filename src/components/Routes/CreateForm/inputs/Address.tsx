import React from "react";

import { TextField, TextFieldProps } from "@mui/material";

import { AddressSuggestion } from "@/hooks/useAddressSuggestions";


export type CreateRouteFormAddressProps = TextFieldProps;

const CreateRouteFormAddress = React.forwardRef<HTMLElement, CreateRouteFormAddressProps>(
  function AddressInputField(props, ref) {
    const value = props.value as AddressSuggestion | undefined;

    return (
      <TextField
        inputRef={ref}
        placeholder="Enter an address"
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
    )
  }
);


export default CreateRouteFormAddress;