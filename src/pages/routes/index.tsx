import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";

import DeleteRoute from "@/components/Routes/Delete";
import RoutesList from "@/components/Routes/List";
import SaveRoute from "@/components/Routes/Save";
import AuthGuard from "@/components/ui/AuthGuard";
import DefaultLayout from "@/components/ui/Layouts/Default";
import { NextPageWithLayout } from "@/pages/_app";
import { useGetRoutes, useGetRoutesLocal } from "@/reactQuery/useRoutes";


const Routes: NextPageWithLayout = () => {
  const recentRoutes = useGetRoutesLocal();
  const savedRoutes = useGetRoutes();


  return (
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
                <RoutesList
                  routesQuery={savedRoutes}
                  visible={3}
                  actions={item => <DeleteRoute route={item} />}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AuthGuard>
  );
}

Routes.getLayout = props => (
  <DefaultLayout
    title="Routes"
    {...props}
  />
)

export default Routes