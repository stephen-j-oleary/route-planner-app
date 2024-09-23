import { Box } from "@mui/material";

import LegsList from "./Legs/List";
import Summary from "./Summary";
import { IRoute } from "@/models/Route";


export type RouteResultsProps = {
  userId?: string | null,
  customerId?: string | null,
  route: Omit<IRoute, "_id"> | undefined | null,
  onEdit?: () => void,
  isSaved?: boolean,
};

export default function RouteResults({
  userId,
  customerId,
  route,
  onEdit,
  isSaved = false,
  ...props
}: RouteResultsProps) {
  return (
    <Box {...props}>
      <Summary
        userId={userId}
        customerId={customerId}
        route={route}
        onEdit={onEdit}
        isSaved={isSaved}
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