import { UseQueryResult } from "react-query";

import { Box, Container } from "@mui/material";

import LegsList from "./Legs/List";
import Summary from "./Summary";
import { IRoute } from "@/models/Route";


export type RouteResultsProps = {
  routeQuery: UseQueryResult<IRoute | undefined | null>,
};

export default function RouteResults({
  routeQuery,
  ...props
}: RouteResultsProps) {
  return (
    <Box {...props}>
      <Summary
        routeQuery={routeQuery}
      />

      {
        routeQuery.data && (
          <Container
            maxWidth="sm"
            disableGutters
            sx={{
              marginX: 0,
              marginY: 3,
              paddingX: 2,
              borderInline: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <LegsList
              route={routeQuery.data}
            />
          </Container>
        )
      }
    </Box>
  );
}