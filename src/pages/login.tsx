import { GetServerSidePropsContext } from "next";

import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";

import LoginForm from "@/components/LoginForm";
import DefaultLayout from "@/components/ui/Layouts/Default";
import useRouterQuery from "@/hooks/useRouterQuery";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetUser } from "@/reactQuery/useUsers";


export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { callbackUrl: cb } = query;
  const callbackUrl = typeof cb === "string" ? cb : "/account";

  return {
    props: { callbackUrl },
  };
}

type LoginPageProps = {
  callbackUrl: string,
};

const LoginPage: NextPageWithLayout<LoginPageProps> = ({ callbackUrl }) => {
  const queryRouter = useRouterQuery();
  const err = queryRouter.get("error");
  const error = typeof err === "string" ? err : undefined;

  const email = useGetUser({
    select: user => user?.email,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <Container
      maxWidth="sm"
      disableGutters
      sx={{ paddingY: 5 }}
    >
      <Box
        paddingY={3}
        paddingX={5}
        sx={{
          borderInline: "1px solid",
          borderColor: "grey.400",
        }}
      >
        {
          (email.isIdle || email.isLoading)
            ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={1}
                minHeight="50vh"
              >
                <CircularProgress color="inherit" />
                <Typography
                  component="p"
                  variant="h4"
                  color="inherit"
                >
                  Loading...
                </Typography>
              </Stack>
            )
            : (
              <LoginForm
                callbackUrl={callbackUrl}
                error={
                  error === "OAuthAccountNotLinked"
                    ? "An account with this email already exists. Please use another sign in method"
                    : error
                }
                defaultValues={email.data ? { email: email.data } : undefined}
              />
            )
        }
      </Box>
    </Container>
  );
}

LoginPage.getLayout = props => (
  <DefaultLayout
    title="Login"
    headingComponent="p"
    hideUserMenu
    {...props}
  />
);

export default LoginPage;