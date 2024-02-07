import React from "react";

import { Box, BoxProps, styled, Typography, TypographyProps } from "@mui/material";


const InlineSpan = styled((props: TypographyProps) => <Typography component="span" {...props} />)({
  display: "inline-block",
  verticalAlign: "middle",
  "&:not(:first-of-type)": { borderLeft: "1px solid" },
  paddingInline: 3,
});


type ViewErrorTypographyTypes = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export type ViewErrorProps = BoxProps & {
  status?: string | number,
  primary?: string | React.ReactNode,
  secondary?: string | React.ReactNode,
  primaryComponent?: ViewErrorTypographyTypes,
  secondaryComponent?: ViewErrorTypographyTypes,
  action?: React.ReactNode,
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

        <InlineSpan variant={![null, undefined].includes(status) ? "h5" : "h6"}>
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
          <Box marginTop={2}>
            {action}
          </Box>
        )
      }
    </Box>
  );
}