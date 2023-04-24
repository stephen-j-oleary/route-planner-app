import { useState } from "react";
import { Controller } from "react-hook-form";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";


function ErrorHelperText({
  error = "",
  isNew = false,
  ...props
}) {
  const errorIncludes = keyword => error.split(",").includes(keyword);

  const lines = isNew
    ? [
      [errorIncludes("length"), "Must be at least 8 characters long"],
      [errorIncludes("uppercase"), "Must include at least 1 uppercase"],
      [errorIncludes("lowercase"), "Must include at least 1 lowercase"],
      [errorIncludes("number"), "Must include at least 1 number"],
    ]
    : [
      [errorIncludes("length"), "This field is required"]
    ];


  return lines
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
    ));
}


export default function SingInFormPasswordInput({
  name,
  form,
  schema,
  isNew = false,
  ...props
}) {
  const { control } = form;

  const [showPassword, setShowPassword] = useState(false);

  const validate = value => schema
    .validateAt(name, { [name]: value }, { abortEarly: false })
    .then(() => true)
    .catch(err => err.errors.map(e => {
      if (/required|at least \d+ characters/.test(e)) return "length";
      if (/at least \d+ uppercase letter/.test(e)) return "uppercase";
      if (/at least \d+ lowercase letter/.test(e)) return "lowercase";
      if (/at least \d+ number/.test(e)) return "number";
      return e;
    }).join(","));

  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          inputRef={ref}
          label={isNew ? "Create a Password" : "Password"}
          type={showPassword ? "text" : "password"}
          autoComplete={isNew ? "new-password" : "current-password"}
          fullWidth
          variant="outlined"
          size="small"
          error={fieldState.invalid}
          helperText={
            <ErrorHelperText
              error={fieldState.error?.message}
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
            )
          }}
          {...field}
        />
      )}
    />
  );
}