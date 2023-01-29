
import { get } from "lodash";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import ErrorTooltip from "../ErrorTooltip";
import { TextField } from "@mui/material";
import { mergeProps, mergeRefs } from "@react-aria/utils";

export function SelectOption({ label, ...props }) {
  return (
    <option {...props}>
      {label}
    </option>
  );
}

const Select = forwardRef(function Select({
  name,
  onBlur,
  onChange,
  options = {},
  ...props
}, forwardedRef) {
  const { register, formState: { errors } } = useFormContext();
  const error = get(errors, name);
  const errorMessage = error && (error?.message || `Validation Error: ${error?.type}`);

  const opts = {
    onBlur,
    onChange,
    ...options
  };
  const { ref, ...formProps } = name
    ? register(name, opts)
    : {};

  return (
    <ErrorTooltip error={errorMessage}>
      <TextField
        size="small"
        error={!!error}
        select
        SelectProps={{ native: true }}
        {...mergeProps(props, formProps)}
        ref={mergeRefs(ref, forwardedRef)}
      />
    </ErrorTooltip>
  );
})

export default Object.assign(Select, {
  Option: SelectOption
})
