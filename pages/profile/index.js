import AddIcon from "@mui/icons-material/AddRounded";
import { LoadingButton } from "@mui/lab";
import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
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


export default function ProfilePage() {
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
    <ErrorBoundary>
      <AuthGuard>
        <Container maxWidth="sm" sx={{ paddingY: 3 }}>
          <PageHeading />

          <PageSection
            top
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
            titleHref="/profile/subscriptions"
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
            titleHref="/profile/paymentMethods"
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
    </ErrorBoundary>
  );
}

ProfilePage.getLayout = props => (
  <DefaultLayout
    title="Profile"
    headingComponent="p"
    {...props}
  />
);