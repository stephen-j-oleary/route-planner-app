import { Container } from "@mui/material";

import AccountsList from "@/components/Accounts/List";
import AddPaymentMethod from "@/components/PaymentMethods/Add";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import SubscriptionsList from "@/components/Subscriptions/List";
import AuthGuard from "@/components/ui/AuthGuard";
import DefaultLayout from "@/components/ui/Layouts/Default";
import PageHeading from "@/components/ui/PageHeading";
import PageSection from "@/components/ui/PageSection";
// import DeleteAccount from "@/components/Users/DeleteAccount";
import UserProfileForm from "@/components/Users/ProfileForm";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetUserAccounts } from "@/reactQuery/useAccounts";
import { useGetUserPaymentMethods } from "@/reactQuery/usePaymentMethods";
import { selectUser, useGetSession } from "@/reactQuery/useSession";
import { useGetUserSubscriptions } from "@/reactQuery/useSubscriptions";


const AccountPage: NextPageWithLayout = () => {
  const authUser = useGetSession({ select: selectUser });

  const subscriptions = useGetUserSubscriptions();
  const paymentMethods = useGetUserPaymentMethods();
  const accounts = useGetUserAccounts();


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
          paper
          borders="bottom"
          title="Sign in methods"
          body={
            <AccountsList
              dense
              accountsQuery={accounts}
            />
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
              paymentMethodsQuery={paymentMethods}
              visible={3}
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