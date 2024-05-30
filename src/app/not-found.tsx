import ViewError from "@/components/ui/ViewError";


export default function NotFound() {
  return (
    <ViewError
      status={404}
      primary="Page not found"
      primaryComponent="h1"
      sx={{ mt: 3 }}
    />
  );
}