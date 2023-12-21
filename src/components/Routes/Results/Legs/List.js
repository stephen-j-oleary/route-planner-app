import { Box, List } from "@mui/material";

import LegsListItem from "./ListItem";
import StopIconsContainer from "@/components/Routes/StopIcons/Container";


export default function LegsList({ data, ...props }) {
  return (
    <Box
      sx={{ position: "relative" }}
      {...props}
    >
      <StopIconsContainer />

      <List disablePadding>
        {
          data.stops.map((stop, index) => (
            <LegsListItem
              key={index}
              data={{
                index,
                stop,
                leg: data.legs[index],
              }}
            />
          ))
        }
      </List>
    </Box>
  );
}