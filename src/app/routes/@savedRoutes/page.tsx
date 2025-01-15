import { cookies } from "next/headers";
import Link from "next/link";
import pluralize from "pluralize";

import { ArrowForwardRounded } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

import { getUserRoutes } from "@/app/api/user/routes/actions";
import RoutesList from "@/components/Routes/List";
import ViewError from "@/components/ui/ViewError";
import { auth } from "@/utils/auth";
import { features, hasFeatureAccess } from "@/utils/features";
import pages from "pages";


export default async function SavedRoutes() {
  const { userId } = await auth(cookies());
  const savedRoutes = userId && await getUserRoutes({ userId }) || [];

  if (!(await hasFeatureAccess(features.routes_save, cookies()))) {
    return (
      <ViewError
        primary="Available with Loop Premium"
        secondary={savedRoutes.length ? `You have ${savedRoutes.length} ${pluralize("route", savedRoutes.length)} still saved. Upgrade now to avoid losing access to them` : "Upgrade now to start saving routes for later"}
        action={
          <Stack alignItems="center">
            <Button
              variant="contained"
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