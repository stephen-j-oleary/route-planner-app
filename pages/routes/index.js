import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import DefaultLayout from "@/components/Layouts/Default";
import DeleteRoute from "@/components/Routes/DeleteRoute";
import RoutesList from "@/components/Routes/List";
import SaveRoute from "@/components/Routes/SaveRoute";
import UnsaveRoute from "@/components/Routes/UnsaveRoute";
import { useGetDatabaseRoutes } from "@/shared/reactQuery/useDatabaseRoutes";
import { useGetLocalStorageRoutesByUser } from "@/shared/reactQuery/useLocalStorageRoutes";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";


export default function CreateRoute() {
  const authUser = useGetSession({ select: selectUser });

  const recentRoutes = useGetLocalStorageRoutesByUser(
    authUser.data?._id,
    { enabled: authUser.isSuccess }
  );
  const savedRoutes = useGetDatabaseRoutes();


  return (
    <ErrorBoundary resetApproach="fullReload">
      <AuthGuard>
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
                    visible={3}
                    actions={item => (
                      savedRoutes.data?.find(r => r._id === item._id)
                        ? <UnsaveRoute route={item} />
                        : <SaveRoute route={item} />
                    )}
                    loading={recentRoutes.isIdle || recentRoutes.isLoading}
                    error={recentRoutes.error}
                    data={recentRoutes.isSuccess && recentRoutes.data}
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
                  <RoutesList
                    visible={3}
                    actions={item => <DeleteRoute route={item} />}
                    loading={savedRoutes.isIdle || savedRoutes.isLoading}
                    error={savedRoutes.error}
                    data={savedRoutes.isSuccess && savedRoutes.data}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </AuthGuard>
    </ErrorBoundary>
  );
}

CreateRoute.getLayout = props => (
  <DefaultLayout
    title="Routes"
    {...props}
  />
);