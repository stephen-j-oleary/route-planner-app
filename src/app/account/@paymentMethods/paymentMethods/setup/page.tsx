import Link from "next/link";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

import PaymentMethodSetupForm from "@/components/PaymentMethods/SetupForm";


export default function PaymentMethodSetupPage() {
  return (
    <>
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
    </>
  );
}

export const metadata = {
  title: "Loop Mapping - New Payment Method",
};