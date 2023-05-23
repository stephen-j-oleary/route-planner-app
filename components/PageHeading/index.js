import { Box, Stack, Typography } from "@mui/material";

import NextBreadcrumbs from "@/components/NextBreadcrumbs";


export default function PageHeading({
  title,
  action,
  titleComponent = "h1",
  titleVariant = "h3",
}) {
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