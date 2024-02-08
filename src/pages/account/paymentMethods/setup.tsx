import Link from "next/link";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";

import PaymentMethodSetupForm from "@/components/PaymentMethods/SetupForm";
import { NextPageWithLayout } from "@/pages/_app";


const PaymentMethodSetupPage: NextPageWithLayout = () => (
  <Container
    maxWidth="md"
    sx={{ paddingY: 5 }}
  >
    <Button
      size="medium"
      component={Link}
      href="/account"
      startIcon={<KeyboardArrowLeftRounded />}
    >
      Back to account
    </Button>

    <Box pt={2}>
      <PaymentMethodSetupForm />
    </Box>
  </Container>
)

PaymentMethodSetupPage.layoutProps = {
  title: "New payment method",
};


export default PaymentMethodSetupPage;