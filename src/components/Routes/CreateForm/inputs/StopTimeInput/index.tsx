// Don't use "use client" here. This component is passed non-serializable props so shouldn't be the client-server boundary
import "client-only";

import { TextField, TextFieldProps, Tooltip } from "@mui/material";

import { maxStopTime, minStopTime } from "@/components/Routes/CreateForm/schema";


export type CreateRouteFormStopTimeInputProps =
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value: number,
    onChange: (value: number) => void,
  };

export default function CreateRouteFormStopTimeInput({
  ref,
  value,
  onChange,
  ...props
}: CreateRouteFormStopTimeInputProps) {
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
        slotProps={{
          htmlInput: {
            required: true,
            min: minStopTime,
            max: maxStopTime,
          },
        }}
        {...props}
      />
    </Tooltip>
  );
}