import React from "react";
import { ControllerFieldState } from "react-hook-form";

import { TextField, TextFieldProps, Tooltip } from "@mui/material";

import { maxStopTime, minStopTime } from "@/components/Routes/CreateForm/schema";


export type CreateRouteFormStopTimeInputProps = TextFieldProps & {
  value: number,
  onChange: (value: number) => void,
  fieldState?: ControllerFieldState,
}

const CreateRouteFormStopTimeInput = React.forwardRef(function CreateRouteFormStopTimeInput({
  value,
  onChange,
  fieldState,
  ...props
}: CreateRouteFormStopTimeInputProps, ref) {
  return (
    <Tooltip
      title="The number of minutes to add for each stop"
      enterDelay={500}
      placement="bottom-start"
    >
      <TextField
        inputRef={ref}
        value={Number(value ?? 0).toString()}
        onChange={e => onChange(+(e.currentTarget.value || 0))}
        type="number"
        label="Stop Time"
        inputProps={{ required: true, min: minStopTime, max: maxStopTime }}
        error={fieldState?.invalid}
        helperText={fieldState?.error?.message}
        {...props}
      />
    </Tooltip>
  );
})

export default CreateRouteFormStopTimeInput