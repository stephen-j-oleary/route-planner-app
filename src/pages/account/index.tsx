import { GetServerSidePropsContext } from "next";

import { Alert, AlertTitle, Container } from "@mui/material";

import AccountsList from "@/components/Accounts/List";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import SubscriptionsList from "@/components/Subscriptions/List";
import PageHeading from "@/components/ui/PageHeading";
import PageSection from "@/components/ui/PageSection";
// import DeleteAccount from "@/components/Users/DeleteAccount";
import UserProfileForm from "@/components/Users/ProfileForm";
import VerifyForm from "@/components/Users/VerifyForm";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetUserAccounts } from "@/reactQuery/useAccounts";
import { useGetUserPaymentMethods } from "@/reactQuery/usePaymentMethods";
import { useGetUserSubscriptions } from "@/reactQuery/useSubscriptions";
import { useGetUser } from "@/reactQuery/useUsers";
import serverSideAuth, { ServerSideAuthRedirects } from "@/utils/auth/serverSideAuth";


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const redirects: ServerSideAuthRedirects = {
    noUser: "/login",
  };

  return (
    (await serverSideAuth(ctx, redirects))
    || { props: {} }
  );
}

const AccountPage: NextPageWithLayout = () => {
  const user = useGetUser();

  const subscriptions = useGetUserSubscriptions();
  const paymentMethods = useGetUserPaymentMethods();
  const accounts = useGetUserAccounts();


  return (
    <Container maxWidth="sm" sx={{ paddingY: 3 }}>
      <PageHeading />

      {
        (user.data && !user.data.emailVerified) && (
          <Alert
            severity="warning"
            sx={{
              "& div:nth-of-type(2)": { flex: 1 },
              mb: 2,
            }}
          >
            <AlertTitle>Verify email</AlertTitle>

            {"Check your email for a verification code and enter it here. Don't forget to check your junk folder if you can't find an email"}

            <VerifyForm />
          </Alert>
        )
      }

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
  );
}

AccountPage.layoutProps = {
  title: "Profile",
};


export default AccountPage;