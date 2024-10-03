import { ArrowDownwardRounded, RouteRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Stack, Tooltip, Typography } from "@mui/material";

import { minStopCount } from "./schema";
import RoutesHeader from "@/components/Routes/Header";
import FormSubmit from "@/components/ui/FormSubmit";


export default function RoutesFormHeader({
  stops,
}: {
  stops: Record<string, unknown>[],
}) {
  return (
    <RoutesHeader>
      <div>
        <Typography
          component="h1"
          variant="h3"
        >
          Create a route
        </Typography>

        <Typography
          component="p"
          variant="caption"
        >
          Enter stops below
          <ArrowDownwardRounded fontSize="inherit" sx={{ verticalAlign: "middle" }} />
        </Typography>
      </div>

      <Stack spacing={1}>
        <FormSubmit
          renderSubmit={({ pending }) => (
            <Tooltip
              title={stops.length - 1 < minStopCount && `Please add at least ${minStopCount} stops`}
            >
              <span>
                <LoadingButton
                  type="submit"
                  size="medium"
                  variant="contained"
                  startIcon={<RouteRounded />}
                  loadingPosition="start"
                  loading={pending}
                  disabled={stops.length - 1 < minStopCount}
                >
                  Calculate route
                </LoadingButton>
              </span>
            </Tooltip>
          )}
        />
      </Stack>
    </RoutesHeader>
  );
}