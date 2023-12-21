import { useMemo } from "react";

import { Box, Container } from "@mui/material";


import LegsList from "./Legs/List";
import Summary from "./Summary";
import { getStopDuration } from "@/utils/routeHelpers";


export default function RouteResults({ loading, error, data, ...props }) {
  const legs = useMemo(
    () => data?.legs,
    [data]
  );
  const stops = useMemo(
    () => (
      (data && legs) && new Array(legs.length + 1).fill(0).map((_item, i) => {
        const legBefore = legs[i - 1];
        const legAfter = legs[i];

        const duration = getStopDuration(data, i);

        const address = (legBefore?.end.address.formattedAddress || legAfter?.start.address.formattedAddress)
          || [
            legBefore?.end.lat || legAfter?.start.lat,
            legBefore?.end.lng || legAfter?.start.lng,
          ].join(",");

        return { address, duration };
      })
    ),
    [data, legs]
  );

  return (
    <Box {...props}>
      <Summary
        loading={loading}
        error={error}
        data={data}
      />

      {
        !(loading || error) && (
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
              data={{
                stops,
                legs,
              }}
            />
          </Container>
        )
      }
    </Box>
  );
}