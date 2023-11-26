import AddIcon from "@mui/icons-material/AddRounded";
import { LoadingButton } from "@mui/lab";
import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import PageSection from "@/components/PageSection";
import PaymentMethodsList from "@/components/PaymentMethods/List";
import SubscriptionsList from "@/components/Subscriptions/List";
import UserAuthForm from "@/components/Users/AuthForm";
// import DeleteAccount from "@/components/Users/DeleteAccount";
import UserProfileForm from "@/components/Users/ProfileForm";
import { useCreatePaymentMethod, useGetPaymentMethodsByCustomer } from "@/shared/reactQuery/usePaymentMethods";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { useGetSubscriptionsByCustomer } from "@/shared/reactQuery/useSubscriptions";


export default function AccountPage() {
  const authUser = useGetSession({ select: selectUser });

  const subscriptions = useGetSubscriptionsByCustomer(
    authUser.data?.customerId,
    { enabled: authUser.isSuccess }
  );

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
          body={<UserAuthForm />}
        />

        <PageSection
          paper
          borders="bottom"
          title="Subscriptions"
          titleHref="/account/subscriptions"
          body={
            <SubscriptionsList
              visible={3}
              loading={subscriptions.isIdle || subscriptions.isLoading}
              error={subscriptions.isError}
              data={subscriptions.isSuccess && subscriptions.data}
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
                onClick={handleCreatePaymentMethod.mutate}
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