"use client";

import { ReactNode } from "react";

import { Box, BoxProps, Stack, Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";


const InlineSpan = styled((props: TypographyProps) => <Typography component="span" {...props} />)({
  display: "inline-block",
  verticalAlign: "middle",
  "&:not(:first-of-type)": { borderLeft: "1px solid" },
  paddingInline: 3,
});


type ViewErrorTypographyTypes = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export type ViewErrorProps = BoxProps & {
  status?: string | number,
  primary?: string | ReactNode,
  secondary?: string | ReactNode,
  primaryComponent?: ViewErrorTypographyTypes,
  secondaryComponent?: ViewErrorTypographyTypes,
  action?: ReactNode,
}

export default function ViewError({
  status,
  primary = "An error occurred",
  secondary,
  primaryComponent = "p",
  secondaryComponent = "p",
  action,
  ...props
}: ViewErrorProps) {
  return (
    <Box paddingY={2} {...props}>
      <Typography
        component={primaryComponent}
        textAlign="center"
      >
        {
          status && (
            <InlineSpan variant="h4">
              {status}
            </InlineSpan>
          )
        }

        <InlineSpan variant={status !== undefined ? "h5" : "h6"}>
          {primary}
        </InlineSpan>
      </Typography>

      {
        secondary && (
          <Typography
            component={secondaryComponent}
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            {secondary}
          </Typography>
        )
      }

      {
        action && (
          <Stack alignItems="center" marginTop={2}>
            {action}
          </Stack>
        )
      }
    </Box>
  );
}