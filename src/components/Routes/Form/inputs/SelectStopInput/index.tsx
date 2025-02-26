// Don't use "use client" here. This component is passed non-serializable props so shouldn't be the client-server boundary
import "client-only";

import { TextField, TextFieldProps } from "@mui/material";

import { TStop } from "@/models/Stop";


export type CreateRouteFormSelectStopInputProps =
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value: number,
    onChange: (value: number) => void,
    watchStops: Partial<TStop>[],
  };

export default function CreateRouteFormSelectStopInput({
  ref,
  value,
  onChange,
  watchStops,
  ...props
}: CreateRouteFormSelectStopInputProps) {
  return (
    <TextField
      inputRef={ref}
      select
      value={value}
      onChange={e => onChange(+(e.currentTarget.value || 0))}
      slotProps={{
        select: { native: true },
        htmlInput: { required: true },
        inputLabel: { shrink: true },
      }}
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
}