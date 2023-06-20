import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import Head from "next/head";

import AddIcon from "@mui/icons-material/AddRounded";
import MoreVertIcon from "@mui/icons-material/MoreVertRounded";
import { CircularProgress, Container, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import { useCreatePaymentMethod, useGetPaymentMethodsByCustomer } from "@/shared/reactQuery/usePaymentMethods";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";


export default function PaymentMethodsPage() {
  const authUser = useGetSession({ select: selectUser });

  const actionsDropdownState = usePopupState({ variant: "popover", popupId: "payment-methods-actions" });

  const paymentMethods = useGetPaymentMethodsByCustomer(
    authUser.data?.customerId,
    { enabled: authUser.isSuccess }
  );

  const handleCreate = useCreatePaymentMethod();


  return (
    <>
      <Head>
        <title>Payment Methods - Loop Mapping</title>
      </Head>

      <ErrorBoundary>
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
                    <MenuItem
                      dense
                      disabled={!authUser.isSuccess || handleCreate.isLoading}
                      onClick={handleCreate.mutate}
                    >
                      <ListItemIcon>
                        {
                          handleCreate.isLoading
                            ? <CircularProgress size="1.5rem" color="inherit" />
                            : <AddIcon />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary="Add payment method"
                      />
                    </MenuItem>
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
      </ErrorBoundary>
    </>
  );
}

PaymentMethodsPage.getLayout = props => (
  <DefaultLayout
    headingComponent="p"
    {...props}
  />
);