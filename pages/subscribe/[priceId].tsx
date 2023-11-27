import { isArray } from "lodash";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";

import CheckoutForm from "@/components/CheckoutForm";
import DefaultLayout from "@/components/Layouts/Default";
import { NextPageWithLayout } from "@/pages/_app";
import useRouterQuery from "@/shared/hooks/useRouterQuery";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";



export async function getServerSideProps({ req, res, resolvedUrl }: GetServerSidePropsContext) {
  const USER_REGISTER_REDIRECT = {
    redirect: {
      destination: `/register?callbackUrl=${resolvedUrl}`,
      permanent: false,
    },
  };

  const authUser = await getAuthUser(req, res);
  if (!authUser) return USER_REGISTER_REDIRECT;

  return { props: {} };
}

const SubscribePage: NextPageWithLayout = () => {
  const query = useRouterQuery();
  const priceId = query.get("priceId");

  return (
    <Container
      maxWidth="md"
      sx={{ paddingY: 5 }}
    >
      <Button
        size="medium"
        component={Link}
        href="/plans"
        startIcon={<KeyboardArrowLeftRounded />}
      >
        Back to plans
      </Button>

      <Box pt={2}>
        <CheckoutForm priceId={isArray(priceId) ? priceId[0] : priceId} />
      </Box>
    </Container>
  );
};

SubscribePage.getLayout = props => (
  <DefaultLayout
    title="Subscribe"
    headingComponent="p"
    {...props}
  />
);

export default SubscribePage;