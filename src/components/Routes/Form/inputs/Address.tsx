// Don't use "use client" here. This component is passed non-serializable props so shouldn't be the client-server boundary
import "client-only";

import { TextField, TextFieldProps } from "@mui/material";

import { AddressAutocompleteOption } from "@/components/ui/AddressAutocomplete/hooks";


export type CreateRouteFormAddressProps =
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value?: AddressAutocompleteOption | undefined,
    onChange?: (v: AddressAutocompleteOption) => void,
  };

export default function CreateRouteFormAddress({
  value,
  onChange,
  ...props
}: CreateRouteFormAddressProps) {
  return (
    <TextField
      value={value?.fullText ?? ""}
      onChange={e => onChange?.({ fullText: e.currentTarget.value ?? "", coordinates: "" })}
      label={value?.mainText !== value?.fullText ? value?.mainText : ""}
      {...props}
      slotProps={{
        ...props.slotProps,
        htmlInput: {
          ...props.slotProps?.htmlInput,
          autoCapitalize: "words",
          style: { textOverflow: "unset !important" },
        },
      }}
    />
  );
}