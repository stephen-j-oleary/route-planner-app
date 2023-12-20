import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";

import MoreVertIcon from "@mui/icons-material/MoreVertRounded";
import { Container, IconButton, Menu } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import AddPaymentMethod from "@/components/PaymentMethods/Add";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetPaymentMethodsByCustomer } from "@/shared/reactQuery/usePaymentMethods";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";


const PaymentMethodsPage: NextPageWithLayout = () => {
  const authUser = useGetSession({ select: selectUser });

  const actionsDropdownState = usePopupState({ variant: "popover", popupId: "payment-methods-actions" });

  const paymentMethods = useGetPaymentMethodsByCustomer(
    authUser.data?.customerId,
    { enabled: authUser.isSuccess }
  );


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
          loading={paymentMethods.isIdle || paymentMethods.isLoading}
          error={paymentMethods.isError}
          data={paymentMethods.isSuccess && paymentMethods.data}
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