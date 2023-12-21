import React from "react";
import { ControllerFieldState } from "react-hook-form";

import { TextField, TextFieldProps } from "@mui/material";


export type LoginFormEmailInputProps = TextFieldProps & {
  fieldState?: ControllerFieldState,
};

const LoginFormEmailInput = React.forwardRef(function LoginFormEmailInput({
  value,
  label = "Email",
  fieldState,
  ...props
}: LoginFormEmailInputProps, ref) {
  return (
    <TextField
      inputRef={ref}
      value={value ?? ""}
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