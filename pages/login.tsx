import { isArray } from "lodash";
import { GetServerSidePropsContext } from "next";

import { Box, Container } from "@mui/material";

import DefaultLayout from "@/components/Layouts/Default";
import LoginForm from "@/components/LoginForm";
import { NextPageWithLayout } from "@/pages/_app";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";


export async function getServerSideProps({ req, res, query }: GetServerSidePropsContext) {
  let { callbackUrl = "/account" } = query;
  if (isArray(callbackUrl)) callbackUrl = callbackUrl[0];

  const USER_LOGGED_IN_REDIRECT = {
    redirect: {
      destination: callbackUrl,
      permanent: false,
    },
  };

  const authUser = await getAuthUser(req, res);
  if (authUser) return USER_LOGGED_IN_REDIRECT;

  return { props: {} };
}

const LoginPage: NextPageWithLayout = () => (
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
      <LoginForm />
    </Box>
  </Container>
);

LoginPage.getLayout = props => (
  <DefaultLayout
    title="Login"
    headingComponent="h2"
    hideUserMenu
    {...props}
  />
);

export default LoginPage;