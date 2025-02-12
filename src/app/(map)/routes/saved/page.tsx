import type { Metadata } from "next";
import Link from "next/link";
import pluralize from "pluralize";

import { ArrowForwardRounded } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

import { getUserRoutes } from "@/app/api/user/routes/actions";
import RoutesList from "@/components/Routes/List";
import ViewError from "@/components/ui/ViewError";
import pages from "@/pages";
import { checkFeature, features } from "@/utils/features";


export default async function Page() {
  const savedRoutes = (await getUserRoutes().catch(() => []) ?? [])
    .toSorted((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()));

  if (!(await checkFeature(features.routes_save))) {
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
    />
  );
}

export const metadata: Metadata = {
  title: "Loop Mapping - Saved Routes",
};