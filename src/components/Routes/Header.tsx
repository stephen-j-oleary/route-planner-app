import { ReactNode } from "react";

import { Box, Stack, Typography } from "@mui/material";


export default function RoutesHeader({
  title,
  subtitle,
}: {
  title: ReactNode,
  subtitle?: ReactNode,
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      px={2}
      pb={2}
      sx={{
        borderBottom: "1px solid",
        borderBottomColor: "grey.200",
      }}
    >
      <Box flex={1}>
        <Typography
          component="h1"
          variant="h3"
        >
          {title}
        </Typography>

        {subtitle}
      </Box>
    </Stack>
  )
}