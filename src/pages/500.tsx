import ViewError from "@/components/ui/ViewError";
import { NextPageWithLayout } from "@/pages/_app";


const InternalErrorPage: NextPageWithLayout = () => (
  <ViewError
    status={500}
    primary="Internal error"
    primaryComponent="h1"
  />
);

InternalErrorPage.layoutProps = {
  title: "Internal Error",
  justifyContent: "center",
  spacing: 3,
};


export default InternalErrorPage;