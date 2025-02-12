import { Box, Stack } from "@mui/material";

import RouteResultsFooter from "./Footer";
import LegsList from "./Legs/List";
import Summary from "./Summary";
import { IRoute } from "@/models/Route";


export type RouteResultsProps = {
  route: Omit<IRoute, "_id"> | undefined | null,
  onEdit?: () => void,
  isSaved?: boolean,
  isSaveAllowed: boolean,
};

export default function RouteResults({
  route,
  onEdit,
  isSaved = false,
  isSaveAllowed,
  ...props
}: RouteResultsProps) {
  return (
    <Box {...props}>
      <Summary
        route={route}
        isSaved={isSaved}
        isSaveAllowed={isSaveAllowed}
      />

      {
        route && (
          <Stack
            flex={1}
            spacing={4}
            alignItems="flex-start"
            my={2}
          >
            <LegsList
              route={route}
            />
          </Stack>
        )
      }

      <RouteResultsFooter
        route={route}
        onEdit={onEdit}
      />
    </Box>
  );
}