import React from "react";
import { ControllerFieldState } from "react-hook-form";

import { TextField, TextFieldProps } from "@mui/material";


export type CreateRouteFormSelectStopInputProps = TextFieldProps & {
  value: number,
  watchStops: { fullText: string, mainText?: string }[],
  fieldState?: ControllerFieldState,
}

const CreateRouteFormSelectStopInput = React.forwardRef(function CreateRouteFormSelectStopInput({
  value,
  onChange,
  watchStops,
  fieldState,
  ...props
}: CreateRouteFormSelectStopInputProps, ref) {
  return (
    <TextField
      inputRef={ref}
      select
      SelectProps={{ native: true }}
      error={fieldState?.invalid}
      helperText={fieldState?.error?.message}
      {...props}
    >
      {
        watchStops.map((item, i) => (
          <option key={i} value={i}>
            {item.mainText || item.fullText}
          </option>
        ))
      }
    </TextField>
  );
})

export default CreateRouteFormSelectStopInput