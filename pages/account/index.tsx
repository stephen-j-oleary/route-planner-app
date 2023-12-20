import AddIcon from "@mui/icons-material/AddRounded";
import { LoadingButton } from "@mui/lab";
import { Container, Stack } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import PageSection from "@/components/PageSection";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import SubscriptionsList from "@/components/Subscriptions/List";
// import DeleteAccount from "@/components/Users/DeleteAccount";
import ChangePassword from "@/components/Users/ChangePassword";
import LinkProvider from "@/components/Users/LinkProvider";
import UserProfileForm from "@/components/Users/ProfileForm";
import UnlinkProvider from "@/components/Users/UnlinkProvider";
import { NextPageWithLayout } from "@/pages/_app";
import { useCreatePaymentMethod, useGetPaymentMethodsByCustomer } from "@/shared/reactQuery/usePaymentMethods";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { useGetSubscriptions } from "@/shared/reactQuery/useSubscriptions";


const AccountPage: NextPageWithLayout = () => {
  const authUser = useGetSession({ select: selectUser });

  const subscriptions = useGetSubscriptions({
    enabled: !!authUser.data?.customerId,
  });

  const paymentMethods = useGetPaymentMethodsByCustomer(
    authUser.data?.customerId,
    { enabled: authUser.isSuccess }
  );

  const handleCreatePaymentMethod = useCreatePaymentMethod();


  return (
    <AuthGuard>
      <Container maxWidth="sm" sx={{ paddingY: 3 }}>
        <PageHeading />

        <PageSection
          isTop
          borders="bottom"
          title="Profile"
          body={<UserProfileForm />}
        />

        <PageSection
          borders="bottom"
          title="Sign in"
          body={
            <Stack
              spacing={3}
              alignItems="flex-start"
              width="100%"
              paddingX={1}
            >
              <ChangePassword
                type="button"
                variant="outlined"
                size="medium"
              />

              <LinkProvider
                type="button"
                variant="outlined"
                size="medium"
              />

              <UnlinkProvider
                type="button"
                variant="outlined"
                size="medium"
              />
            </Stack>
          }
        />

        <PageSection
          paper
          borders="bottom"
          title="Subscriptions"
          titleHref="/account/subscriptions"
          body={
            <SubscriptionsList
              query={subscriptions}
              visible={3}
            />
          }
        />

        <PageSection
          paper
          borders="bottom"
          title="Payment methods"
          titleHref="/account/paymentMethods"
          action={
            authUser.isSuccess && (
              <LoadingButton
                size="medium"
                startIcon={<AddIcon />}
                onClick={() => handleCreatePaymentMethod.mutate()}
                loadingPosition="start"
                loading={handleCreatePaymentMethod.isLoading}
              >
                Add payment method
              </LoadingButton>
            )
          }
          body={
            <PaymentMethodsList
              visible={3}
              loading={paymentMethods.isIdle || paymentMethods.isLoading}
              error={paymentMethods.isError}
              data={paymentMethods.isSuccess && paymentMethods.data}
            />
          }
        />

        {/* <PageSection
          title="Delete account"
          body={
            <DeleteAccount
              user={authUser.data}
              variant="outlined"
              size="medium"
              disabled={!authUser.isFetched}
            />
          }
        /> */}
      </Container>
    </AuthGuard>
  );
}

AccountPage.getLayout = props => (
  <DefaultLayout
    title="Profile"
    headingComponent="p"
    {...props}
  />
);

export default AccountPage;