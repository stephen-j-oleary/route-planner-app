import ErrorLayout from "@/components/ui/Layouts/Error";
import ViewError from "@/components/ui/ViewError";
import { NextPageWithLayout } from "@/pages/_app";


const InternalErrorPage: NextPageWithLayout = () => (
  <ViewError
    status={500}
    primary="Internal error"
    primaryComponent="h1"
  />
);

InternalErrorPage.getLayout = props => (
  <ErrorLayout
    title="Internal Error"
    {...props}
  />
);

export default InternalErrorPage;