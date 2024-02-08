import { isArray } from "lodash";
import { GetServerSidePropsContext } from "next";

import { Container, Paper, Typography } from "@mui/material";

import CreateRouteForm from "@/components/Routes/CreateForm";
import CreateRouteFormContextProvider from "@/components/Routes/CreateForm/Context";
import CreateRouteFormMap from "@/components/Routes/CreateForm/Map";
import { MINIMUM_STOP_COUNT } from "@/components/Routes/CreateForm/useLogic";
import useDeferred from "@/hooks/useDeferred";
import useRouterQuery from "@/hooks/useRouterQuery";
import { Stop } from "@/models/Route";
import { NextPageWithLayout } from "@/pages/_app";
import serverSideAuth, { ServerSideAuthRedirects } from "@/utils/auth/serverSideAuth";


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const redirects: ServerSideAuthRedirects = {
    noUser: "/login",
    notVerified: "/account/verify",
  };

  return (
    (await serverSideAuth(ctx, redirects))
    || { props: {} }
  );
}

const CreateRoute: NextPageWithLayout = () => {
  const query = useRouterQuery();
  const stops = query.get("stops") || [];
  const origin = +(query.get("origin", "0") || 0);
  const destination = +(query.get("destination", "0") || 0);
  const stopTime = +(query.get("stopTime", "0") || 0);

  const getDefaultStops = () => {
    const defStops: (Pick<Stop, "fullText"> & Partial<Omit<Stop, "fullText">>)[] = ((isArray(stops) && stops) || []).map(v => ({ fullText: v || "" }));
    defStops.length = Math.max(stops.length, MINIMUM_STOP_COUNT);

    return defStops.fill({ fullText: "" }, stops.length);
  };

  const defaultValues = useDeferred(
    {
      stops: getDefaultStops(),
      origin,
      destination,
      stopTime,
    },
    query.isReady
  );


  return (
    <CreateRouteFormContextProvider
      defaultValues={defaultValues.execute}
    >
      <CreateRouteFormMap />

      <Paper>
        <Container
          maxWidth="sm"
          disableGutters
          sx={{
            marginY: 3,
            paddingX: 3,
            borderInline: "1px solid",
            borderColor: "grey.300",
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            paddingBottom={2}
          >
            Create a route
          </Typography>

          <CreateRouteForm />
        </Container>
      </Paper>
    </CreateRouteFormContextProvider>
  );
}

CreateRoute.layoutProps = {
  title: "Create Route",
};


export default CreateRoute;