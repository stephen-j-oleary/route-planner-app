import "client-only";

import { TextField, TextFieldProps } from "@mui/material";

import { AddressAutocompleteOption } from "@/components/ui/AddressAutocomplete/hooks";


export type CreateRouteFormAddressProps =
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value?: Partial<AddressAutocompleteOption> | undefined,
    onChange?: (v: Partial<AddressAutocompleteOption>) => void,
  };

export default function CreateRouteFormAddress({
  value,
  onChange,
  ...props
}: CreateRouteFormAddressProps) {
  return (
    <TextField
      value={value?.fullText ?? ""}
      onChange={e => onChange?.({ fullText: e.currentTarget.value ?? "" })}
      label={value?.mainText !== value?.fullText ? value?.mainText : ""}
      {...props}
      slotProps={{
        ...props.slotProps,
        htmlInput: {
          ...props.slotProps?.htmlInput,
          style: { textOverflow: "unset !important" },
        },
      }}
    />
  );
}