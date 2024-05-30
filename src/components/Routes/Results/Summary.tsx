import moment from "moment";
import "moment-duration-format";
import Link from "next/link";

import { Button, Divider, Stack, Tooltip, Typography } from "@mui/material";

import DeleteRoute from "@/components/Routes/Delete";
import SaveRoute from "@/components/Routes/Save";
import { IRoute } from "@/models/Route";

const formatDuration = (duration: number) => moment.duration(duration, "minutes").format("d [day] h [hr] m [min]");


export type SummaryProps = {
  route: IRoute | undefined | null,
  isSaved: boolean,
}

export default function Summary({
  route,
  isSaved,
}: SummaryProps) {
  /** The overall travel time in minutes */
  const travelDuration = route?.duration || 0;
  /** The overall stop time in minutes */
  const stopDuration = route?.stops.reduce((sum, stop) => sum + (stop.duration || 0), 0) || 0;
  /** The overall time in minutes */
  const duration = travelDuration + stopDuration;


  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      padding={2}
      sx={{
        borderBottom: "1px solid",
        borderBottomColor: "grey.200",
        "& > div:first-of-type": { flex: 1 },
      }}
    >
      <Stack alignItems="flex-start">
        <Typography
          component="p"
          variant="subtitle2"
        >
          Total Trip:
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
          enterDelay={750}
        >
          <Typography
            component="p"
            variant="caption"
          >
            {
              route
                && `${(route.distance / 1000).toFixed(1)} kms`
            }

            <Divider
              orientation="vertical"
              component="span"
              sx={{ marginX: .5 }}
            />

            {formatDuration(duration)}
          </Typography>
        </Tooltip>
      </Stack>

      {
        route && (
          isSaved
            ? <DeleteRoute route={route} isSaved={isSaved} />
            : <SaveRoute route={route} />
        )
      }

      {
        route?.editUrl && (
          <Button
            variant="contained"
            size="medium"
            component={Link}
            href={route.editUrl}
          >
            Edit route
          </Button>
        )
      }
    </Stack>
  );
}