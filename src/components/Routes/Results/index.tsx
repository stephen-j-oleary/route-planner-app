import { Box } from "@mui/material";

import LegsList from "./Legs/List";
import Summary from "./Summary";
import { IRoute } from "@/models/Route";


export type RouteResultsProps = {
  userId?: string | null,
  route: Omit<IRoute, "_id"> | undefined | null,
  onEdit?: () => void,
  isSaved?: boolean,
  isSaveAllowed?: boolean,
};

export default function RouteResults({
  userId,
  route,
  onEdit,
  isSaved = false,
  isSaveAllowed,
  ...props
}: RouteResultsProps) {
  return (
    <Box {...props}>
      <Summary
        userId={userId}
        route={route}
        onEdit={onEdit}
        isSaved={isSaved}
        isSaveAllowed={isSaveAllowed}
      />

      {
        route && (
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "2fr 1fr" }}
            columnGap={2}
            rowGap={4}
            alignItems="flex-start"
            my={3}
          >
            <LegsList
              route={route}
            />
          </Box>
        )
      }
    </Box>
  );
}