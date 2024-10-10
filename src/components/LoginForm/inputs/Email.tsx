import React from "react";
import { ControllerFieldState } from "react-hook-form";

import { TextField, TextFieldProps } from "@mui/material";


export type LoginFormEmailInputProps =
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value: string,
    onChange: (value: string) => void,
    fieldState?: ControllerFieldState,
  };

const LoginFormEmailInput = React.forwardRef(function LoginFormEmailInput({
  value,
  onChange,
  label = "Email",
  fieldState,
  ...props
}: LoginFormEmailInputProps, ref) {
  return (
    <TextField
      inputRef={ref}
      value={value ?? ""}
      onChange={e => onChange(e.currentTarget.value ?? "")}
      label={label}
      type="email"
      fullWidth
      variant="outlined"
      size="small"
      helperText={fieldState?.error?.message}
      error={fieldState?.invalid}
      FormHelperTextProps={{
        role: "alert",
        error: fieldState?.invalid,
      }}
      {...props}
    />
  );
});

export default LoginFormEmailInput;