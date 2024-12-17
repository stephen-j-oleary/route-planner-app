import "client-only";

import { TextField, TextFieldProps } from "@mui/material";

import { Stop } from "@/models/Route";


export type CreateRouteFormSelectStopInputProps =
  & Omit<TextFieldProps, "value" | "onChange">
  & {
    value: number,
    onChange: (value: number) => void,
    watchStops: Partial<Stop>[],
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