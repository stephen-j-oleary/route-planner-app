import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import CreateRouteForm from "@/components/Routes/CreateForm";


export default function CreateRoute() {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <Container
          maxWidth="sm"
          disableGutters
          sx={{
            marginY: 5,
            padding: 3,
            borderInline: "1px solid",
            borderColor: "grey.300",
          }}
        >
          <PageHeading title="Create a route" />

          <CreateRouteForm />
        </Container>
      </AuthGuard>
    </ErrorBoundary>
  );
}

CreateRoute.getLayout = props => (
  <DefaultLayout
    title="Create Route"
    headingComponent="h2"
    {...props}
  />
);