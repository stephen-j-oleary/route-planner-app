import { Box, Container } from "@mui/material";

import LegsList from "./Legs/List";
import Summary from "./Summary";
import { IRoute } from "@/models/Route";


export type RouteResultsProps = {
  route: IRoute | undefined | null,
  isSaved: boolean,
};

export default function RouteResults({
  route,
  isSaved,
  ...props
}: RouteResultsProps) {
  return (
    <Box {...props}>
      <Summary
        route={route}
        isSaved={isSaved}
      />

      {
        route && (
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
              route={route}
            />
          </Container>
        )
      }
    </Box>
  );
}