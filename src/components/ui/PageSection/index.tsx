import NextLink from "next/link";
import { ReactNode } from "react";

import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, BoxProps, Link, Paper, Stack, Typography } from "@mui/material";


export type PageSectionProps = BoxProps & {
  paper?: boolean,
  borders?: boolean | string,
  isTop?: boolean,
  title?: ReactNode,
  titleHref?: string,
  action?: ReactNode,
  body?: ReactNode,
  children?: ReactNode,
};

export default function PageSection({
  paper = false,
  borders = false,
  isTop = false,
  title,
  titleHref,
  action,
  body,
  children,
  ...props
}: PageSectionProps) {
  return (
    <Box
      paddingTop={isTop ? 0 : 2}
      paddingBottom={2}
      sx={{
        borderColor: "divider",
        borderStyle: "solid",
        borderTopWidth: (borders === true || (typeof borders === "string" && borders.includes("top"))) ? 1 : 0,
        borderBottomWidth: (borders === true || (typeof borders === "string" && borders.includes("bottom"))) ? 1 : 0,
        borderLeftWidth: (borders === true || (typeof borders === "string" && borders.includes("left"))) ? 1 : 0,
        borderRightWidth: (borders === true || (typeof borders === "string" && borders.includes("right"))) ? 1 : 0,
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
            marginTop={isTop ? 0 : 2}
            marginBottom={2}
          >
            <Typography
              component="h2"
              variant="h3"
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