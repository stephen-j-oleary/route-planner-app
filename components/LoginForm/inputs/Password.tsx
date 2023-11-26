import React, { useState } from "react";
import { ControllerFieldState } from "react-hook-form";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, TextField, TextFieldProps, Tooltip, Typography, TypographyProps } from "@mui/material";


type ErrorHelperTextProps = TypographyProps & {
  error?: string,
  isNew?: boolean,
};

function ErrorHelperText({
  error = "",
  isNew = false,
  ...props
}: ErrorHelperTextProps) {
  const errorMatches = (regex: RegExp) => regex.test(error);

  const lines = isNew
    ? [
      [errorMatches(/required|at least \d+ characters/), "Must be at least 8 characters long"],
      [errorMatches(/at least \d+ uppercase letter/), "Must include at least 1 uppercase"],
      [errorMatches(/at least \d+ lowercase letter/), "Must include at least 1 lowercase"],
      [errorMatches(/at least \d+ number/), "Must include at least 1 number"],
    ]
    : [
      [errorMatches(/at least \d+ number/), "Please enter a password"]
    ];


  return (
    <>
      {
        lines
          .filter(line => isNew || line[0])
          .map((line, i) => (
            <Typography
              key={i}
              component="span"
              color={line[0] ? "error" : "text.secondary"}
              {...props}
              sx={{
                display: "block",
                fontSize: ".9rem",
                ...props.sx,
              }}
            >
              {line[1]}
            </Typography>
          ))
      }
    </>
  );
}


export type LoginFormPasswordInputProps = TextFieldProps & {
  fieldState?: ControllerFieldState,
  isNew?: boolean,
};

const LoginFormPasswordInput = React.forwardRef(function LoginFormPasswordInput({
  value,
  isNew = false,
  label = isNew ? "Create a Password" : "Password",
  fieldState,
  ...props
}: LoginFormPasswordInputProps, ref) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      inputRef={ref}
      value={value ?? ""}
      label={label}
      type={showPassword ? "text" : "password"}
      autoComplete={isNew ? "new-password" : "current-password"}
      fullWidth
      variant="outlined"
      size="small"
      error={fieldState?.invalid}
      helperText={
        <ErrorHelperText
          error={fieldState?.error?.message}
          isNew={isNew}
        />
      }
      {...props}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={showPassword ? "Hide password" : "Show password"}>
              <IconButton
                aria-label="Show password"
                role="switch"
                aria-checked={showPassword}
                onClick={() => setShowPassword(v => !v)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
});

export default LoginFormPasswordInput;