import { Container, Paper, Typography } from "@mui/material";

import ListSkeleton from "@/components/ui/ListSkeleton";


export default function Loading() {
  return (
    <Paper>
      <Container
        maxWidth="sm"
        disableGutters
        sx={{
          marginY: 3,
          paddingX: 3,
          borderInline: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          paddingBottom={2}
        >
          Create a route
        </Typography>

        <ListSkeleton />
      </Container>
    </Paper>
  );
}