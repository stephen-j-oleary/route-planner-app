import Link from "next/link";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkIcon from "@mui/icons-material/BookmarkRounded";
import { Button, Divider, IconButton, Skeleton, Stack, Tooltip, Typography } from "@mui/material";

import { useCreateDatabaseRoute, useDeleteDatabaseRoute, useGetDatabaseRoutes } from "@/reactQuery/useDatabaseRoutes";
import durationToString from "@/utils/durationToString";


export default function Summary({ loading, error, data }) {
  const handleSaveRoute = useCreateDatabaseRoute();
  const handleUnsaveRoute = useDeleteDatabaseRoute();
  const savedRoutes = useGetDatabaseRoutes();

  const isSaved = savedRoutes.data?.find(r => r._id === data?._id)

  const travelDuration = data?.legs?.reduce((total, leg) => (total + leg.duration.value), 0);
  const stopDuration = data?.stops?.reduce((total, stop) => (total + (+stop.time || +data?.stopTime || 0) * 60), 0);
  const duration = travelDuration + stopDuration;
  const distance = data?.legs?.reduce((total, leg) => (total + leg.distance.value), 0);


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
          loading
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
            : error
            ? (
              <>
                <Typography
                  component="p"
                  variant="subtitle2"
                >
                  Route could not be loaded
                </Typography>

                <Typography
                  component="p"
                  variant="caption"
                >
                  An error occurred
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
                          {durationToString(travelDuration)}
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
                              + {durationToString(stopDuration)}
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
                    {(distance / 1000).toFixed(1)} kms

                    <Divider
                      orientation="vertical"
                      component="span"
                      sx={{ marginX: .5 }}
                    />

                    {durationToString(duration)}
                  </Typography>
                </Tooltip>
              </>
            )
        }
      </Stack>

      {
        !(loading || error) && (
          <Tooltip
            title={isSaved ? "Unsave Route" : "Save Route"}
            enterDelay={750}
          >
            <IconButton
              aria-label={isSaved ? "Unsave Route" : "Save Route"}
              onClick={
                () => isSaved
                  ? handleUnsaveRoute.mutate(data._id)
                  : handleSaveRoute.mutate(data)
              }
            >
              {
                isSaved
                  ? <BookmarkIcon />
                  : <BookmarkBorderIcon />
              }
            </IconButton>
          </Tooltip>
        )
      }

      {
        !loading
          && (
            <Button
              variant="contained"
              size="medium"
              component={Link}
              href={error ? "/routes/create" : data.editUrl}
            >
              {error ? "Create a route" : "Edit Route"}
            </Button>
          )
      }
    </Stack>
  );
}