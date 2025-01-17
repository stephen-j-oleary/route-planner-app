import { cookies } from "next/headers";
import Link from "next/link";

import { ArrowForwardRounded } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

import { getUserRoutes } from "@/app/api/user/routes/actions";
import RoutesList from "@/components/Routes/List";
import ViewError from "@/components/ui/ViewError";
import { auth } from "@/utils/auth";
import pages from "pages";


export default async function SavedRoutes() {
  const { userId, customerId } = await auth(cookies());
  const savedRoutes = userId && await getUserRoutes({ userId }) || [];

  if (!customerId) {
    return (
      <ViewError
        primary="No saved routes"
        secondary="Saving routes requires a subscription"
        action={
          <Stack alignItems="center">
            <Button
              variant="text"
              size="medium"
              component={Link}
              href={pages.plans}
              endIcon={<ArrowForwardRounded />}
            >
              View plans
            </Button>
          </Stack>
        }
      />
    );
  }

  return (
    <RoutesList
      routes={savedRoutes}
      visible={3}
    />
  );
}