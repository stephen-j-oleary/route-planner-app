import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";

import CheckoutForm, { CheckoutFormProps } from "@/components/CheckoutForm";
import DefaultLayout from "@/components/ui/Layouts/Default";
import { NextPageWithLayout } from "@/pages/_app";
import { getAuthUser } from "@/utils/auth/serverHelpers";


export const getServerSideProps = (async ({ req, res, params, resolvedUrl }: GetServerSidePropsContext) => {
  const USER_REGISTER_REDIRECT = {
    redirect: {
      destination: `/register?callbackUrl=${resolvedUrl}`,
      permanent: false,
    },
  };

  const authUser = await getAuthUser(req, res);
  if (!authUser) return USER_REGISTER_REDIRECT;

  const { slug } = params;
  const props: CheckoutFormProps = {
    /** Link format "/id/[priceId]" */
    priceId: (slug.length === 2 && slug[0] === "id") ? slug[1] : null,
    /** Link format "/[lookupKey]" */
    lookupKey: (slug.length === 1) ? slug[0] : null,
  };

  if (!props.priceId && !props.lookupKey) return { notFound: true };

  return { props };
}) satisfies GetServerSideProps

const SubscribePage: NextPageWithLayout = (props: CheckoutFormProps) => {
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
        <CheckoutForm {...props} />
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