
import { get } from "lodash";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import ErrorTooltip from "../ErrorTooltip";
import mergeRefs from "../../shared/hooks/mergeRefs";
import { mergeProps } from "@react-aria/utils";


const Input = forwardRef(function Input({
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
        {...mergeProps(props, formProps)}
        ref={mergeRefs(ref, forwardedRef)}
      />
    </ErrorTooltip>
  );
})

export default Input;
