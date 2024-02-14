import React from "react";

import { Box, Stack, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

import NextBreadcrumbs from "@/components/ui/NextBreadcrumbs";


export type PageHeadingProps = {
  title?: React.ReactNode,
  action?: React.ReactNode,
  titleComponent?: React.ElementType,
  titleVariant?: Variant | "inherit",
}

export default function PageHeading({
  title = "",
  action = "",
  titleComponent = "h1",
  titleVariant = "h1",
}: PageHeadingProps) {
  return (
    <Box paddingTop={1} paddingBottom={4}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          component={titleComponent}
          variant={titleVariant}
        >
          {title}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
        >
          {action}
        </Stack>
      </Stack>

      <NextBreadcrumbs />
    </Box>
  );
}