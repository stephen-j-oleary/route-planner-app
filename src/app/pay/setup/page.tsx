import Link from "next/link";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

import PaymentMethodSetupForm from "@/components/PaymentMethods/SetupForm";
import pages from "pages";


export default function PaySetupPage() {
  return (
    <>
      <Button
        size="medium"
        component={Link}
        href={pages.account.root}
        startIcon={<KeyboardArrowLeftRounded />}
        sx={{ margin: 2 }}
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
  title: "Loop Mapping - Setup Payment",
};