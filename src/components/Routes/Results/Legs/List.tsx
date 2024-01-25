import { Box, BoxProps, List } from "@mui/material";

import LegsListItem from "./ListItem";
import StopIconsContainer from "@/components/Routes/StopIcons/Container";
import { IRoute } from "@/models/Route";


export type LegsListProps =
  & BoxProps
  & { route: IRoute };

export default function LegsList({
  route,
  ...props
}: LegsListProps) {
  return (
    <Box
      sx={{ position: "relative" }}
      {...props}
    >
      <StopIconsContainer />

      <List disablePadding>
        {
          route.stops.map((stop, i) => (
            <LegsListItem
              key={i}
              index={i}
              stop={stop}
              leg={route.legs[i]}
            />
          ))
        }
      </List>
    </Box>
  );
}