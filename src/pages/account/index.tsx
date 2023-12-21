import { Container, Stack } from "@mui/material";

import AddPaymentMethod from "@/components/PaymentMethods/Add";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import SubscriptionsList from "@/components/Subscriptions/List";
import AuthGuard from "@/components/ui/AuthGuard";
import DefaultLayout from "@/components/ui/Layouts/Default";
import PageHeading from "@/components/ui/PageHeading";
import PageSection from "@/components/ui/PageSection";
// import DeleteAccount from "@/components/Users/DeleteAccount";
import ChangePassword from "@/components/Users/ChangePassword";
import LinkProvider from "@/components/Users/LinkProvider";
import UserProfileForm from "@/components/Users/ProfileForm";
import UnlinkProvider from "@/components/Users/UnlinkProvider";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetPaymentMethods } from "@/reactQuery/usePaymentMethods";
import { selectUser, useGetSession } from "@/reactQuery/useSession";
import { useGetSubscriptions } from "@/reactQuery/useSubscriptions";


const AccountPage: NextPageWithLayout = () => {
  const authUser = useGetSession({ select: selectUser });
  const hasCustomer = !!authUser.data?.customerId;

  const subscriptions = useGetSubscriptions({
    enabled: hasCustomer,
  });

  const paymentMethods = useGetPaymentMethods({
    enabled: hasCustomer,
  });


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
              <AddPaymentMethod
                withIcon
                size="medium"
              />
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
              userId={authUser.data.id}
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