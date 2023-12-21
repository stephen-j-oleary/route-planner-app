import { Container } from "@mui/material";

import CreateRouteForm from "@/components/Routes/CreateForm";
import AuthGuard from "@/components/ui/AuthGuard";
import DefaultLayout from "@/components/ui/Layouts/Default";
import PageHeading from "@/components/ui/PageHeading";


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