import moment from "moment";
import "moment-duration-format";
import Link from "next/link";
import { Optional } from "utility-types";

import { Box, Button, Divider, Tooltip, Typography } from "@mui/material";

import DeleteRoute from "@/components/Routes/Delete";
import SaveRoute from "@/components/Routes/Save";
import { IRoute } from "@/models/Route";
import RoutesHeader from "@/components/Routes/Header";

const formatDuration = (duration: number) => moment.duration(duration, "minutes").format("d [day] h [hr] m [min]");


export type SummaryProps = {
  userId?: string | null,
  customerId?: string | null,
  route: Optional<IRoute, "_id"> | undefined | null,
  onEdit?: () => void,
  isSaved: boolean,
};

export default function Summary({
  userId,
  customerId,
  route,
  onEdit,
  isSaved,
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
          enterDelay={750}
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
          (route._id && isSaved)
            ? (
              <DeleteRoute
                route={route as IRoute} // Route has an id if this condition passes
                isSaved={isSaved}
              />
            )
            : (
              <SaveRoute
                route={route}
                isCustomer={!!customerId}
              />
            )
        )
      }

      {
        (route?.editUrl || onEdit)
          && (
            <Button
              variant="contained"
              size="medium"
              {...(route?.editUrl
                ? {
                  component: Link,
                  href: route.editUrl,
                }
                : {
                  onClick: () => onEdit!(),
                }
              )}
            >
              Edit route
            </Button>
          )
      }
    </RoutesHeader>
  );
}