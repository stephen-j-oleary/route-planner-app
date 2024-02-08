import ViewError from "@/components/ui/ViewError";
import { NextPageWithLayout } from "@/pages/_app";


const NotFoundPage: NextPageWithLayout = () => (
  <ViewError
    status={404}
    primary="Page not found"
    primaryComponent="h1"
  />
);

NotFoundPage.layoutProps = {
  title: "Not Found",
  justifyContent: "center",
  spacing: 3,
};


export default NotFoundPage;