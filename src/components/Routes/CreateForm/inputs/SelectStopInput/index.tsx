import React from "react";
import { ControllerFieldState } from "react-hook-form";

import { TextField, TextFieldProps } from "@mui/material";

import { Stop } from "@/models/Route";


export type CreateRouteFormSelectStopInputProps = TextFieldProps & {
  value: number,
  onChange: (value: number) => void,
  watchStops: Pick<Stop, "mainText" | "fullText">[],
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
      onChange={e => onChange(+(e.currentTarget.value || 0))}
      inputProps={{ required: true }}
      {...props}
    >
      {
        watchStops
          .filter(item => item.fullText)
          .map((item, i) => (
            <option key={i} value={i}>
              {item.mainText || item.fullText || `Stop ${i + 1}`}
            </option>
          ))
      }
    </TextField>
  );
})

export default CreateRouteFormSelectStopInput