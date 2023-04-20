import { Box, styled, Typography } from "@mui/material";


const InlineSpan = styled(Typography)({
  display: "inline-block",
  verticalAlign: "middle",
  "&:not(:first-of-type)": { borderLeft: "1px solid" },
});
InlineSpan.defaultProps = {
  component: "span",
  paddingX: 3,
};


export default function ViewError({
  status,
  primary = "An error occurred",
  secondary,
  primaryComponent = "p",
  secondaryComponent = "p",
  action,
  ...props
}) {
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

        <InlineSpan variant={status ? "h6" : "body1"}>
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