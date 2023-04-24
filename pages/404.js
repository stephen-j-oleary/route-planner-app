import ErrorLayout from "@/components/Layouts/Error";
import ViewError from "@/components/ViewError";

export default function NotFound() {
  return (
    <ViewError
      status={404}
      primary="Page not found"
      primaryComponent="h1"
    />
  );
}

NotFound.getLayout = props => (
  <ErrorLayout
    title="Not Found"
    {...props}
  />
);