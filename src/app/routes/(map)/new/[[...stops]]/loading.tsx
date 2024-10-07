import { Box, Paper, Typography } from "@mui/material";

import RoutesHeader from "@/components/Routes/Header";
import ListSkeleton from "@/components/ui/ListSkeleton";


export default function Loading() {
  return (
    <Paper>
      <RoutesHeader>
        <Typography
          component="h1"
          variant="h3"
        >
          Create a route
        </Typography>
      </RoutesHeader>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "2fr 1fr" }}
        columnGap={2}
        alignItems="flex-start"
        my={3}
      >
        <ListSkeleton />
      </Box>
    </Paper>
  );
}