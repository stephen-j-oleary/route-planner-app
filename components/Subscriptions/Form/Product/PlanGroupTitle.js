import { Divider, Stack, Typography } from "@mui/material";


export default function PlanGroupTitle({ products }) {
  const name = products[0].metadata.plan.split(" - ")[0];
  const length = products.length;


  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <Typography variant="body1">
        {name}
      </Typography>

      <Divider
        sx={{
          display: "inline-block",
          width: ".5rem",
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {length} plan{length > 1 ? "s" : ""}
      </Typography>
    </Stack>
  );
}