import ErrorLayout from "@/components/Layouts/Error";
import ViewError from "@/components/ViewError";
import { NextPageWithLayout } from "@/pages/_app";


const NotFoundPage: NextPageWithLayout = () => (
  <ViewError
    status={404}
    primary="Page not found"
    primaryComponent="h1"
  />
);

NotFoundPage.getLayout = props => (
  <ErrorLayout
    title="Not Found"
    {...props}
  />
);

export default NotFoundPage;