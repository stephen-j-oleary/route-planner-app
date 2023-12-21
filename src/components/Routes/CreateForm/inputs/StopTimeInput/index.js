import { Controller } from "react-hook-form";

import { TextField, Tooltip } from "@mui/material";


export default function CreateRouteFormStopTimeInput({
  name,
  form,
  ...props
}) {
  const { control } = form;

  return (
    <Controller
      name={name}
      control={control}
      rules={{ min: 0 }}
      render={({ field: { ref, value, ...field } }) => (
        <Tooltip
          title="The number of minutes to add for each stop"
          enterDelay={500}
          placement="bottom-start"
        >
          <TextField
            inputRef={ref}
            value={value ?? ""}
            type="number"
            label="Stop Time"
            inputProps={{ min: 0 }}
            {...props}
            {...field}
          />
        </Tooltip>
      )}
    />
  );
}