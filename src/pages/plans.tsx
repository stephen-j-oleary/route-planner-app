import { Box, Container, Typography } from "@mui/material";

import SubscriptionPlanSelect from "@/components/Subscriptions/PlanSelect";
import DefaultLayout from "@/components/ui/Layouts/Default";
import { NextPageWithLayout } from "@/pages/_app";


const SubscriptionPlansPage: NextPageWithLayout = () => (
  <Container
    maxWidth="sm"
    sx={{ paddingY: 5 }}
  >
    <Typography component="p" variant="h3">Loop Mapping</Typography>
    <Typography component="p" variant="body1">Streamline your delivery or travel routes</Typography>

    <Box mt={5}>
      <SubscriptionPlanSelect />
    </Box>
  </Container>
);

SubscriptionPlansPage.getLayout = props => (
  <DefaultLayout
    title="Plans"
    headingComponent="p"
    {...props}
  />
);

export default SubscriptionPlansPage;