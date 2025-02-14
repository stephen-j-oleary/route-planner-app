import { Box, BoxProps, List, Typography } from "@mui/material";

import type { TRouteForm } from "../hooks";
import { minStopCount } from "../schema";
import StopsListItem from "@/components/Routes/Form/Stops/ListItem";


export type StopsListProps =
  & BoxProps
  & { form: TRouteForm };

export default function StopsList({
  form,
  ...props
}: StopsListProps) {
  const isOrigin = (index: number) => index === +(form.origin || 0);
  const isDestination = (index: number) => index === +(form.destination || 0);
  const isAdd = (index: number) => index === form.stops.length - 1;

  return (
    <Box
      sx={{ position: "relative" }}
      {...props}
    >
      <List disablePadding>
        {
          form.stops.map((field, index) => (
            <StopsListItem
              key={index}
              form={form}
              name={`stops.${index}`}
              value={field}
              stopIndex={index}
              iconProps={{
                isOrigin: isOrigin(index),
                isDestination: isDestination(index),
                isAdd: isAdd(index),
              }}
            />
          ))
        }
      </List>

      <Typography variant="caption" color="text.secondary">
        Please add at least {minStopCount} stops
      </Typography>
    </Box>
  );
}