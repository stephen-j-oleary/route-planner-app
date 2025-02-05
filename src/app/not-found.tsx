import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import ViewError from "@/components/ui/ViewError";


export default function NotFound() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Header />

      <ViewError
        status={404}
        primary="Page not found"
        primaryComponent="h1"
        sx={{ flex: 1, my: 3 }}
      />

      <Footer />
    </div>
  );
}