import Link from "next/link";

import { RouteRounded } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Stack, Typography } from "@mui/material";

import pages from "pages";


export default function CreateRoute() {
  return (
    <Card>
      <CardHeader
        title="Get Started"
        titleTypographyProps={{ component: "h2" }}
      />
      <CardContent sx={{ paddingX: 0 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="body1">
            Start optimizing your next trip
          </Typography>

          <Button
            variant="contained"
            size="medium"
            component={Link}
            href={pages.routes.create}
            startIcon={<RouteRounded />}
          >
            Create a route now
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}