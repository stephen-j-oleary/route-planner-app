import { Controller } from "react-hook-form";

import { TextField } from "@mui/material";


export default function CreateRouteFormSelectStopInput({
  name,
  form,
  stops,
  ...props
}) {
  const { control } = form;


  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          inputRef={ref}
          select
          SelectProps={{ native: true }}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          {...props}
          {...field}
        >
          {
            stops.map((item, i) => (
              <option key={i} value={i}>
                {item.value}
              </option>
            ))
          }
        </TextField>
      )}
    />
  );
}