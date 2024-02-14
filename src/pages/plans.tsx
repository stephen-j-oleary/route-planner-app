import { Box, Container, Typography } from "@mui/material";

import SubscriptionPlanSelect from "@/components/Subscriptions/PlanSelect";
import { NextPageWithLayout } from "@/pages/_app";


const SubscriptionPlansPage: NextPageWithLayout = () => (
  <Container
    maxWidth="sm"
    sx={{ paddingY: 5 }}
  >
    <Typography component="p" variant="h1">Loop Subscriptions</Typography>
    <Typography component="p" variant="body1">Gain access to premium features</Typography>

    <Box mt={5}>
      <SubscriptionPlanSelect />
    </Box>
  </Container>
);

SubscriptionPlansPage.layoutProps = {
  title: "Plans",
};


export default SubscriptionPlansPage;