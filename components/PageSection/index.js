import NextLink from "next/link";

import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Link, Paper, Stack, Typography } from "@mui/material";


export default function PageSection({
  paper = false,
  borders = "",
  top = false,
  title,
  titleHref,
  action,
  body,
  children,
  ...props
}) {
  return (
    <Box
      paddingTop={top ? 0 : 2}
      paddingBottom={2}
      sx={{
        borderColor: "divider",
        borderStyle: "solid",
        borderTopWidth: (borders === true || borders.includes("top")) ? 1 : 0,
        borderBottomWidth: (borders === true || borders.includes("bottom")) ? 1 : 0,
        borderLeftWidth: (borders === true || borders.includes("left")) ? 1 : 0,
        borderRightWidth: (borders === true || borders.includes("right")) ? 1 : 0,
      }}
      {...props}
    >
      {
        (title || action) && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            marginTop={top ? 0 : 2}
            marginBottom={2}
          >
            <Typography
              component="h2"
              variant="h5"
            >
              {
                titleHref ? (
                  <Link
                    component={NextLink}
                    href={titleHref}
                    color="inherit"
                    underline="none"
                    sx={{ "&:hover": { textDecoration: "underline" } }}
                  >
                    {title}
                    <ArrowForwardIcon fontSize="small" sx={{ verticalAlign: "middle" }} />
                  </Link>
                ) : title
              }
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
            >
              {action}
            </Stack>
          </Stack>
        )
      }

      {
        paper ? (
          <Paper elevation={1}>
            {children || body}
          </Paper>
        ) : children || body
      }
    </Box>
  );
}