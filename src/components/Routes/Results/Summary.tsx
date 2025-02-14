import moment from "moment";
import "moment-duration-format";

import { Divider, Tooltip, Typography } from "@mui/material";

import RoutesHeader from "@/components/Routes/Header";
import { TRoute } from "@/models/Route";

const formatDuration = (duration: number) => moment.duration(duration, "minutes").format("d [day] h [hr] m [min]");


export type SummaryProps = {
  route: (Omit<TRoute, "_id"> & { id?: string }) | undefined | null,
};

export default function Summary({
  route,
}: SummaryProps) {
  /** The overall travel time in minutes */
  const travelDuration = route?.directions.duration.value || 0;
  /** The overall stop time in minutes */
  const stopDuration = route?.stops.reduce((sum, stop, i, arr) => sum + ((i > 0 && i < arr.length - 1) && stop.duration || 0), 0) || 0;
  /** The overall time in minutes */
  const duration = travelDuration + stopDuration;


  return (
    <RoutesHeader
      title="Route results"
      subtitle={
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
      }
    />
  );
}