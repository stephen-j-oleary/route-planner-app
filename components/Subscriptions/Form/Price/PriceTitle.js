import { Divider, Stack, Typography } from "@mui/material";


export default function PriceTitle({ price }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <Typography
        component="p"
        variant="body1"
      >
        {
          price.billing_scheme === "per_unit"
            ? "Unit"
            : price.tiers_mode === "graduated"
            ? "Tiered"
            : "Volume"
        } pricing
      </Typography>

      <Divider
        sx={{
          display: "inline-block",
          width: ".5rem",
        }}
      />

      <Typography
        component="p"
        variant="body2"
        color="text.secondary"
      >
        {
          price.type === "one_time"
            ? "One time payment"
            : `Billed every ${price.recurring.interval_count > 1 ? `${price.recurring.interval_count} ` : ""}${price.recurring.interval}`
        }
      </Typography>
    </Stack>
  )
}