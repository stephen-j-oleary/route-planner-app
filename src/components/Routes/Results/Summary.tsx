import moment from "moment";
import "moment-duration-format";
import Link from "next/link";
import { UseQueryResult } from "react-query";

import { Button, Divider, Skeleton, Stack, Tooltip, Typography } from "@mui/material";

import DeleteRoute from "@/components/Routes/Delete";
import SaveRoute from "@/components/Routes/Save";
import { IRoute } from "@/models/Route";
import { useGetRouteById } from "@/reactQuery/useRoutes";

const formatDuration = (duration: number) => moment.duration(duration, "minutes").format("d [day] h [hr] m [min]");


export type SummaryProps = {
  routeQuery: UseQueryResult<IRoute | undefined | null>,
}

export default function Summary({ routeQuery }: SummaryProps) {
  const isSaved = useGetRouteById(routeQuery.data?._id, {
    retry: false,
    select: data => !!data,
  });

  /** The overall travel time in minutes */
  const travelDuration = routeQuery.data?.duration || 0;
  /** The overall stop time in minutes */
  const stopDuration = routeQuery.data?.stops.reduce((sum, stop) => sum + (stop.duration || 0), 0) || 0;
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
        {
          (routeQuery.isIdle || routeQuery.isLoading)
            ? (
              <>
                <Typography
                  component="p"
                  variant="subtitle2"
                  width="50%"
                >
                  <Skeleton />
                </Typography>

                <Typography
                  component="p"
                  variant="caption"
                  width="30%"
                >
                  <Skeleton />
                </Typography>
              </>
            )
            : routeQuery.isError
            ? (
              <>
                <Typography
                  component="p"
                  variant="subtitle2"
                >
                  Route could not be found
                </Typography>

                <Typography
                  component="p"
                  variant="caption"
                >
                  Please try again
                </Typography>
              </>
            )
            : (
              <>
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
                      routeQuery.data
                        && `${(routeQuery.data.distance / 1000).toFixed(1)} kms`
                    }

                    <Divider
                      orientation="vertical"
                      component="span"
                      sx={{ marginX: .5 }}
                    />

                    {formatDuration(duration)}
                  </Typography>
                </Tooltip>
              </>
            )
        }
      </Stack>

      {
        routeQuery.data && (
          isSaved.data
            ? (
              <DeleteRoute
                route={routeQuery.data}
                disabled={!isSaved.isFetched}
              />
            )
            : (
              <SaveRoute
                route={routeQuery.data}
                disabled={!isSaved.isFetched}
              />
            )
        )
      }

      {
        routeQuery.isError && (
          <Button
            variant="contained"
            size="medium"
            component={Link}
            href="/routes/create"
          >
            Create a route
          </Button>
        )
      }

      {
        routeQuery.data?.editUrl && (
          <Button
            variant="contained"
            size="medium"
            component={Link}
            href={routeQuery.data.editUrl}
          >
            Edit route
          </Button>
        )
      }
    </Stack>
  );
}