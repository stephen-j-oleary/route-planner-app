import moment from "moment";
import "moment-duration-format";

import { Box, Divider, Tooltip, Typography } from "@mui/material";

import DeleteRoute from "@/components/Routes/Delete";
import RoutesHeader from "@/components/Routes/Header";
import SaveRoute from "@/components/Routes/Save";
import { IRoute } from "@/models/Route";

const formatDuration = (duration: number) => moment.duration(duration, "minutes").format("d [day] h [hr] m [min]");


export type SummaryProps = {
  userId?: string | null,
  route: (Omit<IRoute, "_id"> & { id?: string }) | undefined | null,
  isSaved: boolean,
  isSaveAllowed: boolean,
};

export default function Summary({
  userId,
  route,
  isSaved,
  isSaveAllowed,
}: SummaryProps) {
  /** The overall travel time in minutes */
  const travelDuration = route?.directions.duration.value || 0;
  /** The overall stop time in minutes */
  const stopDuration = route?.stops.reduce((sum, stop, i, arr) => sum + ((i > 0 && i < arr.length - 1) && stop.duration || 0), 0) || 0;
  /** The overall time in minutes */
  const duration = travelDuration + stopDuration;


  return (
    <RoutesHeader>
      <Box>
        <Typography
          component="h1"
          variant="h3"
        >
          Route results
        </Typography>

        <Tooltip
          placement="bottom-start"
          title={
            <div>
              <Typography component="p">
                <Typography
                  component="span"
                  variant="body2"
                  fontWeight={600}
                >
                  {formatDuration(travelDuration)}
                </Typography>

                <Typography
                  component="span"
                  variant="body2"
                  paddingLeft={1}
                >
                  Driving
                </Typography>
              </Typography>

              {
                stopDuration > 0 && (
                  <Typography component="p">
                    <Typography
                      component="span"
                      variant="body2"
                      fontWeight={600}
                    >
                      + {formatDuration(stopDuration)}
                    </Typography>

                    <Typography
                      component="span"
                      variant="body2"
                      paddingLeft={1}
                    >
                      Stopped
                    </Typography>
                  </Typography>
                )
              }
            </div>
          }
        >
          <Typography
            component="p"
            variant="caption"
          >
            {
              route
                && `${(route.directions.distance.value / 1000).toFixed(1)} kms`
            }

            <Divider
              orientation="vertical"
              component="span"
              sx={{ marginX: .5 }}
            />

            {formatDuration(duration)}
          </Typography>
        </Tooltip>
      </Box>

      {
        (route && userId) && (
          (route.id && isSaved)
            ? (
              <DeleteRoute
                route={route as { id: string }} // Route has an id if this condition passes
                isSaved={isSaved}
              />
            )
            : (
              <SaveRoute
                route={route}
                isSaveAllowed={isSaveAllowed}
              />
            )
        )
      }
    </RoutesHeader>
  );
}