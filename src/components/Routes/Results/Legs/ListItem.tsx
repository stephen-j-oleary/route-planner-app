import moment from "moment";
import "moment-duration-format";

import { Box, Divider, ListItem, ListItemProps, Stack, Typography } from "@mui/material";

import StopIcon from "@/components/Routes/StopIcons/Item";
import { Leg, Stop } from "@/models/Route";

const formatDuration = (duration: number) => moment.duration(duration, "minutes").format("d [day] h [hr] m [min]");


export type LegsListItemProps = ListItemProps & {
  index: number,
  stop: Stop,
  leg: Leg,
}

export default function LegsListItem({
  index,
  stop,
  leg,
  ...props
}: LegsListItemProps) {
  return (
    <ListItem
      dense
      sx={{
        gap: 2,
        backgroundColor: "background.paper",
        paddingX: 0,
      }}
      {...props}
    >
      <StopIcon>
        {index + 1}
      </StopIcon>

      <Box flex="1 1 auto">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          flexWrap="wrap"
        >
          <Typography
            component="p"
            variant="body1"
            fontWeight={500}
            sx={theme => theme.limitLines(1)}
            flex={1}
          >
            {stop.fullText}
          </Typography>

          <Typography
            variant="body2"
            textAlign="right"
          >
            {formatDuration(stop.duration || 0)}
          </Typography>
        </Stack>

        {
          leg && (
            <Typography
              component="p"
              variant="body2"
              textAlign="right"
              paddingTop={1}
            >
              {((leg.distance || 0) / 1000).toFixed(1)} kms

              <Divider
                orientation="vertical"
                component="span"
                sx={{ marginX: 1 }}
              />

              {formatDuration(leg.duration || 0)}
            </Typography>
          )
        }
      </Box>
    </ListItem>
  );
}