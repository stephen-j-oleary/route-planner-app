import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";

import MoreVertIcon from "@mui/icons-material/MoreVertRounded";
import { Container, IconButton, Menu } from "@mui/material";

import AddPaymentMethod from "@/components/PaymentMethods/Add";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import AuthGuard from "@/components/ui/AuthGuard";
import DefaultLayout from "@/components/ui/Layouts/Default";
import PageHeading from "@/components/ui/PageHeading";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetUserPaymentMethods } from "@/reactQuery/usePaymentMethods";


const PaymentMethodsPage: NextPageWithLayout = () => {
  const actionsDropdownState = usePopupState({ variant: "popover", popupId: "payment-methods-actions" });
  const paymentMethods = useGetUserPaymentMethods();

  return (
    <AuthGuard>
      <Container maxWidth="sm" sx={{ paddingY: 3 }}>
        <PageHeading
          title="Payment Methods"
          action={
            <>
              <IconButton {...bindTrigger(actionsDropdownState)}>
                <MoreVertIcon />
              </IconButton>

              <Menu
                {...bindMenu(actionsDropdownState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <AddPaymentMethod
                  fullWidth
                  withIcon
                  sx={{ paddingInline: 2 }}
                />
              </Menu>
            </>
          }
        />

        <PaymentMethodsList
          paymentMethodsQuery={paymentMethods}
          visible={6}
        />
      </Container>
    </AuthGuard>
  );
}

PaymentMethodsPage.getLayout = props => (
  <DefaultLayout
    title="Payment methods"
    headingComponent="p"
    {...props}
  />
);

export default PaymentMethodsPage;