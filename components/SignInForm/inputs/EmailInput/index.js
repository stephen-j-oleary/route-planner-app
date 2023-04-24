import { Controller } from "react-hook-form";

import CheckIcon from "@mui/icons-material/CheckRounded";
import { InputAdornment, TextField, Tooltip } from "@mui/material";


export default function SignInFormEmailInput({
  name,
  form,
  schema,
  isRegistered = false,
  ...props
}) {
  const { control } = form;

  const validate = value => schema
    .validateAt(name, { [name]: value })
    .then(() => true)
    .catch(err => err.errors[0]);


  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          inputRef={ref}
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          size="small"
          helperText={fieldState.error?.message}
          error={fieldState.invalid}
          FormHelperTextProps={{
            role: "alert",
            error: fieldState.invalid,
          }}
          {...props}
          InputProps={{
            ...props.InputProps,
            endAdornment: isRegistered && (
              <InputAdornment position="end">
                <Tooltip
                  title="Email is registered"
                  PopperProps={{ keepMounted: true }}
                >
                  <CheckIcon color="success" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          {...field}
        />
      )}
    />
  );
}