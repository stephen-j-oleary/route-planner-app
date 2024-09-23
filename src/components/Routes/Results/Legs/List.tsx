import { Box, BoxProps, List } from "@mui/material";

import LegsListItem from "./ListItem";
import { IRoute } from "@/models/Route";


export type LegsListProps =
  & BoxProps
  & { route: Omit<IRoute, "_id"> };

export default function LegsList({
  route,
  ...props
}: LegsListProps) {
  return (
    <Box
      sx={{ position: "relative" }}
      {...props}
    >
      <List disablePadding>
        {
          route.stops.map((stop, i, arr) => (
            <LegsListItem
              key={i}
              index={i}
              stop={stop}
              leg={route.directions.legs[i]}
              isFirst={i === 0}
              isLast={i === arr.length - 1}
            />
          ))
        }
      </List>
    </Box>
  );
}