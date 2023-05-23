import ErrorLayout from "@/components/Layouts/Error";
import ViewError from "@/components/ViewError";

export default function InternalError() {
  return (
    <ViewError
      status={500}
      primary="Internal error"
      primaryComponent="h1"
    />
  );
}

InternalError.getLayout = props => (
  <ErrorLayout
    title="Internal Error"
    {...props}
  />
);