import { Container } from "@mui/material";

import AuthGuard from "@/components/AuthGuard";
import DefaultLayout from "@/components/Layouts/Default";
import PageHeading from "@/components/PageHeading";
import CreateRouteForm from "@/components/Routes/CreateForm";


export default function CreateRoute() {
  return (
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
  );
}

CreateRoute.getLayout = props => (
  <DefaultLayout
    title="Create Route"
    headingComponent="h2"
    {...props}
  />
);