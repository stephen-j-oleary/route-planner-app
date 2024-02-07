import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import { ArrowForwardRounded } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Container, Grid, Stack } from "@mui/material";

import DeleteRoute from "@/components/Routes/Delete";
import RoutesList from "@/components/Routes/List";
import SaveRoute from "@/components/Routes/Save";
import DefaultLayout from "@/components/ui/Layouts/Default";
import ViewError from "@/components/ui/ViewError";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetLocalRoutes, useGetUserRoutes } from "@/reactQuery/useRoutes";
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

const Routes: NextPageWithLayout = () => {
  const user = useGetUser();
  const recentRoutes = useGetLocalRoutes();
  const savedRoutes = useGetUserRoutes();


  return (
    <Container
      maxWidth="md"
      sx={{ paddingY: 4 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Recent Routes"
              titleTypographyProps={{ component: "h2" }}
            />
            <CardContent sx={{ paddingX: 0 }}>
              <RoutesList
                routesQuery={recentRoutes}
                visible={3}
                actions={item => (
                  savedRoutes.data?.find(r => r._id === item._id)
                    ? <DeleteRoute route={item} />
                    : <SaveRoute route={item} />
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Saved Routes"
              titleTypographyProps={{ component: "h2" }}
            />
            <CardContent sx={{ paddingX: 0 }}>
              {
                user.data?.customerId
                  ? (
                    <RoutesList
                      routesQuery={savedRoutes}
                      visible={3}
                      actions={item => <DeleteRoute route={item} />}
                    />
                  )
                  : (
                    <ViewError
                      primary="No saved routes"
                      secondary="Saving routes requires a subscription"
                      action={
                        <Stack alignItems="center">
                          <Button
                            variant="text"
                            size="medium"
                            component={Link}
                            href="/plans"
                            endIcon={<ArrowForwardRounded />}
                          >
                            View plans
                          </Button>
                        </Stack>
                      }
                    />
                  )
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

Routes.getLayout = props => (
  <DefaultLayout
    title="Routes"
    {...props}
  />
);

export default Routes;