"use client"; // Imports map hooks

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import moment from "moment";
import "moment-duration-format";

import { Box, Divider, ListItem, ListItemProps, Stack, Typography } from "@mui/material";

import { useMapFocus } from "@/components/ui/Map/hooks";
import { Polyline } from "@/components/ui/Map/Polyline";
import { TLeg } from "@/models/Route";
import { TStop } from "@/models/Stop";
import { parseCoordinate } from "@/utils/coords";
import { decodePolyline } from "@/utils/Radar/utils";

const formatDuration = (duration: number) => duration ? moment.duration(duration, "minutes").format("d [day] h [hr] m [min]") : "";


export type LegsListItemProps = ListItemProps & {
  index: number,
  stop: TStop,
  leg: TLeg | null,
  isFirst: boolean,
  isLast: boolean,
}

export default function LegsListItem({
  index,
  stop,
  leg,
  isFirst,
  isLast,
  ...props
}: LegsListItemProps) {
  const coord = parseCoordinate(stop.coordinates);
  const path = leg && decodePolyline(leg.geometry.polyline);
  useMapFocus([coord]);

  const stoppedDuration = formatDuration(!(isFirst || isLast) && stop.duration || 0);


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
      {
        path && (
          <Polyline
            path={path}
          />
        )
      }

      {
        coord && (
          <AdvancedMarker
            position={coord}
          >
            <Pin>
              {(index + 1).toString()}
            </Pin>
          </AdvancedMarker>
        )
      }

      <Box flex="1 1 auto">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          pl={1}
          flexWrap="wrap"
        >
          <Typography variant="h4" color="text.disabled">
            {(index + 1).toString()}
          </Typography>

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
            variant="caption"
            textAlign="right"
            color="text.disabled"
          >
            {stoppedDuration ? `+ ${stoppedDuration}` : ""}
          </Typography>
        </Stack>

        {
          leg && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              paddingTop={1}
            >
              <Divider
                orientation="horizontal"
                component="span"
                sx={{ flexGrow: 1 }}
              />

              <Typography
                component="p"
                variant="caption"
                textAlign="right"
              >
                {((leg.distance.value || 0) / 1000).toFixed(1)} kms

                <Divider
                  orientation="vertical"
                  component="span"
                  sx={{ marginX: 1 }}
                />

                {formatDuration(leg.duration.value || 0)}
              </Typography>
            </Stack>
          )
        }
      </Box>
    </ListItem>
  );
}